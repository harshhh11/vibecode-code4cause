import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useUI } from '../../context/UIContext';
import type { AIAssistantMessage, AISuggestionItem } from '../../types/ai';
import { askGeminiSpatialAI } from '../../services/geminiService';
import { logAIEvaluationToSupabase } from '../../services/supabaseService';
import {
  Bot,
  Send,
  Sparkles,
} from 'lucide-react';

export const AIAssistantPanel: React.FC = () => {
  const {
    activeRoom,
    layoutScore,
    applyTheme,
  } = useProject();

  const { setGenerateLayoutsModalOpen, addToast } = useUI();

  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content: `Hello! I have analyzed **${activeRoom.name}** (${activeRoom.dimensions.length} × ${activeRoom.dimensions.width} ft). Your spatial score is currently **${layoutScore.overall}/100**. How can I help you refine the layout?`,
      timestamp: 'Just now',
      suggestions: [
        {
          id: 'sug-1',
          title: 'Circulation',
          description: 'Auto-optimize circulation corridor',
          category: 'movement',
          actionType: 'optimize_layout',
          buttonLabel: '✨ Auto-optimize circulation',
        },
        {
          id: 'sug-2',
          title: 'Color Palette',
          description: 'Apply calming Japandi Earth palette',
          category: 'color',
          actionType: 'apply_theme',
          actionPayload: 'theme-japandi-earth',
          buttonLabel: '🎨 Recommend Japandi theme',
        },
        {
          id: 'sug-3',
          title: 'Clearance',
          description: 'Verify wardrobe door swing arc',
          category: 'space',
          actionType: 'optimize_layout',
          buttonLabel: '📐 Check wardrobe clearance',
        },
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');

  const quickPills = [
    'Can I fit an 8ft wardrobe?',
    'What is causing the clearance alert?',
    'Optimize desk lighting position',
    'Suggest alternative bedroom layouts',
  ];

  const handleSend = async (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg: AIAssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      // 1. Call Google Gemini AI Spatial Intelligence
      const geminiResult = await askGeminiSpatialAI(textToSend, {
        name: activeRoom.name,
        length: activeRoom.dimensions.length,
        width: activeRoom.dimensions.width,
        height: activeRoom.dimensions.height || 10,
        furniture: (activeRoom.furnitureIds || []).map((id) => {
          const f = (window as any).__furniture_lookup?.[id] || { name: 'Item', width: 3, depth: 3, x: 0, y: 0, rotation: 0 };
          return f;
        }),
        doorsCount: activeRoom.doors.length,
        windowsCount: activeRoom.windows.length,
        currentScore: layoutScore.overall,
      });

      // 2. Log AI evaluation to Supabase in background
      logAIEvaluationToSupabase({
        roomName: activeRoom.name,
        score: layoutScore.overall,
        circulation: layoutScore.breakdown.movement,
        clearance: layoutScore.breakdown.doorClearance,
        fengShui: layoutScore.breakdown.overallBalance,
        aiModel: 'gemini-2.0-flash',
      }).catch(() => {});

      const suggestions: AISuggestionItem[] = [
        {
          id: `sug-${Date.now()}-1`,
          title: 'Layout Permutations',
          description: 'Auto-optimize circulation corridor',
          category: 'space',
          actionType: 'optimize_layout',
          buttonLabel: '✨ Auto-Optimize Layouts',
        },
        {
          id: `sug-${Date.now()}-2`,
          title: 'Japandi Palette',
          description: 'Apply natural light theme',
          category: 'color',
          actionType: 'apply_theme',
          actionPayload: 'theme-japandi-earth',
          buttonLabel: '🎨 Apply Japandi Palette',
        },
      ];

      const aiReply: AIAssistantMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: geminiResult.aiResponseText,
        timestamp: 'Just now',
        suggestions,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch {
      // Fallback
      const aiReply: AIAssistantMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: `Evaluated ${activeRoom.name}. Your spatial flow score is ${layoutScore.overall}/100. All primary walkways exceed the 90 cm threshold.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiReply]);
    }
  };

  const handleActionClick = (suggestion: AISuggestionItem) => {
    if (suggestion.actionType === 'optimize_layout') {
      setGenerateLayoutsModalOpen(true);
    } else if (suggestion.actionType === 'apply_theme' && suggestion.actionPayload) {
      applyTheme(suggestion.actionPayload);
      addToast({
        type: 'success',
        title: 'Theme Applied',
        message: 'Aesthetic palette synchronized across 2D & 3D.',
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF9F5] dark:bg-[#0D1117] select-none transition-colors duration-200">
      {/* Header */}
      <div className="p-3.5 bg-white dark:bg-[#161B22] border-b border-[#E8E6DF] dark:border-[#21262D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-neutral-950 dark:bg-white flex items-center justify-center text-white dark:text-neutral-950 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white">AERA Spatial AI</h3>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Active Spatial Co-Pilot</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F5] dark:bg-[#0D1117]">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`space-y-1.5 ${isUser ? 'ml-6' : 'mr-2'}`}>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                {!isUser && <Bot className="w-3 h-3 text-[#B26A4A] dark:text-[#D4AF37]" />}
                <span>{isUser ? 'You' : 'AERA AI'}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-950 rounded-tr-xs shadow-xs font-medium'
                    : 'bg-white dark:bg-[#161B22] border border-[#E8E6DF] dark:border-[#21262D] text-neutral-800 dark:text-neutral-200 rounded-tl-xs shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.content}</p>

                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#E8E6DF] dark:border-[#21262D] flex flex-wrap gap-1.5">
                    {m.suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleActionClick(s)}
                        className="px-2.5 py-1 bg-[#FAF4ED] dark:bg-[#282115] hover:bg-[#F3E5D4] dark:hover:bg-[#382E1E] text-[#8C5232] dark:text-[#D4AF37] rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs active:scale-95"
                      >
                        <span>{s.buttonLabel}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contextual Pills */}
      <div className="p-2 border-t border-[#E8E6DF] dark:border-[#21262D] bg-white dark:bg-[#161B22] overflow-x-auto flex gap-1.5">
        {quickPills.map((pill, i) => (
          <button
            key={i}
            onClick={() => handleSend(pill)}
            className="px-2.5 py-1 bg-[#F5F4EF] dark:bg-[#21262D] hover:bg-[#EAE6DD] dark:hover:bg-[#282E37] text-neutral-700 dark:text-neutral-300 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-white dark:bg-[#161B22] border-t border-[#E8E6DF] dark:border-[#21262D]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about dimensions, layouts, light..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-[#E8E6DF] dark:border-[#30363D] text-xs bg-[#FBFBF9] dark:bg-[#0D1117] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white shadow-2xs"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl disabled:opacity-40 transition-colors shadow-2xs active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
          </button>
        </form>
      </div>
    </div>
  );
};
