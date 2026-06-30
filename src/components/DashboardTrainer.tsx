/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  DollarSign, Users, Award, FileText, Send, Sparkles, 
  Plus, Check, HelpCircle, Eye, ShieldAlert, FileX, Download, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TrainerProfile, CoachingQuestion, Post, Short } from "../types";

interface DashboardTrainerProps {
  trainer: TrainerProfile;
  coachingQuestions: CoachingQuestion[];
  onReplyToQuestion: (questionId: string, replyText: string) => void;
  onAddPost: (newPost: Omit<Post, "id" | "likesCount" | "viewsCount" | "comments" | "date" | "translations">) => void;
  onAddShort: (newShort: Omit<Short, "id" | "likesCount" | "commentsCount" | "sharesCount">) => void;
}

function DashboardSkeleton({ type }: { type: "overview" | "coaching" | "publish" | "subscribers" }) {
  if (type === "overview") {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Revenue Analytics Grid Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl glass-panel relative overflow-hidden h-28 space-y-3">
              <div className="h-3 w-24 bg-white/5 rounded shimmer" />
              <div className="h-6 w-32 bg-white/5 rounded shimmer" />
              <div className="h-3 w-36 bg-white/5 rounded shimmer" />
            </div>
          ))}
        </div>

        {/* Shimmer chart layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel h-72 flex flex-col justify-between">
            <div className="h-3.5 w-44 bg-white/5 rounded shimmer mb-6" />
            <div className="flex items-end gap-3 h-48 pt-4">
              {[60, 40, 80, 50, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-white/5 rounded-t-lg shimmer animate-pulse" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="p-6 rounded-2xl glass-panel h-72 space-y-4">
            <div className="h-3.5 w-32 bg-white/5 rounded shimmer" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/5 rounded-full shimmer" />
                  <div className="h-3 w-40 bg-white/5 rounded shimmer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "coaching") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-3 w-40 bg-white/5 rounded shimmer" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 h-28">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/5 shimmer" />
                  <div className="h-3 w-20 bg-white/5 rounded shimmer" />
                </div>
                <div className="h-3 w-28 bg-white/5 rounded shimmer" />
                <div className="h-2.5 w-full bg-white/5 rounded shimmer" />
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-6 h-[400px]">
          <div className="flex items-start justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 shimmer" />
              <div className="space-y-1.5">
                <div className="h-3 w-28 bg-white/5 rounded shimmer" />
                <div className="h-2.5 w-16 bg-white/5 rounded shimmer" />
              </div>
            </div>
            <div className="h-5 w-20 bg-white/5 rounded-lg shimmer" />
          </div>
          <div className="space-y-3">
            <div className="h-3.5 w-1/2 bg-white/5 rounded shimmer" />
            <div className="h-3 w-full bg-white/5 rounded shimmer" />
            <div className="h-3 w-5/6 bg-white/5 rounded shimmer" />
          </div>
          <div className="h-32 rounded-xl bg-white/5 shimmer" />
        </div>
      </div>
    );
  }

  if (type === "publish") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="h-4 w-32 bg-white/5 rounded shimmer" />
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-2.5 w-20 bg-white/5 rounded shimmer" />
                <div className="h-10 w-full bg-white/5 rounded-xl shimmer" />
              </div>
            ))}
            <div className="h-10 w-full bg-white/5 rounded-xl shimmer" />
          </div>
        </div>
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="h-4 w-32 bg-white/5 rounded shimmer" />
          <div className="space-y-4 pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-2.5 w-20 bg-white/5 rounded shimmer" />
                <div className="h-10 w-full bg-white/5 rounded-xl shimmer" />
              </div>
            ))}
            <div className="h-10 w-full bg-white/5 rounded-xl shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl glass-panel text-left space-y-6 animate-pulse">
      <div className="h-4 w-44 bg-white/5 rounded shimmer" />
      <div className="space-y-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 shimmer" />
              <div className="space-y-1.5">
                <div className="h-3 w-28 bg-white/5 rounded shimmer" />
                <div className="h-2.5 w-32 bg-white/5 rounded shimmer" />
              </div>
            </div>
            <div className="h-5 w-16 bg-white/5 rounded shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardTrainer({
  trainer,
  coachingQuestions,
  onReplyToQuestion,
  onAddPost,
  onAddShort,
}: DashboardTrainerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "coaching" | "publish" | "subscribers">("overview");

  // Simulated loading state for trainer dashboard content blocks
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeSubTab]);

  // Coaching Queue states
  const pendingCoaching = coachingQuestions.filter(q => q.trainerId === trainer.id && q.status === "pending");
  const completedCoaching = coachingQuestions.filter(q => q.trainerId === trainer.id && q.status !== "pending");
  const [selectedQuestion, setSelectedQuestion] = useState<CoachingQuestion | null>(pendingCoaching[0] || null);
  const [replyText, setReplyText] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  // New Post state
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"public" | "premium">("public");
  const [postImage, setPostImage] = useState("");
  const [postSuccess, setPostSuccess] = useState("");

  // New Short state
  const [shortDesc, setShortDesc] = useState("");
  const [shortVideoUrl, setShortVideoUrl] = useState("");
  const [shortSuccess, setShortSuccess] = useState("");

  // Request server-side Gemini to draft coaching reply
  const handleGenerateAIDraft = async () => {
    if (!selectedQuestion) return;
    setIsDrafting(true);
    setReplyText("Loading expert AI analysis...");

    try {
      const response = await fetch("/api/ai-coaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traineeName: selectedQuestion.traineeName,
          questionTitle: selectedQuestion.title,
          questionText: selectedQuestion.text,
          fitnessData: "Weight: 84kg, Goal: Explosive strength & posture stability",
        }),
      });
      const data = await response.json();
      setReplyText(data.draft || "Draft generation failed.");
    } catch (err) {
      console.error(err);
      setReplyText("Could not connect to AI Coaching server. Try drafting manually.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !replyText.trim()) return;
    onReplyToQuestion(selectedQuestion.id, replyText);
    setReplyText("");
    setSelectedQuestion(null);
    alert("Reply successfully dispatched to Trainee's locker!");
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    onAddPost({
      trainerId: trainer.id,
      trainerName: trainer.name,
      trainerAvatar: trainer.avatar,
      title: postTitle,
      content: postContent,
      type: postType,
      mediaType: "image",
      mediaUrls: [postImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"],
      originalLanguage: "English",
    });

    setPostTitle("");
    setPostContent("");
    setPostImage("");
    setPostSuccess("Premium Post successfully published to Feed lockers!");
    setTimeout(() => setPostSuccess(""), 4000);
  };

  const handlePublishShort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortDesc.trim()) return;

    onAddShort({
      trainerId: trainer.id,
      trainerName: trainer.name,
      trainerAvatar: trainer.avatar,
      videoUrl: shortVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-man-preparing-for-weightlifting-training-in-gym-4886-large.mp4",
      description: shortDesc,
    });

    setShortDesc("");
    setShortVideoUrl("");
    setShortSuccess("Sleek Short published directly to the swiping Arena!");
    setTimeout(() => setShortSuccess(""), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-brand/20 text-brand text-[10px] font-mono tracking-wider font-bold uppercase">Verified Creator</span>
            {trainer.verified && <span className="text-emerald-500 font-bold text-xs">✓ Active Status</span>}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">{trainer.name}'s Office</h1>
          <p className="text-xs text-gray-400">Monetize your expertise, response queues, and premium content lockers.</p>
        </div>

        {/* Quick Nav bar */}
        <div className="flex gap-1.5 p-1 bg-luxury-gray border border-white/5 rounded-xl self-start md:self-center relative">
          {(["overview", "coaching", "publish", "subscribers"] as const).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className="relative px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer select-none"
                style={{ color: isActive ? "#ffffff" : "#9ca3af" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="trainerActiveSubTab"
                    className="absolute inset-0 bg-brand rounded-lg shadow-md shadow-brand/20 z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. OVERVIEW SUBTAB */}
      {activeSubTab === "overview" && (
        isLoading ? (
          <DashboardSkeleton type="overview" />
        ) : (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Revenue Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <DollarSign className="w-24 h-24 text-white" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Gross Creator Volume</p>
                <h3 className="text-2xl font-black text-white mt-1">${trainer.revenue.total.toLocaleString()}</h3>
                <p className="text-[10px] text-gray-400 mt-2">All time subscriptions & tips</p>
              </div>

              <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Users className="w-24 h-24 text-white" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Active Subscribers</p>
                <h3 className="text-2xl font-black text-white mt-1">{trainer.subscribersCount}</h3>
                <p className="text-[10px] text-brand mt-2 font-mono">Monthly Rate: ${trainer.monthlyPrice}/mo</p>
              </div>

              <div className="p-5 rounded-2xl glass-panel relative overflow-hidden border-l-2 border-brand">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <DollarSign className="w-24 h-24 text-white" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-brand">Trainer Share (80%)</p>
                <h3 className="text-2xl font-black text-white mt-1">${(trainer.revenue.total * 0.8).toLocaleString()}</h3>
                <p className="text-[10px] text-gray-400 mt-2">Direct earnings paid out</p>
              </div>

              <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Award className="w-24 h-24 text-white" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Platform Cut (20%)</p>
                <h3 className="text-2xl font-black text-gray-400 mt-1">${(trainer.revenue.total * 0.2).toLocaleString()}</h3>
                <p className="text-[10px] text-gray-500 mt-2">Nginx, CDN & hosting fee</p>
              </div>

            </div>

            {/* Revenue Graph mockup and certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Monthly Earnings visualizer */}
              <div className="lg:col-span-2 p-6 rounded-2xl glass-panel">
                <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-6">Subscription Growth (First 5 Months)</h3>
                <div className="flex items-end gap-3 h-48 pt-4">
                  {trainer.revenue.history.map((h, idx) => {
                    const maxAmt = Math.max(...trainer.revenue.history.map(item => item.amount));
                    const percentHeight = (h.amount / maxAmt) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono text-brand opacity-0 group-hover:opacity-100 transition-opacity">${h.amount}</span>
                        <div 
                          className="w-full bg-brand/20 group-hover:bg-brand rounded-t-lg transition-all duration-300"
                          style={{ height: `${percentHeight * 0.7}%` }}
                        />
                        <span className="text-[10px] font-mono text-gray-500">{h.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Certifications Card */}
              <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">Credentials Ledger</h3>
                  <div className="space-y-4">
                    {trainer.certificates.map((cert, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-brand/10 text-brand">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-normal">{cert.name}</p>
                          <p className="text-[9px] font-mono text-gray-500 mt-0.5">Approved: {cert.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-mono py-2 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Download Public Credentials (PDF)
                </button>
              </div>

            </div>

          </div>
        )
      )}

      {/* 2. COACHING QUEUE SUBTAB */}
      {activeSubTab === "coaching" && (
        isLoading ? (
          <DashboardSkeleton type="coaching" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            
            {/* Question List Side */}
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Pending Client Queries ({pendingCoaching.length})</h3>
              
              {pendingCoaching.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center text-gray-500">
                  <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-mono">No pending coaching requests!</p>
                  <p className="text-[10px] text-gray-600 mt-1">Excellent work keeping up with your subscribers.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingCoaching.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => setSelectedQuestion(q)}
                      className={`p-4 rounded-2xl text-left cursor-pointer transition-all border ${
                        selectedQuestion?.id === q.id 
                          ? "bg-brand/10 border-brand" 
                          : "bg-white/5 border-transparent hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <img src={q.traineeAvatar} alt={q.traineeName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-bold text-white">{q.traineeName}</span>
                        <span className="ml-auto text-[9px] font-mono text-gray-500">{q.date.split("T")[0]}</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate">{q.title}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{q.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed List Accordion */}
              {completedCoaching.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-2">Recently Resolved ({completedCoaching.length})</h4>
                  <div className="space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
                    {completedCoaching.map((q) => (
                      <div key={q.id} className="p-2.5 rounded-xl bg-white/5 text-left text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{q.traineeName}</span>
                          <span className="text-[9px] font-mono text-emerald-500">Resolved ✓</span>
                        </div>
                        <p className="text-gray-400 truncate text-[11px]">{q.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Workstation Pane */}
            <div className="lg:col-span-2">
              {selectedQuestion ? (
                <div className="p-6 rounded-2xl glass-panel text-left space-y-6">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <img src={selectedQuestion.traineeAvatar} alt={selectedQuestion.traineeName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{selectedQuestion.traineeName}</h4>
                        <p className="text-[10px] font-mono text-brand">Subscriber Ticket ID: {selectedQuestion.id}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-mono uppercase font-bold tracking-wide">Pending Action</span>
                  </div>

                  {/* Question Body */}
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-white">{selectedQuestion.title}</h3>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedQuestion.text}
                    </div>
                  </div>

                  {/* Interactive Reply Form */}
                  <form onSubmit={handleSendReply} className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-gray-400">Coaching Response & Prescriptions</label>
                      
                      {/* Gemini Assist Draft Button */}
                      <button
                        type="button"
                        onClick={handleGenerateAIDraft}
                        disabled={isDrafting}
                        className="flex items-center gap-1.5 px-3 py-1 bg-brand text-white rounded-lg text-[10px] font-mono tracking-wider uppercase cursor-pointer hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        {isDrafting ? "Analyzing Mechanics..." : "AI Coaching Draft"}
                      </button>
                    </div>

                    <textarea
                      required
                      rows={6}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Provide professional instruction, mechanical cues, or daily release routines..."
                      className="w-full bg-luxury-gray border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-brand transition-colors leading-relaxed"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500">💡 Tip: Be precise with joint angles & frequency load formulas.</span>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-mono uppercase font-bold tracking-wider cursor-pointer transition-all shadow-lg shadow-brand/30"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Prescription
                      </button>
                    </div>
                  </form>

                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-white/10 text-center text-gray-500">
                  <HelpCircle className="w-12 h-12 text-gray-700 mb-4" />
                  <p className="text-sm font-mono text-gray-400">Workstation Empty</p>
                  <p className="text-xs text-gray-600 mt-1">Select a pending subscriber ticket from the left panel to begin analysis.</p>
                </div>
              )}
            </div>

          </div>
        )
      )}

      {/* 3. PUBLISH SUBTAB */}
      {activeSubTab === "publish" && (
        isLoading ? (
          <DashboardSkeleton type="publish" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-200">
            
            {/* Post Locker publisher */}
            <div className="p-6 rounded-2xl glass-panel text-left space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-brand" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-white">Publish Article or Workout Block</h3>
              </div>

              {postSuccess && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs">
                  {postSuccess}
                </div>
              )}

              <form onSubmit={handlePublishPost} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Article Title</label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. Scapular Alignment Hacks for Overhead Stabilization"
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Access Tier</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as any)}
                      className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                    >
                      <option value="public">Public (Unrestricted Feed)</option>
                      <option value="premium">Premium (Subscribers Paywall)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Cover Image (Optional)</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="url"
                        value={postImage}
                        onChange={(e) => setPostImage(e.target.value)}
                        placeholder="Unsplash URL"
                        className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Content Body</label>
                  <textarea
                    required
                    rows={8}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share deep cues, formulas, weekly plans, and actionable workouts..."
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-brand transition-colors leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  Publish to Global Feed
                </button>
              </form>
            </div>

            {/* Short Swipe Arena publisher */}
            <div className="p-6 rounded-2xl glass-panel text-left space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-brand" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-white">Upload New Short Arena Clip</h3>
              </div>

              {shortSuccess && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs">
                  {shortSuccess}
                </div>
              )}

              <form onSubmit={handlePublishShort} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Description & Hashtags</label>
                  <textarea
                    required
                    rows={4}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="e.g. Try this 30-second ankle release before squatting! 🧘‍♀️🔥 #mobility #squatrehab"
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-brand transition-colors leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Direct Video Link (URL)</label>
                  <input
                    type="url"
                    value={shortVideoUrl}
                    onChange={(e) => setShortVideoUrl(e.target.value)}
                    placeholder="Leave empty for high-resolution stock fitness loop"
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-gray-400 leading-normal font-mono">
                  ℹ️ Shorts are public, autoplaying vertical loop videos optimized for global discovery. Excellent to lead traffic to your premium profile subscription tiers.
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  Launch Arena Short
                </button>
              </form>
            </div>

          </div>
        )
      )}

      {/* 4. SUBSCRIBERS LIST SUBTAB */}
      {activeSubTab === "subscribers" && (
        isLoading ? (
          <DashboardSkeleton type="subscribers" />
        ) : (
          <div className="p-6 rounded-2xl glass-panel text-left animate-in fade-in duration-200">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-6">Active Subscribers Ledger ({trainer.subscribers.length})</h3>

            {trainer.subscribers.length === 0 ? (
              <div className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                <Users className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                <p className="text-xs font-mono">Locker room currently vacant.</p>
                <p className="text-[10px] text-gray-600 mt-1">Publish quality articles & premium locked content to attract subscribers.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Athlete / Trainee</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Billing Active Since</th>
                      <th className="py-3 px-4">Subscription Plan</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {trainer.subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{sub.name}</td>
                        <td className="py-3.5 px-4 text-gray-400">{sub.email}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-400">{sub.activeSince}</td>
                        <td className="py-3.5 px-4 font-mono text-brand font-semibold">{sub.plan}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase text-[9px]">Recurring ✓</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      )}

    </div>
  );
}
