/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Award, HelpCircle, Send, CheckCircle2, Archive, 
  MessageSquare, User, Clock, ArrowRight, FileVideo, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TrainerProfile, CoachingQuestion } from "../types";

interface CoachingPortalProps {
  trainers: TrainerProfile[];
  coachingQuestions: CoachingQuestion[];
  currentUser: { id: string; name: string; email: string; role: string; avatar: string } | null;
  onSubmitQuestion: (newQuestion: Omit<CoachingQuestion, "id" | "traineeId" | "traineeName" | "traineeAvatar" | "status" | "date">) => void;
  onSubmitFollowUp: (questionId: string, text: string) => void;
}

export default function CoachingPortal({
  trainers,
  coachingQuestions,
  currentUser,
  onSubmitQuestion,
  onSubmitFollowUp,
}: CoachingPortalProps) {
  
  const [activeTab, setActiveTab] = useState<"my_tickets" | "new_ticket">("my_tickets");
  
  // New ticket state
  const [selectedTrainerId, setSelectedTrainerId] = useState(trainers[0]?.id || "");
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketText, setTicketText] = useState("");
  const [ticketMedia, setTicketMedia] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState("");

  // Follow up state
  const [followUpText, setFollowUpText] = useState("");

  const myTickets = coachingQuestions.filter(q => q.traineeId === "trainee_david");
  const [selectedTicket, setSelectedTicket] = useState<CoachingQuestion | null>(myTickets[0] || null);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketText.trim()) return;

    const matchedTrainer = trainers.find((t) => t.id === selectedTrainerId);

    onSubmitQuestion({
      trainerId: selectedTrainerId,
      trainerName: matchedTrainer ? matchedTrainer.name : "Elite Trainer",
      title: ticketTitle,
      text: ticketText,
      mediaUrl: ticketMedia || undefined,
      mediaType: ticketMedia ? "image" : undefined,
    });

    setTicketTitle("");
    setTicketText("");
    setTicketMedia("");
    setTicketSuccess("Biomechanical training request successfully booked! Your trainer has been alerted.");
    setActiveTab("my_tickets");
    setTimeout(() => setTicketSuccess(""), 4000);
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !followUpText.trim()) return;

    onSubmitFollowUp(selectedTicket.id, followUpText);
    setFollowUpText("");
    alert("Follow-up response dispatched successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "replied": return "text-brand bg-brand/10 border-brand/30";
      case "coached": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
      case "completed": return "text-blue-500 bg-blue-500/10 border-blue-500/30";
      default: return "text-gray-500 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Biomechanical Coaching Desk</h1>
          <p className="text-xs text-gray-400">Consult verified coaches, upload execution footage, and solve sticking points step-by-step.</p>
        </div>

        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 relative">
          {(["my_tickets", "new_ticket"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-4 py-2 text-xs font-mono font-bold uppercase rounded-xl transition-colors cursor-pointer select-none"
                style={{ color: isActive ? "#ffffff" : "#9ca3af" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="coachingActiveTab"
                    className="absolute inset-0 bg-brand rounded-xl shadow-lg shadow-brand/20 z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === "my_tickets" ? `My Cases (${myTickets.length})` : "+ Consult Trainer"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {ticketSuccess && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs mb-6 text-left">
          {ticketSuccess}
        </div>
      )}

      {/* TICKET VIEWER */}
      {activeTab === "my_tickets" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          
          {/* Ticket Selection List */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 text-left">Historical Coaching Logs</h3>
            {myTickets.length === 0 ? (
              <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-gray-500 bg-luxury-gray">
                <Clock className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-xs font-mono">No bookings on ledger.</p>
                <p className="text-[10px] text-gray-600 mt-1">Click Consult Trainer to initiate biomechanical review.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myTickets.map((ticket) => {
                  const isSelected = selectedTicket?.id === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="relative p-4 rounded-2xl text-left cursor-pointer transition-colors border border-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeTicketHighlight"
                          className="absolute inset-0 bg-brand/10 border border-brand/40 rounded-2xl z-0"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono text-gray-400">Coach: {ticket.trainerName}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{ticket.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-2 font-mono">Submitted: {ticket.date.split("T")[0]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ticket detail workstation */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="p-6 rounded-2xl glass-panel text-left space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">{selectedTicket.title}</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">Assigned Coach: <span className="text-brand font-semibold">{selectedTicket.trainerName}</span> • ID: {selectedTicket.id}</p>
                  </div>
                  <span className={`self-start sm:self-center px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase border ${getStatusColor(selectedTicket.status)}`}>
                    Status: {selectedTicket.status}
                  </span>
                </div>

                {/* Progressive Timeline Visualizer */}
                <div className="p-4 bg-luxury-gray/50 border border-white/5 rounded-xl space-y-3">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Prescription Progression Tracking</span>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[
                      { step: "pending", label: "1. Pending Upload" },
                      { step: "replied", label: "2. Coached Reply" },
                      { step: "followup", label: "3. User Follow-up" },
                      { step: "completed", label: "4. Final Answer" }
                    ].map((stepObj, idx) => {
                      const isActive = 
                        (stepObj.step === "pending" && selectedTicket.status === "pending") ||
                        (stepObj.step === "replied" && selectedTicket.status === "replied") ||
                        (stepObj.step === "followup" && selectedTicket.status === "coached") ||
                        (stepObj.step === "completed" && selectedTicket.status === "completed" || selectedTicket.status === "archived");
                      return (
                        <div 
                          key={idx} 
                          className={`p-2 rounded-lg border text-[9px] font-mono uppercase font-bold transition-all ${
                            isActive 
                              ? "bg-brand text-white border-brand glow-box-red" 
                              : "bg-black/35 text-gray-500 border-white/5"
                          }`}
                        >
                          {stepObj.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Conversation Block */}
                <div className="space-y-4">
                  
                  {/* Step 1: Trainee's initial question */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Trainee Initial Submission</span>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed leading-normal">
                      {selectedTicket.text}
                    </div>
                  </div>

                  {/* Step 2: Trainer's first reply */}
                  {selectedTicket.trainerReplyText && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono text-brand uppercase font-semibold">Coach Technical Analysis</span>
                      <div className="p-4 rounded-xl bg-brand/5 border border-brand/15 text-xs text-gray-300 leading-relaxed">
                        {selectedTicket.trainerReplyText}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Trainee's follow-up */}
                  {selectedTicket.followUpText && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">Trainee Follow-Up Consultation</span>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed">
                        {selectedTicket.followUpText}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Final prescription */}
                  {selectedTicket.finalResponseText && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono text-emerald-500 uppercase font-semibold">Coach Final Resolution Summary</span>
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-gray-300 leading-relaxed">
                        {selectedTicket.finalResponseText}
                      </div>
                    </div>
                  )}

                </div>

                {/* Submitting Follow up Form (Triggered only when stage is "replied" i.e. Trainer answered once) */}
                {selectedTicket.status === "replied" && (
                  <form onSubmit={handleSendFollowUp} className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-gray-400">Ask your Trainer a Follow-Up Question</label>
                      <span className="text-[10px] font-mono text-brand">Stage: User Consultation</span>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={followUpText}
                      onChange={(e) => setFollowUpText(e.target.value)}
                      placeholder="Ask the coach for clarification regarding their cues, pacing, or modifications..."
                      className="w-full bg-luxury-gray border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-mono uppercase font-bold tracking-wider cursor-pointer transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Follow Up
                      </button>
                    </div>
                  </form>
                )}

              </div>
            ) : (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-white/10 text-center text-gray-500">
                <Clock className="w-10 h-10 text-gray-700 mb-2" />
                <p className="text-sm font-mono text-gray-400">No Case Active</p>
                <p className="text-xs text-gray-600 mt-1">Select a booking ticket on the left panel to review its progressive coaching details.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* NEW TICKET CREATOR */}
      {activeTab === "new_ticket" && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl glass-panel text-left space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-brand" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-white">Consult verified Specialist</h3>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Select Creator Specialist</label>
              <select
                value={selectedTrainerId}
                onChange={(e) => setSelectedTrainerId(e.target.value)}
                className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialty}) — Subscribed • Inclusive Bookings
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Biomechanics Topic / Title</label>
              <input
                type="text"
                required
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                placeholder="e.g. Sharp pinch in left hip socket at bottom depth squat"
                className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Question & Execution Specifics</label>
              <textarea
                required
                rows={6}
                value={ticketText}
                onChange={(e) => setTicketText(e.target.value)}
                placeholder="Describe what percentage load this occurs at, warmups used, and any existing structural injuries..."
                className="w-full bg-luxury-gray border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-brand transition-colors leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Execution Video / Image URL (Optional)</label>
              <input
                type="url"
                value={ticketMedia}
                onChange={(e) => setTicketMedia(e.target.value)}
                placeholder="e.g. Unsplash URL showing stance alignment"
                className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-gray-400 leading-normal font-mono">
              ⚡ Your trainer is contractually committed to respond with deep technical cues, video reviews, or custom supplementary files within 48 business hours.
            </div>

            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-brand/30"
            >
              Dispatch Biomechanical Query
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
