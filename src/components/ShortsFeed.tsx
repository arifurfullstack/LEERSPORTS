/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Heart, MessageSquare, Share2, Plus, 
  Flame, Volume2, VolumeX, ArrowUp, ArrowDown, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Short, TrainerProfile } from "../types";

interface ShortsFeedProps {
  shorts: Short[];
  trainers: TrainerProfile[];
  currentUser: { id: string; name: string; email: string; role: string; avatar: string; subscriptions: string[] } | null;
  onLikeShort: (shortId: string) => void;
  onSubscribeTrainer: (trainerId: string) => void;
}

export default function ShortsFeed({
  shorts,
  trainers,
  currentUser,
  onLikeShort,
  onSubscribeTrainer,
}: ShortsFeedProps) {
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>({});
  const [followsState, setFollowsState] = useState<Record<string, boolean>>({});

  const currentShort = shorts[activeIndex];

  const handleNext = () => {
    if (activeIndex < shorts.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleLike = (shortId: string) => {
    onLikeShort(shortId);
    
    // Toggle state locally for high-fidelity microinteraction
    const current = likesState[shortId] || { count: currentShort.likesCount, liked: false };
    const nextLiked = !current.liked;
    setLikesState({
      ...likesState,
      [shortId]: {
        count: current.count + (nextLiked ? 1 : -1),
        liked: nextLiked,
      }
    });
  };

  const handleFollow = (trainerId: string) => {
    setFollowsState({
      ...followsState,
      [trainerId]: !followsState[trainerId],
    });
  };

  if (!currentShort) return null;

  const currentLikes = likesState[currentShort.id] || { count: currentShort.likesCount, liked: false };
  const isTrainerSubscribed = currentUser?.subscriptions.includes(currentShort.trainerId) || false;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      
      {/* Title */}
      <div className="text-center mb-4">
        <span className="px-2 py-0.5 rounded bg-brand/10 text-brand font-mono font-bold text-[9px] uppercase tracking-widest">Sleek Swipe Arena</span>
        <h2 className="text-xl font-black text-white uppercase mt-0.5 tracking-wider">Trending Arena</h2>
      </div>

      {/* Main vertical loop container */}
      <div className="relative h-[620px] rounded-3xl overflow-hidden bg-black border border-white/10 glow-box-red flex flex-col justify-end">
        
        {/* HTML5 Autoplay Video loop with muted control */}
        <video
          key={currentShort.id}
          src={currentShort.videoUrl}
          autoPlay
          loop
          muted={muted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Shadow overlays for readibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30 z-10 pointer-events-none" />

        {/* Upper Mute / Autoplay Indicators */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <button 
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-full bg-black/50 text-white border border-white/10 hover:bg-black/70 transition-all cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand" />}
          </button>
          <span className="text-[10px] font-mono bg-black/50 px-2.5 py-1 rounded-full border border-white/10 text-brand font-semibold uppercase animate-pulse">
            Autoplay Arena
          </span>
        </div>

        {/* Lower Left Profile & description information */}
        <motion.div
          key={`info-${currentShort.id}`}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
          className="p-6 z-20 text-left space-y-3 max-w-[80%]"
        >
          
          <div className="flex items-center gap-2.5">
            <img src={currentShort.trainerAvatar} alt={currentShort.trainerName} className="w-9 h-9 rounded-full object-cover border-2 border-brand" />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white hover:underline cursor-pointer">{currentShort.trainerName}</span>
                <span className="text-brand text-[10px]">✓</span>
              </div>
              <p className="text-[9px] font-mono text-gray-400">CREATOR</p>
            </div>

            <button
              onClick={() => handleFollow(currentShort.trainerId)}
              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ml-2 transition-all cursor-pointer ${
                followsState[currentShort.trainerId]
                  ? "bg-white/10 text-gray-400"
                  : "bg-brand text-white"
              }`}
            >
              {followsState[currentShort.trainerId] ? "Following" : "+ Follow"}
            </button>
          </div>

          <p className="text-xs text-white leading-normal font-sans drop-shadow">
            {currentShort.description}
          </p>

          {/* Premium Subscribe CTA drawer link */}
          {!isTrainerSubscribed && (
            <div className="p-3 rounded-xl bg-brand/20 border border-brand/35 text-[10px] flex items-center justify-between">
              <div>
                <span className="font-bold text-white uppercase font-mono text-[9px] block">Subscribe to {currentShort.trainerName}</span>
                <span className="text-gray-300">Unlock coaching & locked post feeds</span>
              </div>
              <button
                onClick={() => {
                  onSubscribeTrainer(currentShort.trainerId);
                  alert(`Successfully simulated premium subscription booking for ${currentShort.trainerName}!`);
                }}
                className="bg-brand hover:bg-brand-hover text-white px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all cursor-pointer"
              >
                UNLOCK
              </button>
            </div>
          )}

        </motion.div>

        {/* Lower Right Interactive Float Overlay buttons */}
        <motion.div
          key={`actions-${currentShort.id}`}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
          className="absolute right-4 bottom-6 z-20 flex flex-col gap-4 items-center"
        >
          
          {/* Like */}
          <button 
            onClick={() => handleLike(currentShort.id)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full bg-black/60 border border-white/10 text-white transition-all group-hover:scale-110 ${currentLikes.liked ? "text-brand" : ""}`}>
              <Heart className="w-5 h-5" fill={currentLikes.liked ? "#ff0033" : "none"} />
            </div>
            <span className="text-[10px] font-mono text-white font-semibold drop-shadow">{currentLikes.count}</span>
          </button>

          {/* Comment */}
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white transition-all group-hover:scale-110">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-white font-semibold drop-shadow">{currentShort.commentsCount}</span>
          </button>

          {/* Share */}
          <button 
            onClick={() => alert("Unique short link copycasted to clipboard!")}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="p-2.5 rounded-full bg-black/60 border border-white/10 text-white transition-all group-hover:scale-110">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-white font-semibold drop-shadow">{currentShort.sharesCount}</span>
          </button>

        </motion.div>

        {/* Video switcher vertical pagination triggers */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Micro overlay comment drawer inside shorts viewport */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute inset-x-0 bottom-0 z-30 bg-black/95 border-t border-white/15 p-4 rounded-t-3xl text-left space-y-3 h-1/2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Comments Arena</span>
                <button onClick={() => setShowComments(false)} className="text-xs font-mono text-brand cursor-pointer">
                  [Minimize]
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
                <div className="p-2.5 rounded-xl bg-white/5 text-xs flex items-start gap-2">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" className="w-5 h-5 rounded-full object-cover" />
                  <div>
                    <span className="font-bold text-white text-[11px]">Marcus</span>
                    <p className="text-gray-300 mt-0.5">That mechanical cue adjustment has revolutionized my overhead squat stabilization.</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 text-xs flex items-start gap-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" className="w-5 h-5 rounded-full object-cover" />
                  <div>
                    <span className="font-bold text-white text-[11px]">Sophia</span>
                    <p className="text-gray-300 mt-0.5">Where is the full program document? Clean, crisp cueing Elena!</p>
                  </div>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!commentText.trim()) return;
                  setCommentText("");
                  alert("Comment posted to the short! Safety moderation verified.");
                }} 
                className="flex gap-2"
              >
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Join the discussion..."
                  className="flex-1 bg-luxury-gray border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  className="bg-brand text-white font-mono text-[10px] font-bold uppercase px-3 rounded-xl cursor-pointer"
                >
                  Post
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
