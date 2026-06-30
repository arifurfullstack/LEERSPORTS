/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Heart, Bookmark, Share2, MessageSquare, Globe, 
  Sparkles, ShieldCheck, Check, Filter, Search, DollarSign,
  AlertCircle, Lock, Play, CreditCard, Flame, Trophy, Calendar,
  Award, Info, ChevronRight, Zap, Target, RefreshCw, Star, Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Post, TrainerProfile, Comment } from "../types";

interface GlobalFeedProps {
  posts: Post[];
  trainers: TrainerProfile[];
  currentUser: { id: string; name: string; email: string; role: string; avatar: string; subscriptions: string[] } | null;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSubscribeTrainer: (trainerId: string) => void;
  onSelectTrainerProfile?: (trainerId: string) => void;
}

function PostSkeleton() {
  return (
    <div className="rounded-2xl glass-panel text-left overflow-hidden border border-white/5 p-5 space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/5 shimmer" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded bg-white/5 shimmer" />
            <div className="h-2 w-16 rounded bg-white/5 shimmer" />
          </div>
        </div>
        <div className="h-5 w-12 rounded-lg bg-white/5 shimmer" />
      </div>

      {/* Title & Body */}
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/5 shimmer" />
        <div className="h-2.5 w-full rounded bg-white/5 shimmer" />
        <div className="h-2.5 w-5/6 rounded bg-white/5 shimmer" />
      </div>

      {/* Large Image/Video placeholder */}
      <div className="w-full h-56 rounded-xl bg-white/5 shimmer" />

      {/* Footer / Interaction buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="h-4 w-12 rounded bg-white/5 shimmer" />
          <div className="h-4 w-12 rounded bg-white/5 shimmer" />
        </div>
        <div className="h-5 w-24 rounded-lg bg-white/5 shimmer" />
      </div>
    </div>
  );
}

function TrainerSkeleton() {
  return (
    <div className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-white/5 shimmer" />
        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded bg-white/5 shimmer" />
          <div className="h-2 w-16 rounded bg-white/5 shimmer" />
        </div>
      </div>
      <div className="space-y-1.5 text-right">
        <div className="h-3 w-10 ml-auto rounded bg-white/5 shimmer" />
        <div className="h-5 w-14 rounded-lg bg-white/5 shimmer" />
      </div>
    </div>
  );
}

export default function GlobalFeed({
  posts,
  trainers,
  currentUser,
  onLikePost,
  onSavePost,
  onAddComment,
  onSubscribeTrainer,
  onSelectTrainerProfile,
}: GlobalFeedProps) {
  
  // Filtering & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  // Translation states
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [targetLanguages, setTargetLanguages] = useState<Record<string, string>>({});

  // Comment input states
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // Paywall Simulator Drawer states
  const [activePaywallTrainer, setActivePaywallTrainer] = useState<TrainerProfile | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Simulated content loading state for premium skeletons
  const [isLoading, setIsLoading] = useState(true);

  // New Interactive Right Sidebar States
  const [challengeTasks, setChallengeTasks] = useState([
    { id: "task_1", text: "Complete 3 sets of 45s Prone Cobra Holds", completed: false },
    { id: "task_2", text: "Log Lat Activation during pull-ups/deadlifts", completed: false },
    { id: "task_3", text: "Verify neutral cervical spine alignment", completed: false },
  ]);
  const [claimedStreak, setClaimedStreak] = useState(false);

  const [selectedScanExercise, setSelectedScanExercise] = useState("Deadlift Hinge");
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    name: string;
    hipAngle: string;
    spineAlignment: string;
    shearRisk: string;
    recommendation: string;
  } | null>(null);

  const handleExerciseScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setScanProgress(10);
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          if (selectedScanExercise === "Deadlift Hinge") {
            setScanResult({
              name: "Deadlift Hinge",
              hipAngle: "41.8°",
              spineAlignment: "98.2% Neutral",
              shearRisk: "Low (1.1%)",
              recommendation: "Lat engagement is pristine. Focus on pushing the floor away with mid-foot pressure during the initial pull."
            });
          } else if (selectedScanExercise === "Deep Goblet Squat") {
            setScanResult({
              name: "Deep Goblet Squat",
              hipAngle: "112.5°",
              spineAlignment: "87.4% Neutral",
              shearRisk: "Moderate (4.8% tail tuck)",
              recommendation: "Encountering minor lumbo-pelvic tilt ('butt wink') at terminal depth. Restrict depth slightly until ankle mobility improves."
            });
          } else {
            setScanResult({
              name: "Overhead Press",
              hipAngle: "178.1°",
              spineAlignment: "92.1% Neutral",
              shearRisk: "Low-Moderate (3.2%)",
              recommendation: "Activate abdominal bracing to limit hyperextension of the lumbar spine as the bar clears the forehead."
            });
          }
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleToggleTask = (taskId: string) => {
    setChallengeTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = challengeTasks.filter(t => t.completed).length;
  const challengePercent = Math.round((completedCount / challengeTasks.length) * 100);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedSpecialty, selectedLanguage, onlyVerified]);

  const handleTranslate = async (postId: string, text: string) => {
    const lang = targetLanguages[postId] || "Spanish";
    setTranslatingId(postId);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: lang }),
      });
      const data = await response.json();
      setTranslatedTexts((prev) => ({
        ...prev,
        [postId]: data.translatedText,
      }));
    } catch (err) {
      console.error(err);
      setTranslatedTexts((prev) => ({
        ...prev,
        [postId]: `[Translation failure] ${text}`,
      }));
    } finally {
      setTranslatingId(null);
    }
  };

  const handlePostComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(postId, commentText);
    setCommentText("");
    setActiveCommentId(null);
  };

  const handleTriggerPaywall = (trainerId: string) => {
    const trainerObj = trainers.find((t) => t.id === trainerId);
    if (trainerObj) {
      setActivePaywallTrainer(trainerObj);
    }
  };

  const handleProcessPayment = () => {
    if (!activePaywallTrainer) return;
    setIsPaying(true);

    setTimeout(() => {
      onSubscribeTrainer(activePaywallTrainer.id);
      setIsPaying(false);
      setActivePaywallTrainer(null);
      alert(`Subscription Authorized! You now hold premium access to ${activePaywallTrainer.name}'s locked portals.`);
    }, 1500);
  };

  // Filter posts based on matching criteria
  const filteredPosts = posts.filter((post) => {
    const matchedTrainer = trainers.find((t) => t.id === post.trainerId);
    
    // Search filter
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.trainerName.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Specialty filter
    const matchesSpecialty = 
      selectedSpecialty === "all" || 
      (matchedTrainer && matchedTrainer.specialty.includes(selectedSpecialty));

    // Language filter
    const matchesLanguage = 
      selectedLanguage === "all" || 
      post.originalLanguage === selectedLanguage ||
      (matchedTrainer && matchedTrainer.languages.includes(selectedLanguage));

    // Verified trainer filter
    const matchesVerified = 
      !onlyVerified || 
      (matchedTrainer && matchedTrainer.verified);

    return matchesSearch && matchesSpecialty && matchesLanguage && matchesVerified;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Filtering and Search Controls Banner */}
      <div className="p-5 rounded-2xl bg-luxury-gray border border-white/5 text-left mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trainers, keywords, routines..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          {/* Specialty Dropdown */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand transition-colors"
          >
            <option value="all">All Specialties</option>
            <option value="Strength">Strength & Conditioning</option>
            <option value="Posture">Posture & Mobility</option>
            <option value="Hypertrophy">Hypertrophy Protocols</option>
          </select>

          {/* Language Dropdown */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand transition-colors"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Spanish">Spanish</option>
          </select>

          {/* Verified Toggle button */}
          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
              onlyVerified 
                ? "bg-brand text-white border-brand shadow-lg shadow-brand/20" 
                : "bg-black/40 text-gray-400 border-white/10 hover:text-white"
            }`}
          >
            ✓ Verified Trainers Only
          </button>

        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Posts feed Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {isLoading ? (
            <div className="space-y-6">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-luxury-gray">
              <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs font-mono">No lockers match search filters.</p>
              <p className="text-[10px] text-gray-600 mt-1">Try broadening your parameters or search queries.</p>
            </div>
          ) : (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }
                }
              }}
            >
              {filteredPosts.map((post) => {
                const isSubscribed = currentUser?.subscriptions.includes(post.trainerId) || false;
                const isPremiumLocked = post.type === "premium" && !isSubscribed;
                const originalText = post.content;
                const translatedText = translatedTexts[post.id];
                const selectedTargetLang = targetLanguages[post.id] || "Spanish";

                return (
                  <motion.div 
                    key={post.id} 
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
                    }}
                    className="rounded-2xl glass-panel text-left overflow-hidden hover:border-brand/30 transition-colors"
                  >
                    
                    {/* Post Header */}
                    <div className="p-4 flex items-center justify-between border-b border-white/5">
                      <div 
                        className="flex items-center gap-2.5 cursor-pointer group/author"
                        onClick={() => onSelectTrainerProfile?.(post.trainerId)}
                      >
                        <img src={post.trainerAvatar} alt={post.trainerName} className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover/author:border-brand/50 transition-colors" />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white group-hover/author:text-brand transition-colors">{post.trainerName}</span>
                            <span className="text-brand">✓</span>
                          </div>
                          <p className="text-[9px] font-mono text-gray-500 tracking-wider">CREATOR • {post.date.split("T")[0]}</p>
                        </div>
                      </div>

                      {post.type === "premium" ? (
                        <span className="px-2 py-0.5 rounded bg-brand/10 border border-brand/20 text-brand text-[8px] font-mono uppercase font-black tracking-wider">
                          Premium Locker
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 text-[8px] font-mono uppercase font-bold tracking-wider">
                          Public Feed
                        </span>
                      )}
                    </div>

                    {/* Post Content Visual */}
                    <div className="relative">
                      <img 
                        src={post.mediaUrls?.[0] || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"} 
                        alt={post.title} 
                        className={`w-full max-h-96 object-cover ${isPremiumLocked ? "filter blur-xl brightness-50" : ""}`}
                      />

                      {/* Premium paywall Locker block */}
                      {isPremiumLocked && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
                          <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3 glow-box-red border border-brand/30">
                            <Lock className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">Premium Content Paywall</h4>
                          <p className="text-[10px] text-gray-400 max-w-xs mt-1 leading-normal">
                            Unlock this peeking block and all premium attachments by subscribing to {post.trainerName}.
                          </p>
                          <button
                            onClick={() => handleTriggerPaywall(post.trainerId)}
                            className="mt-4 bg-brand hover:bg-brand-hover text-white text-[10px] font-mono font-bold uppercase px-4 py-2 rounded-lg cursor-pointer transition-all shadow-md shadow-brand/30"
                          >
                            Unlock Profile Portal
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Post details body */}
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-white leading-snug">{post.title}</h3>
                        <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">
                          {translatedText ? translatedText : originalText}
                        </p>

                        {/* original text fallback toggle */}
                        {translatedText && (
                          <button
                            onClick={() => setTranslatedTexts((prev) => {
                              const copy = { ...prev };
                              delete copy[post.id];
                              return copy;
                            })}
                            className="text-[9px] font-mono text-brand hover:underline mt-2 block uppercase tracking-wider"
                          >
                            ← Revert to Original ({post.originalLanguage})
                          </button>
                        )}
                      </div>

                      {/* Interactions list */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-gray-500">
                        
                        <div className="flex gap-4">
                          <button 
                            onClick={() => onLikePost(post.id)}
                            className={`flex items-center gap-1.5 text-[11px] font-mono transition-colors ${post.isLiked ? "text-brand" : "hover:text-white"}`}
                          >
                            <Heart className="w-4 h-4 shrink-0" fill={post.isLiked ? "#ff0033" : "none"} />
                            {post.likesCount}
                          </button>
                          
                          <button 
                            onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                            className="flex items-center gap-1.5 text-[11px] font-mono hover:text-white"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {post.comments.length}
                          </button>
                        </div>

                        {/* Google translate one-click interface */}
                        <div className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-gray-600" />
                          <select
                            value={selectedTargetLang}
                            onChange={(e) => setTargetLanguages({ ...targetLanguages, [post.id]: e.target.value })}
                            className="bg-transparent text-[10px] font-mono text-gray-400 focus:outline-none hover:text-white cursor-pointer"
                          >
                            <option value="Spanish">Spanish</option>
                            <option value="German">German</option>
                            <option value="Japanese">Japanese</option>
                            <option value="French">French</option>
                            <option value="Russian">Russian</option>
                          </select>
                          <button
                            onClick={() => handleTranslate(post.id, originalText)}
                            disabled={translatingId === post.id}
                            className="text-[10px] font-mono font-bold text-brand uppercase hover:underline ml-1 cursor-pointer"
                          >
                            {translatingId === post.id ? "Translating..." : "Translate"}
                          </button>
                        </div>

                      </div>

                      {/* Comment list Drawer panel */}
                      {activeCommentId === post.id && (
                        <div className="space-y-3 pt-3 border-t border-white/5 animate-in slide-in-from-top-1 duration-150">
                          <div className="max-y-40 overflow-y-auto space-y-2.5 max-h-48 pr-2">
                            {post.comments.length === 0 ? (
                              <p className="text-[10px] text-gray-600 italic">No comments yet. Initiate conversation!</p>
                            ) : (
                              post.comments.map((comment) => (
                                <div key={comment.id} className="text-xs bg-white/5 p-2 rounded-xl flex items-start gap-2 text-left">
                                  <img src={comment.userAvatar} alt={comment.userName} className="w-5 h-5 rounded-full object-cover shrink-0" />
                                  <div>
                                    <span className="font-bold text-white text-[11px]">{comment.userName}</span>
                                    <p className="text-gray-300 mt-0.5 text-[11px]">{comment.text}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <form onSubmit={(e) => handlePostComment(e, post.id)} className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Add commentary..."
                              className="flex-1 bg-luxury-gray border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
                            />
                            <button
                              type="submit"
                              className="bg-brand text-white text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                              Send
                            </button>
                          </form>
                        </div>
                      )}

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

        </div>

        {/* Enriched Multi-Widget Right Sidebar */}
        <div className="space-y-6">
          
          {/* Widget 1: Verified Specialists Portal */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand animate-pulse" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-white">Elite Coaching Desk</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand font-mono text-[9px] uppercase font-bold">
                Online
              </span>
            </div>
            
            <p className="text-[10px] text-gray-400 leading-normal">
              Unlock access to premium locker portals, encrypted chats, and custom biomechanical coaching.
            </p>

            <div className="divide-y divide-white/5 pt-2">
              {isLoading ? (
                <>
                  <TrainerSkeleton />
                  <TrainerSkeleton />
                  <TrainerSkeleton />
                </>
              ) : trainers.map((trainer) => {
                const isSubscribed = currentUser?.subscriptions.includes(trainer.id) || false;
                // Generate a randomized high-end review metric for visual credibility
                const rating = trainer.specialty === "Strength" ? "4.9" : trainer.specialty === "Posture" ? "4.8" : "5.0";
                const activeClients = trainer.specialty === "Strength" ? "142" : trainer.specialty === "Posture" ? "88" : "104";

                return (
                  <div key={trainer.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group/sidebar-trainer"
                      onClick={() => onSelectTrainerProfile?.(trainer.id)}
                    >
                      <div className="relative">
                        <img src={trainer.avatar} alt={trainer.name} className="w-10 h-10 rounded-full object-cover border border-white/15 group-hover/sidebar-trainer:border-brand/50 transition-colors" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-luxury-black rounded-full" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-normal flex items-center gap-1 group-hover/sidebar-trainer:text-brand transition-colors">
                          {trainer.name}
                          <span className="text-brand">✓</span>
                        </h4>
                        <p className="text-[10px] text-gray-400 leading-none mt-0.5">{trainer.specialty}</p>
                        <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-500 font-mono">
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-500" />
                            {rating}
                          </span>
                          <span>•</span>
                          <span>{activeClients} trainees</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-mono text-brand font-bold leading-normal">${trainer.monthlyPrice}/mo</p>
                      <button
                        onClick={() => handleTriggerPaywall(trainer.id)}
                        className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all mt-1 cursor-pointer ${
                          isSubscribed 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "bg-brand hover:bg-brand-hover text-white shadow-sm shadow-brand/10"
                        }`}
                      >
                        {isSubscribed ? "Active ✓" : "Unlock"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 2: Weekly Biomechanics Challenge (Fully Interactive Checkboxes + Progress) */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-white">Posture Master Challenge</h3>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-lg">
                <Flame className="w-3 h-3 text-brand fill-brand" />
                Week 12
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">Weekly Target Progress</span>
                <span className="text-brand font-bold">{challengePercent}% Done</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-brand h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${challengePercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {challengeTasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.completed 
                      ? "bg-brand/5 border-brand/20 text-gray-300" 
                      : "bg-black/30 border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                    task.completed ? "bg-brand border-brand text-white" : "border-white/15 bg-black/50"
                  }`}>
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-[11px] leading-snug font-medium select-none">{task.text}</span>
                </div>
              ))}
            </div>

            {challengePercent === 100 && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center animate-in zoom-in duration-200">
                <p className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">
                  🎉 Challenge Accomplished!
                </p>
                <button
                  onClick={() => {
                    setClaimedStreak(true);
                    alert("Streak verified! Posture Master Medal added to achievements ledger.");
                  }}
                  disabled={claimedStreak}
                  className={`mt-2 w-full py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                    claimedStreak 
                      ? "bg-emerald-500/25 text-emerald-300/60 border border-emerald-500/10 cursor-not-allowed" 
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {claimedStreak ? "Streak Ledger Saved ✓" : "Claim Streak Reward (+50 XP)"}
                </button>
              </div>
            )}
          </div>

          {/* Widget 3: Quick AI Biomechanics Evaluator */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-brand" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-white">Posture Quick-Analyzer</h3>
              </div>
              <Info className="w-3.5 h-3.5 text-gray-500 hover:text-white cursor-help" title="Analyze kinetic angles based on biomechanical presets" />
            </div>

            <p className="text-[10px] text-gray-400 leading-normal">
              Simulate high-tech video capture diagnostics to optimize terminal compound joint safety.
            </p>

            {/* Exercise Selector */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              {["Deadlift Hinge", "Deep Goblet Squat", "Overhead Press"].map((exercise) => {
                const isActive = selectedScanExercise === exercise;
                return (
                  <button
                    key={exercise}
                    onClick={() => {
                      setSelectedScanExercise(exercise);
                      setScanResult(null);
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      isActive 
                        ? "bg-brand text-white border border-brand" 
                        : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10"
                    }`}
                  >
                    {exercise.split(" ")[1] || exercise}
                  </button>
                );
              })}
            </div>

            {/* Scanning and Actions Block */}
            <div className="space-y-3 pt-1">
              {!isScanning && !scanResult ? (
                <button
                  onClick={handleExerciseScan}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] font-bold uppercase py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-brand" />
                  Initiate Biomechanical Scan
                </button>
              ) : isScanning ? (
                <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3 text-center">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span className="animate-pulse">Mapping kinetic nodes...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-brand h-1 rounded-full transition-all duration-200"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-[9px] font-mono text-gray-500 italic">Evaluating joint shear force & pelvic alignment</p>
                </div>
              ) : (
                <div className="p-4 bg-luxury-gray border border-brand/20 rounded-xl space-y-3 animate-in fade-in duration-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-white uppercase">{scanResult.name} Blueprint</span>
                    <button 
                      onClick={handleExerciseScan}
                      className="text-[9px] text-brand font-mono hover:underline flex items-center gap-1 uppercase"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Re-scan
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-[9px]">
                    <div className="bg-black/30 p-1.5 rounded border border-white/5">
                      <span className="text-gray-500 block leading-none">Hip Flexion</span>
                      <span className="text-white font-bold block mt-1">{scanResult.hipAngle}</span>
                    </div>
                    <div className="bg-black/30 p-1.5 rounded border border-white/5">
                      <span className="text-gray-500 block leading-none">Spine Alignment</span>
                      <span className="text-emerald-500 font-bold block mt-1">{scanResult.spineAlignment}</span>
                    </div>
                    <div className="bg-black/30 p-1.5 rounded border border-white/5">
                      <span className="text-gray-500 block leading-none">Shear Risk</span>
                      <span className={`font-bold block mt-1 ${scanResult.shearRisk.includes("Low") ? "text-emerald-500" : "text-amber-500"}`}>
                        {scanResult.shearRisk.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-300 bg-black/40 p-2.5 rounded-lg leading-normal italic text-left">
                    <strong className="text-brand font-mono uppercase text-[9px] block mb-1">Coach Prescription:</strong>
                    "{scanResult.recommendation}"
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Paywall Drawer Overlay modal */}
      <AnimatePresence>
        {activePaywallTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="w-full max-w-sm rounded-2xl glass-panel-heavy border border-white/10 overflow-hidden relative shadow-2xl"
            >
              <div className="p-6 text-center space-y-5">
                
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Premium Onboarding</span>
                  <button onClick={() => setActivePaywallTrainer(null)} className="text-gray-400 hover:text-white text-xs font-mono uppercase cursor-pointer">
                    [Close]
                  </button>
                </div>

                <img src={activePaywallTrainer.avatar} alt={activePaywallTrainer.name} className="w-16 h-16 rounded-full object-cover border border-brand/50 mx-auto" />

                <div>
                  <h3 className="text-base font-black text-white">{activePaywallTrainer.name}</h3>
                  <p className="text-[11px] text-brand font-mono uppercase font-bold mt-0.5">{activePaywallTrainer.specialty}</p>
                  <p className="text-[10px] text-gray-400 max-w-xs mx-auto mt-2 leading-relaxed">
                    "{activePaywallTrainer.bio}"
                  </p>
                </div>

                {/* Payment Details */}
                <div className="p-4 bg-luxury-gray border border-white/5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Monthly Membership:</span>
                    <span className="font-mono text-white font-bold">${activePaywallTrainer.monthlyPrice}.00 / month</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Platform Fee Split:</span>
                    <span className="text-gray-500 font-mono">0.00% (Inclusive)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                    <span className="font-bold text-white">Secure Total Charge:</span>
                    <span className="font-mono text-brand font-extrabold">${activePaywallTrainer.monthlyPrice}.00</span>
                  </div>
                </div>

                {/* simulated payment methods */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleProcessPayment}
                    disabled={isPaying}
                    className="flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg py-2 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Stripe Pay
                  </button>
                  <button
                    onClick={handleProcessPayment}
                    disabled={isPaying}
                    className="bg-white/10 hover:bg-white/15 text-white rounded-lg py-2 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                  >
                    Google Pay
                  </button>
                </div>

                <p className="text-[8px] text-gray-500 font-mono">
                  Auto-renews monthly. Cancel anytime under account settings. SSL SECURE 256-BIT.
                </p>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
