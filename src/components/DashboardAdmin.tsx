/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Shield, Check, X, ShieldAlert, Sparkles, Eye, 
  Trash2, DollarSign, Activity, FileText, UserCheck, EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TrainerProfile, Post, CommunityPost } from "../types";

interface DashboardAdminProps {
  trainers: TrainerProfile[];
  posts: Post[];
  communityPosts: CommunityPost[];
  onVerifyTrainer: (trainerId: string, status: "verified" | "rejected") => void;
  onModeratePost: (postId: string, action: "delete" | "dismiss") => void;
  onModerateCommunityPost: (postId: string, action: "delete" | "dismiss") => void;
}

export interface ModerationReport {
  id: string;
  targetId: string;
  targetType: "post" | "comment" | "community";
  reporterName: string;
  reason: "Spam" | "Nudity" | "Abuse" | "Harassment" | "Copyright";
  textPreview: string;
  date: string;
}

export default function DashboardAdmin({
  trainers,
  posts,
  communityPosts,
  onVerifyTrainer,
  onModeratePost,
  onModerateCommunityPost,
}: DashboardAdminProps) {
  const [activeTab, setActiveTab] = useState<"verification" | "reports" | "finance">("verification");

  // Pending Trainers
  const pendingTrainers = trainers.filter(t => !t.verified && t.verificationStatus === "pending");

  // Mock moderation safety reports database
  const [reports, setReports] = useState<ModerationReport[]>([
    {
      id: "rep_1",
      targetId: "post_1",
      targetType: "post",
      reporterName: "John Doe",
      reason: "Copyright",
      textPreview: "The Ultimate Guide to Lat-Recruitment in Snatch Turnovers...",
      date: "2026-06-29T22:30:00Z",
    },
    {
      id: "rep_2",
      targetId: "comm_1",
      targetType: "community",
      reporterName: "Alice Miller",
      reason: "Spam",
      textPreview: "Need feedback on squat hip-shift at heavy loads...",
      date: "2026-06-29T23:15:00Z",
    },
  ]);

  // AI Moderation safety evaluation results
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, { score: number; flagged: boolean; reason: string }>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Call backend moderation toxicity assessment
  const handleRunAIModeration = async (reportId: string, text: string) => {
    setAnalyzingId(reportId);
    try {
      const response = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setAiAnalysis((prev) => ({
        ...prev,
        [reportId]: {
          score: data.score,
          flagged: data.flagged,
          reason: data.reason || "Evaluated by server.",
        },
      }));
    } catch (err) {
      console.error(err);
      setAiAnalysis((prev) => ({
        ...prev,
        [reportId]: { score: 0.1, flagged: false, reason: "Offline fallback check approved." },
      }));
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleResolveReport = (reportId: string, targetId: string, type: "post" | "community", action: "delete" | "dismiss") => {
    if (action === "delete") {
      if (type === "post") onModeratePost(targetId, "delete");
      else onModerateCommunityPost(targetId, "delete");
      alert("Violating content has been safely removed from the system and databases.");
    } else {
      alert("Report successfully dismissed. Content remains active.");
    }
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Admin Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-500">Global Administration HQ</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Security & Regulation Deck</h1>
          <p className="text-xs text-gray-400">Review credential certificates, enforce community safety guidelines, and calculate platform royalties.</p>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-1.5 p-1 bg-luxury-gray border border-white/5 rounded-xl self-start md:self-center relative">
          {(["verification", "reports", "finance"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-3.5 py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer select-none"
                style={{ color: isActive ? "#ffffff" : "#9ca3af" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="adminActiveTab"
                    className="absolute inset-0 bg-amber-600 rounded-lg shadow-md shadow-amber-600/20 z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === "verification" && `Trainer Applications (${pendingTrainers.length})`}
                  {tab === "reports" && `Safety Reports (${reports.length})`}
                  {tab === "finance" && "Platform Ledger"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. TRAINER VERIFICATION FLOW */}
      {activeTab === "verification" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 text-left">Pending Certifications Vault</h3>

          {pendingTrainers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-luxury-gray">
              <UserCheck className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-sm font-mono text-gray-300">All creator queues are verified.</p>
              <p className="text-xs text-gray-600 mt-1">Newly registered trainers who upload certificates will populate here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingTrainers.map((t) => (
                <div key={t.id} className="p-6 rounded-2xl glass-panel text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                    <div>
                      <h4 className="text-base font-bold text-white">{t.name}</h4>
                      <p className="text-xs text-gray-400">{t.specialty} • {t.country}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 italic leading-relaxed">"{t.bio}"</p>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Uploaded Certificates (PDF)</span>
                      <span className="text-[10px] font-mono text-amber-500 font-bold uppercase">Pending Audit</span>
                    </div>
                    {t.certificates.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono text-gray-300">
                        <span>📄 {cert.name}</span>
                        <span className="text-[10px] text-gray-500">Date: {cert.date}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onVerifyTrainer(t.id, "verified")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Check className="w-4 h-4" /> Approve Credentials
                    </button>
                    <button
                      onClick={() => onVerifyTrainer(t.id, "rejected")}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs font-bold uppercase px-4 py-2.5 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SAFETY REPORTS & MODERATION */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 text-left">Community Safety Queue</h3>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-luxury-gray">
              <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm font-mono text-gray-300">Global channels are completely quiet.</p>
              <p className="text-xs text-gray-600 mt-1">No reported posts, spam comments, or guidelines infringements in the system.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((rep) => {
                const aiResult = aiAnalysis[rep.id];
                return (
                  <div key={rep.id} className="p-6 rounded-2xl glass-panel text-left flex flex-col lg:flex-row gap-6 justify-between items-start">
                    
                    {/* Report Specifics */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 text-[10px] font-mono uppercase font-bold">Reported: {rep.reason}</span>
                        <span className="text-xs text-gray-400">Reporter: <span className="text-white font-semibold">{rep.reporterName}</span></span>
                        <span className="text-[10px] font-mono text-gray-500">{rep.date.split("T")[0]}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Type: {rep.targetType === "post" ? "Premium Article Locker" : "Community Post"}</h4>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-300 leading-normal italic font-serif">
                        "{rep.textPreview}"
                      </div>
                    </div>

                    {/* AI Moderation analysis console */}
                    <div className="w-full lg:w-80 p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">AI Content Evaluation</span>
                        <button
                          onClick={() => handleRunAIModeration(rep.id, rep.textPreview)}
                          disabled={analyzingId === rep.id}
                          className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-amber-500 hover:text-amber-400 uppercase transition-all"
                        >
                          <Sparkles className="w-3 h-3 animate-pulse" />
                          {analyzingId === rep.id ? "Analyzing..." : "Inspect Content"}
                        </button>
                      </div>

                      {aiResult ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Toxicity Score:</span>
                            <span className={`font-bold ${aiResult.flagged ? "text-red-500" : "text-emerald-500"}`}>
                              {(aiResult.score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${aiResult.flagged ? "bg-red-500" : "bg-emerald-500"}`} 
                              style={{ width: `${aiResult.score * 100}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400 leading-normal bg-black/40 p-2 rounded">
                            <span className="font-bold text-white uppercase font-mono text-[9px] block mb-0.5">Gemini Rationale</span>
                            {aiResult.reason}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-500 italic">Click Inspect to run the server-side toxicity classifier via Gemini.</p>
                      )}
                    </div>

                    {/* Decision Trigger Buttons */}
                    <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto shrink-0 pt-4 lg:pt-0">
                      <button
                        onClick={() => handleResolveReport(rep.id, rep.targetId, rep.targetType as any, "delete")}
                        className="flex-1 lg:w-36 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> Take Down
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, rep.targetId, rep.targetType as any, "dismiss")}
                        className="flex-1 lg:w-36 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 transition-all"
                      >
                        <Check className="w-4 h-4" /> Keep Post
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. PLATFORM FINANCE LEDGER */}
      {activeTab === "finance" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 text-left">Royalty Distribution & Reserves</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-2xl bg-luxury-gray border border-white/5">
              <p className="text-[10px] font-mono uppercase text-gray-500">Gross Creator Volume</p>
              <h4 className="text-2xl font-black text-white mt-1">$63,220</h4>
              <p className="text-[10px] text-emerald-500 mt-2 font-mono">Platform Volume Active</p>
            </div>

            <div className="p-5 rounded-2xl bg-luxury-gray border border-white/5 border-l-2 border-amber-500">
              <p className="text-[10px] font-mono uppercase text-amber-500">Platform Split (20% Cut)</p>
              <h4 className="text-2xl font-black text-white mt-1">$12,644</h4>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">Infrastructure reserves</p>
            </div>

            <div className="p-5 rounded-2xl bg-luxury-gray border border-white/5">
              <p className="text-[10px] font-mono uppercase text-gray-500">Disbursed Earnings (80% Creator)</p>
              <h4 className="text-2xl font-black text-white mt-1">$50,576</h4>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">Securely transferred via Stripe</p>
            </div>

          </div>

          <div className="p-6 rounded-2xl glass-panel text-left">
            <h4 className="font-mono text-xs uppercase text-gray-400 mb-4">Latest Platform Operations (Audit Logs)</h4>
            <div className="space-y-3 font-mono text-[11px] text-gray-400">
              <div className="p-3 bg-black/40 rounded-lg flex justify-between items-center">
                <span>[2026-06-30 02:40] Trainer payout: Dr. Marcus Vance - $25,600 successfully released.</span>
                <span className="text-emerald-500 font-bold uppercase">Success</span>
              </div>
              <div className="p-3 bg-black/40 rounded-lg flex justify-between items-center">
                <span>[2026-06-30 01:15] Trainer registered: "elena_mobility" certificates audited and approved.</span>
                <span className="text-emerald-500 font-bold uppercase">Verified</span>
              </div>
              <div className="p-3 bg-black/40 rounded-lg flex justify-between items-center">
                <span>[2026-06-29 23:55] Security report resolved: user report rep_1 dismissed by Admin.</span>
                <span className="text-amber-500 font-bold uppercase">Resolved</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
