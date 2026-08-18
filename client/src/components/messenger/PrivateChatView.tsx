import React, { useState, useRef, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_MESSAGES, SAMPLE_CONSULTATION } from '../../data/sampleConversations';
import type { ChatMessage } from '../../types/designer';
import {
  Send,
  Sparkles,
  Eye,
  Box,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';


export const PrivateChatView: React.FC = () => {
  const { setCurrentView, setStudioMode, addToast } = useUI();
  const { applyLayout, activeRoom } = useProject();
  const { user, role } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickPrompts = [
    'Can you check the wardrobe clearance with the door?',
    'What if we rotate the bed towards the east wall?',
    'Is the natural light adequate for the study desk?',
  ];

  const handleSendText = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      consultationId: SAMPLE_CONSULTATION.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: role === 'designer' ? 'designer' : 'user',
      senderAvatar: user.avatar,
      timestamp: 'Just now',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Trigger simulated intelligent Architect / Designer reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = `I reviewed your note regarding the ${activeRoom.name}. The spatial circulation flow is optimized, and all corridor walkways maintain the mandatory clearance. Let me know if you want me to test another furniture permutation!`;
      
      const lower = textToSend.toLowerCase();
      if (lower.includes('wardrobe') || lower.includes('clearance') || lower.includes('door')) {
        replyText = `Great question! The wardrobe is aligned flush to the solid perimeter wall, keeping a generous 105 cm clearance from the door swing arc. It strictly avoids any spatial collision.`;
      } else if (lower.includes('bed') || lower.includes('east') || lower.includes('rotate')) {
        replyText = `Rotating the bed would preserve walking paths, but keeping it on the solid north wall provides the best symmetrical nightstand spacing and natural sightlines from the entrance.`;
      } else if (lower.includes('light') || lower.includes('window') || lower.includes('desk')) {
        replyText = `The study desk is placed adjacent to the architectural window sill, allowing direct daylight from the side without creating monitor screen glare.`;
      }

      const designerReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        consultationId: SAMPLE_CONSULTATION.id,
        senderId: 'designer-ethan-1',
        senderName: role === 'designer' ? 'Alexander Wright (Client)' : 'Ethan Rodrigues (Lead Architect)',
        senderRole: role === 'designer' ? 'user' : 'designer',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        timestamp: 'Just now',
        text: replyText,
      };

      setMessages((prev) => [...prev, designerReply]);
      addToast({
        type: 'info',
        title: 'New Message',
        message: 'Ethan Rodrigues replied to your consultation thread.',
      });
    }, 1400);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendText(inputText);
  };

  const handleApplyDesignerLayout = (msg: ChatMessage) => {
    if (!msg.layoutAttachment?.layoutData) return;
    applyLayout(msg.layoutAttachment.layoutData);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id && m.layoutAttachment
          ? { ...m, layoutAttachment: { ...m.layoutAttachment, applied: true } }
          : m
      )
    );

    addToast({
      type: 'success',
      title: 'Designer Revision Applied!',
      message: 'Your Master Bedroom blueprint and 3D scene have been updated.',
    });
  };

  const openProjectStudio = (mode: '2d' | '3d' = '2d') => {
    setStudioMode(mode);
    setCurrentView('studio');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-[#FAF9F5] dark:bg-[#0D1117] select-none">
      {/* Top Project Context Header */}
      <header className="h-16 bg-white dark:bg-[#12151B] border-b border-[#E8E6DF] dark:border-[#30363D] px-6 flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={role === 'designer' ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt="Collaborator"
              className="w-10 h-10 rounded-full object-cover border border-[#E8E6DF] dark:border-[#30363D]"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#12151B] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                {role === 'designer' ? 'Alexander Wright (Client)' : 'Ethan Rodrigues (Architect)'}
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Consultation
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Linked Blueprint: <span className="font-semibold text-neutral-800 dark:text-neutral-200">My 2BHK Apartment • {activeRoom.name} ({activeRoom.dimensions.length} × {activeRoom.dimensions.width} ft)</span>
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openProjectStudio('2d')}
            className="px-3 py-1.5 bg-[#F5F4EF] dark:bg-[#1E232B] hover:bg-[#EAE6DD] dark:hover:bg-[#2A313C] text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E8E6DF] dark:border-[#30363D]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2D Floor Plan</span>
          </button>
          <button
            onClick={() => openProjectStudio('3d')}
            className="px-3 py-1.5 bg-[#F5F4EF] dark:bg-[#1E232B] hover:bg-[#EAE6DD] dark:hover:bg-[#2A313C] text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E8E6DF] dark:border-[#30363D]"
          >
            <Box className="w-3.5 h-3.5 text-[#B26A4A]" />
            <span>3D Studio</span>
          </button>
          <button
            onClick={() => setCurrentView('studio')}
            className="px-4 py-1.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4B996] dark:text-[#8C5232]" />
            <span>Open Studio</span>
          </button>
        </div>
      </header>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-4">
        {/* Encrypted Notice Banner */}
        <div className="p-3 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8E6DF] dark:border-[#30363D] text-center text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            Real-time Project Messenger. All design feedback and layout revisions sync directly with your 2D and 3D studio.
          </span>
        </div>

        {messages.map((msg) => {
          const isMe =
            (role === 'user' && msg.senderRole === 'user') ||
            (role === 'designer' && msg.senderRole === 'designer');

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 animate-fadeIn ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full object-cover border border-[#E8E6DF] dark:border-[#30363D] shrink-0"
              />

              <div className={`space-y-1.5 max-w-[82%] ${isMe ? 'items-end' : ''}`}>
                <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : ''}`}>
                  <span className="font-bold text-neutral-900 dark:text-neutral-200">{msg.senderName}</span>
                  <span className="text-neutral-400 font-mono text-[10px]">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-neutral-950 dark:bg-emerald-950 text-white rounded-tr-xs shadow-xs border border-transparent dark:border-emerald-800/40'
                      : 'bg-white dark:bg-[#161B22] border border-[#E8E6DF] dark:border-[#30363D] text-neutral-800 dark:text-neutral-200 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Attached Layout Revision Card */}
                  {msg.layoutAttachment && (
                    <div className="mt-3 p-3.5 bg-[#FAF9F6] dark:bg-[#10141B] text-neutral-900 dark:text-neutral-100 rounded-xl border border-[#E8E6DF] dark:border-[#30363D] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#B26A4A]" />
                          <h4 className="text-xs font-bold">{msg.layoutAttachment.title}</h4>
                        </div>
                        <span className="font-mono text-xs font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                          {msg.layoutAttachment.score}/100
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {msg.layoutAttachment.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => openProjectStudio('3d')}
                          className="px-3 py-1.5 bg-white dark:bg-[#1E232B] hover:bg-neutral-100 dark:hover:bg-[#2A313C] border border-[#E8E6DF] dark:border-[#30363D] rounded-lg text-xs font-semibold flex items-center gap-1 text-neutral-800 dark:text-neutral-200"
                        >
                          <Box className="w-3.5 h-3.5 text-[#B26A4A]" />
                          <span>Preview 3D</span>
                        </button>

                        <button
                          onClick={() => handleApplyDesignerLayout(msg)}
                          disabled={msg.layoutAttachment.applied}
                          className="flex-1 py-1.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-2xs disabled:bg-emerald-700 dark:disabled:bg-emerald-600 dark:disabled:text-white transition-colors"
                        >
                          {msg.layoutAttachment.applied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              <span>Applied to Project</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-[#D4B996] dark:text-[#8C5232]" />
                              <span>Apply Revision to Blueprint</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isMe && (
                  <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-400">
                    <CheckCheck className="w-3 h-3 text-emerald-500" />
                    <span>Delivered</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 animate-fadeIn">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Ethan"
              className="w-8 h-8 rounded-full object-cover border border-[#E8E6DF] dark:border-[#30363D]"
            />
            <div className="p-3 bg-white dark:bg-[#161B22] border border-[#E8E6DF] dark:border-[#30363D] rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] text-neutral-400 ml-1 font-medium">Ethan is drafting a reply...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Prompts */}
      <div className="px-6 py-2 max-w-4xl w-full mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 shrink-0">
          Quick Prompts:
        </span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendText(prompt)}
            className="px-3 py-1 bg-white dark:bg-[#161B22] hover:bg-[#FAF4ED] dark:hover:bg-[#21262D] text-neutral-700 dark:text-neutral-300 border border-[#E8E6DF] dark:border-[#30363D] rounded-full text-xs whitespace-nowrap transition-colors shadow-2xs font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-white dark:bg-[#12151B] border-t border-[#E8E6DF] dark:border-[#30363D] max-w-4xl w-full mx-auto">
        <form onSubmit={handleSend} className="flex items-center gap-2.5">
          <input
            type="text"
            placeholder="Type a message or design question (press Enter to send)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-[#E8E6DF] dark:border-[#30363D] text-xs bg-[#FBFBF9] dark:bg-[#181D24] text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-40 active:scale-98"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 text-[#D4B996] dark:text-[#8C5232]" />
          </button>
        </form>
      </div>
    </div>
  );
};
