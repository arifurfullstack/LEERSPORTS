/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Image as ImageIcon, FileText, CheckCheck, 
  Globe, Sparkles, Smile, MessageSquare, ShieldAlert
} from "lucide-react";
import { Message, TrainerProfile } from "../types";

interface DirectMessagesProps {
  trainers: TrainerProfile[];
  currentUser: { id: string; name: string; email: string; role: string; avatar: string } | null;
}

export default function DirectMessages({ trainers, currentUser }: DirectMessagesProps) {
  
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile>(trainers[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg_1",
      senderId: trainers[0].id,
      receiverId: "trainee_david",
      text: "Hey David! Did you review the wave-loading spreadsheet for squats I uploaded yesterday?",
      timestamp: "10:30 AM",
      isRead: true,
    },
    {
      id: "msg_2",
      senderId: "trainee_david",
      receiverId: trainers[0].id,
      text: "Yes Coach, I just completed the first set at 82.5kg. Felt incredibly crisp and fluid!",
      timestamp: "10:32 AM",
      isRead: true,
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsgId = `msg_user_${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      senderId: "trainee_david",
      receiverId: selectedTrainer.id,
      text: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");

    // Simulate Coach typing and replying automatically after 2 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
        "Incredible focus, David! Remember to maintain peak pelvic bracing during terminal knee extension.",
        "Solid work. Let's make sure you increase your hydration by 500ml before tomorrow's pulling block.",
        "Excellent. Keep the lats swept super tight as the bar passes the mid-thigh. Consistency is key!",
        "Yes, that's exactly the cue. Let's aim to record tomorrow's heaviest single for our posture desk analysis.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const coachMsg: Message = {
        id: `msg_coach_${Date.now()}`,
        senderId: selectedTrainer.id,
        receiverId: "trainee_david",
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
      };

      setMessages((prev) => [...prev, coachMsg]);
    }, 2000);
  };

  const handleTranslateMessage = async (messageId: string, text: string) => {
    setTranslatingId(messageId);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: "Spanish" }), // Spanish default for chats
      });
      const data = await response.json();
      setTranslatedTexts((prev) => ({
        ...prev,
        [messageId]: data.translatedText,
      }));
    } catch (err) {
      console.error(err);
      setTranslatedTexts((prev) => ({
        ...prev,
        [messageId]: `[Error] ${text}`,
      }));
    } finally {
      setTranslatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 h-[calc(100vh-120px)] flex flex-col">
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 rounded-3xl border border-white/5 overflow-hidden glass-panel h-full">
        
        {/* Left Side: Active chat list */}
        <div className="border-r border-white/5 flex flex-col bg-luxury-gray/40">
          <div className="p-4 border-b border-white/5 text-left">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Encrypted Chats</span>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Locker Consultations</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {trainers.map((t) => {
              const isSelected = selectedTrainer.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrainer(t)}
                  className={`p-4 text-left cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected ? "bg-brand/10 border-l-2 border-brand" : "hover:bg-white/5"
                  }`}
                >
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate block">{t.name}</span>
                      <span className="text-[8px] font-mono text-gray-500">Active</span>
                    </div>
                    <span className="text-[10px] text-gray-400 truncate block">{t.specialty}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active conversation Workspace */}
        <div className="md:col-span-2 flex flex-col h-full bg-black/30 justify-between">
          
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-luxury-gray/30 text-left">
            <div className="flex items-center gap-2.5">
              <img src={selectedTrainer.avatar} alt={selectedTrainer.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  {selectedTrainer.name}
                  <span className="text-brand">✓</span>
                </h4>
                <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">{selectedTrainer.specialty}</p>
              </div>
            </div>

            <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg uppercase font-bold">
              Secure Direct Link
            </span>
          </div>

          {/* Messages viewport */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === "trainee_david";
              const translated = translatedTexts[msg.id];

              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {!isMe && (
                    <img src={selectedTrainer.avatar} alt={selectedTrainer.name} className="w-6 h-6 rounded-full object-cover shrink-0 mt-1 border border-white/10" />
                  )}

                  <div className="space-y-1">
                    <div 
                      className={`p-3.5 rounded-2xl text-xs text-left leading-normal leading-normal ${
                        isMe 
                          ? "bg-brand text-white rounded-tr-none shadow-lg shadow-brand/10" 
                          : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-none"
                      }`}
                    >
                      <p>{translated ? translated : msg.text}</p>
                      
                      {/* Translate button inline */}
                      <button
                        onClick={() => handleTranslateMessage(msg.id, msg.text)}
                        disabled={translatingId === msg.id}
                        className="text-[8px] font-mono text-gray-400 hover:text-white mt-1.5 flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <Globe className="w-2.5 h-2.5" />
                        {translatingId === msg.id ? "Translating..." : translated ? "Show original" : "Translate (ES)"}
                      </button>
                    </div>

                    <div className={`flex items-center gap-1 text-[9px] font-mono text-gray-500 ${isMe ? "justify-end" : "justify-start"}`}>
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-brand" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Coach typing simulator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                <img src={selectedTrainer.avatar} alt={selectedTrainer.name} className="w-6 h-6 rounded-full object-cover" />
                <span>{selectedTrainer.name} is drafting technical prescription...</span>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* Message input dock */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-luxury-gray/20 flex gap-2">
            <button 
              type="button"
              onClick={() => alert("Upload media attachment simulated! Selected file locked.")}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Attach progress document"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <input
              type="text"
              required
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Send message securely to ${selectedTrainer.name}...`}
              className="flex-1 bg-luxury-gray border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
            />
            <button
              type="submit"
              className="bg-brand hover:bg-brand-hover p-3 rounded-xl text-white cursor-pointer transition-colors shadow-lg shadow-brand/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
