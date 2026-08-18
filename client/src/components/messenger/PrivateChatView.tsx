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
  CheckCircle2,
  Search,
  MessageSquare,
  ArrowLeft,
  Compass,
} from 'lucide-react';


interface ConversationThread {
  id: string;
  designerId: string;
  name: string;
  title: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
  linkedProject: string;
  linkedRoom: string;
}

const SAMPLE_THREADS: ConversationThread[] = [
  {
    id: 'thread-ethan',
    designerId: 'des-ethan-rodrigues',
    name: 'Ethan Rodrigues',
    title: 'Principal Spatial Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'I reworked the layout: 91/100 Master Bedroom with 92 cm clearance...',
    timestamp: '9:30 AM',
    unreadCount: 1,
    online: true,
    linkedProject: 'My 2BHK Apartment',
    linkedRoom: 'Master Bedroom (14 × 12 ft)',
  },
  {
    id: 'thread-elena',
    designerId: 'des-elena-rostova',
    name: 'Elena Rostova',
    title: 'Minimalist & Japandi Specialist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Your Japandi living room circulation study and natural lighting model are ready for review.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    online: false,
    linkedProject: 'My 2BHK Apartment',
    linkedRoom: 'Living Room',
  },
  {
    id: 'thread-maya',
    designerId: 'des-maya-lin',
    name: 'Maya Lin',
    title: 'Lighting & Biophilic Designer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'Looking forward to our spatial consultation on the open loft floor plan.',
    timestamp: '2d ago',
    unreadCount: 0,
    online: true,
    linkedProject: 'My 2BHK Apartment',
    linkedRoom: 'All Rooms',
  },
  {
    id: 'thread-marcus',
    designerId: 'des-marcus-vance',
    name: 'Marcus Vance',
    title: 'Custom Millwork & Storage Expert',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    lastMessage: 'The custom wardrobe CAD measurements have been verified against wall studs.',
    timestamp: 'Aug 14',
    unreadCount: 0,
    online: false,
    linkedProject: 'My 2BHK Apartment',
    linkedRoom: 'Master Bedroom',
  },
];

export const PrivateChatView: React.FC = () => {
  const { setCurrentView, setStudioMode, addToast } = useUI();
  const { applyLayout, activeRoom } = useProject();
  const { user, role } = useAuth();

  // Active selected thread (null = show DM inbox / empty detail state)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>('thread-ethan');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, selectedThreadId]);

  const activeThread = SAMPLE_THREADS.find((t) => t.id === selectedThreadId);

  const filteredThreads = SAMPLE_THREADS.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickPrompts = [
    'Can you check the wardrobe clearance with the door?',
    'What if we rotate the bed towards the east wall?',
    'Is the natural light adequate for the study desk?',
  ];

  const handleSendText = (textToSend: string) => {
    if (!textToSend.trim() || !activeThread) return;

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

    // Simulated intelligent Architect reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = `I reviewed your note regarding the ${activeRoom.name}. The spatial circulation flow is optimized, and all corridor walkways maintain standard clearance. Let me know if you want me to test another furniture permutation!`;

      const lower = textToSend.toLowerCase();
      if (lower.includes('wardrobe') || lower.includes('clearance') || lower.includes('door')) {
        replyText = `Great question! The wardrobe is aligned flush to the solid west perimeter wall, keeping a generous 105 cm clearance from the door swing arc. It avoids any spatial collision.`;
      } else if (lower.includes('bed') || lower.includes('east') || lower.includes('rotate')) {
        replyText = `Rotating the bed would preserve walking paths, but keeping it on the solid north wall provides the best symmetrical nightstand spacing and natural sightlines from the entrance.`;
      } else if (lower.includes('light') || lower.includes('window') || lower.includes('desk')) {
        replyText = `The study desk is placed adjacent to the architectural window sill, allowing direct daylight from the side without creating monitor screen glare.`;
      }

      const designerReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        consultationId: SAMPLE_CONSULTATION.id,
        senderId: activeThread.designerId,
        senderName: role === 'designer' ? 'Alexander Wright (Client)' : `${activeThread.name} (Architect)`,
        senderRole: role === 'designer' ? 'user' : 'designer',
        senderAvatar: activeThread.avatar,
        timestamp: 'Just now',
        text: replyText,
      };

      setMessages((prev) => [...prev, designerReply]);
      addToast({
        type: 'info',
        title: 'New Message',
        message: `${activeThread.name} replied to your consultation thread.`,
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
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] bg-[#FAF9F5] dark:bg-[#0D1117] select-none font-sans overflow-hidden transition-colors duration-200">
      {/* ------------------------------------------------------------- */}
      {/* LEFT COLUMN: DIRECT MESSAGES INBOX / CONVERSATIONS LIST */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`w-full md:w-80 lg:w-96 bg-white dark:bg-[#12161E] border-r border-[#E8E6DF] dark:border-[#21262D] flex flex-col h-full z-20 transition-all ${
          selectedThreadId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Inbox Header */}
        <div className="p-4 border-b border-[#E8E6DF] dark:border-[#21262D] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#B26A4A] dark:text-[#D4AF37]" />
              <h2 className="text-base font-extrabold text-neutral-950 dark:text-white">
                Direct Messages
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#FAF4ED] dark:bg-[#282115] text-[#8C5232] dark:text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#E5D4C4] dark:border-[#523E28]">
              {SAMPLE_THREADS.length} Threads
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search architects & messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0EEE8] dark:divide-[#1C2128]">
          {filteredThreads.map((thread) => {
            const isSelected = thread.id === selectedThreadId;
            return (
              <div
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`p-4 flex items-start gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FAF4ED] dark:bg-[#1C2128] border-l-4 border-[#B26A4A] dark:border-[#D4AF37]'
                    : 'hover:bg-[#FAF9F6] dark:hover:bg-[#161B22]'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#E8E6DF] dark:border-[#30363D]"
                  />
                  {thread.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#12161E] rounded-full" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {thread.name}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                      {thread.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#B26A4A] dark:text-[#D4AF37] font-semibold truncate">
                    {thread.title}
                  </p>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {thread.lastMessage}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 truncate">
                      📍 {thread.linkedRoom}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span className="w-4 h-4 bg-[#B26A4A] dark:bg-[#D4AF37] text-white dark:text-neutral-950 rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Find more architects shortcut */}
        <div className="p-3 border-t border-[#E8E6DF] dark:border-[#21262D] bg-[#FAF9F6] dark:bg-[#0D1117]">
          <button
            onClick={() => setCurrentView('marketplace')}
            className="w-full py-2 px-3 bg-white dark:bg-[#161B22] hover:bg-[#F5F4EF] dark:hover:bg-[#21262D] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5 text-[#B26A4A] dark:text-[#D4AF37]" />
            <span>Browse Designer Directory</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT PANE: ACTIVE CHAT VIEW OR EMPTY DM STATE */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col h-full bg-[#FAF9F5] dark:bg-[#0D1117] overflow-hidden">
        {activeThread ? (
          <>
            {/* Top Chat Header */}
            <header className="h-16 bg-white dark:bg-[#12161E] border-b border-[#E8E6DF] dark:border-[#21262D] px-4 md:px-6 flex items-center justify-between z-10 shadow-2xs">
              <div className="flex items-center gap-3">
                {/* Back to DM Inbox Button (Mobile) */}
                <button
                  onClick={() => setSelectedThreadId(null)}
                  className="md:hidden p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg"
                  title="Back to inbox"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="relative">
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E8E6DF] dark:border-[#30363D]"
                  />
                  {activeThread.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#12161E] rounded-full" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                      {activeThread.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Consultation
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Linked Blueprint: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{activeThread.linkedProject} • {activeThread.linkedRoom}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Jump to 2D/3D Studio */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openProjectStudio('2d')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] dark:bg-[#1C2128] hover:bg-[#F0EEE8] dark:hover:bg-[#282E37] text-neutral-700 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-semibold shadow-2xs transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>2D Floor Plan</span>
                </button>

                <button
                  onClick={() => openProjectStudio('3d')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] dark:bg-[#1C2128] hover:bg-[#F0EEE8] dark:hover:bg-[#282E37] text-neutral-700 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs font-semibold shadow-2xs transition-all"
                >
                  <Box className="w-3.5 h-3.5 text-[#B26A4A] dark:text-[#D4AF37]" />
                  <span>3D Studio</span>
                </button>
              </div>
            </header>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
              <div className="text-center py-2">
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest bg-white dark:bg-[#161B22] px-3 py-1 rounded-full border border-[#E8E6DF] dark:border-[#30363D]">
                  Encrypted Spatial Blueprint Consultation
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 max-w-2xl ${
                      isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    }`}
                  >
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover border border-[#E8E6DF] dark:border-[#30363D] mb-1"
                      />
                    )}

                    <div className="space-y-1 max-w-[85%]">
                      {!isMe && (
                        <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 ml-1">
                          {msg.senderName}
                        </span>
                      )}

                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isMe
                            ? 'bg-neutral-950 dark:bg-emerald-950/80 text-white border border-neutral-800 dark:border-emerald-800'
                            : 'bg-white dark:bg-[#161B22] text-neutral-900 dark:text-neutral-100 border border-[#E8E6DF] dark:border-[#21262D]'
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* Interactive Blueprint Layout Attachment */}
                        {msg.layoutAttachment && (
                          <div className="mt-3 p-3.5 bg-[#FAF9F6] dark:bg-[#0D1117] rounded-xl border border-[#E8E6DF] dark:border-[#30363D] space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
                                <Sparkles className="w-3.5 h-3.5 text-[#B26A4A] dark:text-[#D4AF37]" />
                                <span>{msg.layoutAttachment.title}</span>
                              </div>
                              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px] rounded-md">
                                {msg.layoutAttachment.score}/100
                              </span>
                            </div>

                            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                              {msg.layoutAttachment.description}
                            </p>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => openProjectStudio('3d')}
                                className="px-3 py-1.5 bg-white dark:bg-[#161B22] hover:bg-[#F0EEE8] dark:hover:bg-[#21262D] text-neutral-800 dark:text-neutral-200 border border-[#E8E6DF] dark:border-[#30363D] rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Preview 3D</span>
                              </button>

                              <button
                                onClick={() => handleApplyDesignerLayout(msg)}
                                disabled={msg.layoutAttachment.applied}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                                  msg.layoutAttachment.applied
                                    ? 'bg-emerald-600 text-white cursor-default'
                                    : 'bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950'
                                }`}
                              >
                                {msg.layoutAttachment.applied ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    <span>Applied to Blueprint</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#8C5232]" />
                                    <span>Apply Revision to Blueprint</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={`flex items-center gap-1 text-[10px] font-mono text-neutral-400 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium pl-1">
                  <div className="w-2 h-2 rounded-full bg-[#B26A4A] dark:bg-[#D4AF37] animate-ping" />
                  <span>{activeThread.name} is drafting layout guidance...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Quick Prompts & Composer */}
            <div className="p-4 bg-white dark:bg-[#12161E] border-t border-[#E8E6DF] dark:border-[#21262D] space-y-3">
              {/* Quick Prompt Suggestions */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase shrink-0">
                  Quick Prompts:
                </span>
                {quickPrompts.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendText(prompt)}
                    className="px-3 py-1 bg-[#FAF9F6] dark:bg-[#1C2128] hover:bg-[#F0EEE8] dark:hover:bg-[#282E37] text-neutral-700 dark:text-neutral-300 border border-[#E8E6DF] dark:border-[#30363D] rounded-full shrink-0 transition-all active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Type a message to ${activeThread.name}... (press Enter to send)`}
                  className="flex-1 px-4 py-3 bg-[#FAF9F6] dark:bg-[#0D1117] border border-[#E8E6DF] dark:border-[#30363D] rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-5 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 disabled:opacity-40 disabled:hover:bg-neutral-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty DM Inbox State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white dark:bg-[#161B22] border border-[#E8E6DF] dark:border-[#30363D] flex items-center justify-center text-[#B26A4A] dark:text-[#D4AF37] shadow-sm">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Select a Conversation
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Choose an architect from your inbox on the left to review custom floor plans, discuss walking clearances, and apply 3D layout revisions.
              </p>
            </div>
            <button
              onClick={() => setSelectedThreadId('thread-ethan')}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              Message Ethan Rodrigues
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
