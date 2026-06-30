/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Star, ShieldCheck, Mail, MapPin, Globe, CreditCard, 
  Lock, MessageSquare, Award, ArrowLeft, Heart, Bookmark, 
  MessageCircle, Zap, Shield, Sparkles, Check, ChevronRight, Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TrainerProfile, Post, UserRole } from "../types";

interface TrainerProfileViewProps {
  trainerId: string;
  trainers: TrainerProfile[];
  posts: Post[];
  currentUser: { 
    id: string; 
    name: string; 
    email: string; 
    role: string; 
    avatar: string; 
    subscriptions: string[]; 
  } | null;
  onSubscribeTrainer: (trainerId: string) => void;
  onUnsubscribeTrainer?: (trainerId: string) => void;
  onBack: () => void;
  setTab: (tab: string) => void;
}

export default function TrainerProfileView({
  trainerId,
  trainers,
  posts,
  currentUser,
  onSubscribeTrainer,
  onUnsubscribeTrainer,
  onBack,
  setTab
}: TrainerProfileViewProps) {
  
  const trainer = trainers.find(t => t.id === trainerId);
  
  // Local premium subscription simulator state
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "locker" | "credentials">("about");

  if (!trainer) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <div className="p-4 bg-brand/10 text-brand rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Trainer Not Found</h2>
          <p className="text-xs text-gray-400">The requested trainer profile could not be loaded or retrieved.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-5 py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-mono font-bold uppercase text-white transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isSubscribed = currentUser?.subscriptions.includes(trainer.id) || false;

  // Filter posts created by this trainer
  const trainerPosts = posts.filter(p => p.trainerId === trainer.id);

  const handleSubscribeClick = () => {
    if (!currentUser) {
      alert("Please register or sign in to authorize locker subscriptions.");
      return;
    }
    if (isSubscribed) {
      if (onUnsubscribeTrainer) {
        onUnsubscribeTrainer(trainer.id);
      }
    } else {
      setShowPaymentOverlay(true);
    }
  };

  const handleProcessPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      onSubscribeTrainer(trainer.id);
      setIsPaying(false);
      setShowPaymentOverlay(false);
    }, 1500);
  };

  const handleStartChat = () => {
    setTab("messages");
    // State sync: could also trigger an event to activate this specific trainer in chat list
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 text-left space-y-6">
      
      {/* Back Button and Header Navigation Row */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-xs font-mono font-bold uppercase text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand" />
          Back to feed
        </button>
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Dynamic Creator Card v2.4
        </span>
      </div>

      {/* Main Profile Presentation Banner Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-panel overflow-hidden border border-white/5 flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 h-48 w-48 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative shrink-0">
          <img 
            src={trainer.avatar} 
            alt={trainer.name} 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-brand/40 shadow-xl shadow-brand/10"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-luxury-black rounded-full" />
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center md:justify-start">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              {trainer.name}
              {trainer.verified && <ShieldCheck className="w-6 h-6 text-brand" />}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[9px] font-mono uppercase font-black tracking-wider">
              {trainer.specialty}
            </span>
          </div>

          <p className="text-xs text-gray-400 font-mono flex items-center justify-center md:justify-start gap-1.5 leading-none">
            <Mail className="w-3.5 h-3.5 text-gray-500" />
            {trainer.email}
          </p>

          <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start font-mono text-[9px] font-bold">
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-gray-300 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {trainer.rating || 4.9} rating
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-gray-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              {trainer.subscribersCount || 104} Active subscribers
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-gray-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {trainer.country}
            </span>
          </div>
        </div>

        {/* Subscription Control and Quick Chat actions */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full sm:w-auto md:w-fit">
          <button
            onClick={handleSubscribeClick}
            className={`px-5 py-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isSubscribed 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/25"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            {isSubscribed ? "Active Member ✓" : `Unlock Locker ($${trainer.monthlyPrice}/mo)`}
          </button>
          
          <button
            onClick={handleStartChat}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-brand animate-pulse" />
            Direct Messenger Desk
          </button>
        </div>
      </div>

      {/* Profile Detail Hub Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Navigation Tabs and details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sub-Tabs navigation */}
          <div className="flex gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5">
            {(["about", "locker", "credentials"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab 
                    ? "bg-white/5 text-white border border-white/5" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab === "about" && "Bio & Philosophy"}
                {tab === "locker" && `Published Lockers (${trainerPosts.length})`}
                {tab === "credentials" && "Specialized Accreditations"}
              </button>
            ))}
          </div>

          {/* Tab 1: About, Bio and specialties */}
          {activeTab === "about" && (
            <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand" />
                  Mission statement
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed italic p-4 bg-black/40 border border-white/5 rounded-2xl">
                  "{trainer.bio}"
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Coaching specialties & methods</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-300 space-y-1.5">
                    <span className="font-mono text-brand font-bold text-[10px] uppercase">01. Kinematics analysis</span>
                    <p className="text-[11px] leading-relaxed text-gray-400">Leverages visual vectors and center-of-pressure maps to pinpoint shear strain inside load paths.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-300 space-y-1.5">
                    <span className="font-mono text-amber-500 font-bold text-[10px] uppercase">02. Progressive strain index</span>
                    <p className="text-[11px] leading-relaxed text-gray-400">Monitors systemic CNS fatigue profiles to design terminal compound overload patterns safely.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Authorized Dialect Support</span>
                  <span className="text-[10px] text-gray-500 block">Creator conducts consultations in multiple languages.</span>
                </div>
                <div className="flex gap-1.5">
                  {trainer.languages.map(lang => (
                    <span key={lang} className="px-2.5 py-1 rounded bg-brand/10 border border-brand/20 text-brand text-[9px] font-mono uppercase font-black tracking-wider">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Published Lockers Feed */}
          {activeTab === "locker" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {trainerPosts.length === 0 ? (
                <div className="p-12 text-center text-gray-500 border border-dashed border-white/15 rounded-2xl bg-luxury-gray">
                  <Lock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs font-mono">No published lockers are currently indexed.</p>
                </div>
              ) : (
                trainerPosts.map((post) => {
                  const isLocked = post.type === "premium" && !isSubscribed;
                  return (
                    <div 
                      key={post.id}
                      className="rounded-2xl bg-luxury-gray border border-white/5 overflow-hidden text-left hover:border-brand/30 transition-colors"
                    >
                      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/30">
                        <div className="flex items-center gap-2.5">
                          <img src={post.trainerAvatar} alt={post.trainerName} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{post.title}</h4>
                            <p className="text-[9px] font-mono text-gray-500 uppercase">{post.date.split("T")[0]}</p>
                          </div>
                        </div>
                        {post.type === "premium" ? (
                          <span className="px-2 py-0.5 rounded bg-brand/10 border border-brand/20 text-brand text-[8px] font-mono uppercase font-black">
                            Premium
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 text-[8px] font-mono uppercase">
                            Free Feed
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <img 
                          src={post.mediaUrls?.[0] || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"} 
                          alt={post.title} 
                          className={`w-full max-h-64 object-cover ${isLocked ? "filter blur-xl brightness-50" : ""}`}
                        />
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
                            <Lock className="w-5 h-5 text-brand mb-2 animate-bounce" />
                            <h4 className="text-xs font-black text-white uppercase tracking-wider">Premium Lock Engaged</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5 max-w-xs leading-normal">
                              Subscribe to this specialist's channel to authorize access to high-def biomechanics videos.
                            </p>
                          </div>
                        )}
                      </div>

                      {!isLocked && (
                        <div className="p-4 space-y-3">
                          <p className="text-xs text-gray-300 leading-relaxed">{post.content}</p>
                          <div className="flex items-center gap-4 text-gray-500 pt-2 border-t border-white/5 text-[11px] font-mono">
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                              <Heart className="w-4 h-4 shrink-0" fill={post.isLiked ? "#ff0033" : "none"} />
                              {post.likesCount}
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments.length} comments
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 3: Certifications Accreditations */}
          {activeTab === "credentials" && (
            <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Verified coaching accreditations
              </h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                LEER verification procedures require creators to upload validated certification hashes from international federations before achieving the checkmark.
              </p>

              <div className="space-y-2.5 pt-2">
                {trainer.certificates.map((cert, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between gap-4 transition-all hover:bg-black/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand/10 border border-brand/20 text-brand rounded-lg shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate leading-snug">{cert.name}</h4>
                        <span className="text-[9px] font-mono text-gray-500 uppercase">Verification Registry Check ✓</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-mono text-gray-400 shrink-0 uppercase">
                      Issued {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Quick Consult and Telemetry Widgets */}
        <div className="space-y-6">
          
          {/* Locker Membership Rates card */}
          <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white">Membership portal</h4>
            <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-center space-y-1">
              <span className="text-[9px] font-mono text-gray-500 uppercase block">Standard subscription rate</span>
              <span className="text-2xl font-black text-white block">${trainer.monthlyPrice}.00 / mo</span>
              <span className="text-[9px] font-mono text-emerald-400 block">Cancel anytime instantly</span>
            </div>

            <ul className="space-y-2.5 pt-2 text-[11px] text-gray-400 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Unlimited premium lockers & media attachments</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>High-priority ticketing queue answers in under 12h</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Locked 1-on-1 direct message pipelines</span>
              </li>
            </ul>

            <button
              onClick={handleSubscribeClick}
              className={`w-full py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all mt-3 cursor-pointer ${
                isSubscribed 
                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20" 
                  : "bg-brand hover:bg-brand-hover text-white shadow-md shadow-brand/10"
              }`}
            >
              {isSubscribed ? "Deactivate Membership" : "Join Channel Portal"}
            </button>
          </div>

          {/* Quick coaching ticket widget */}
          <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white">Ask biomechanics query</h4>
              <Award className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            
            <p className="text-[10px] text-gray-400 leading-normal">
              Directly submit a load paths analysis ticket to {trainer.name} to audit bar alignment or joint shear vectors.
            </p>

            <button
              onClick={() => {
                setTab("coaching");
              }}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Consult now <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Payment Onboarding Simulator Modal */}
      <AnimatePresence>
        {showPaymentOverlay && (
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
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Premium Authorization</span>
                  <button onClick={() => setShowPaymentOverlay(false)} className="text-gray-400 hover:text-white text-xs font-mono uppercase cursor-pointer">
                    [Close]
                  </button>
                </div>

                <img src={trainer.avatar} alt={trainer.name} className="w-14 h-14 rounded-2xl object-cover border border-brand/50 mx-auto" />

                <div>
                  <h3 className="text-base font-black text-white">{trainer.name}</h3>
                  <p className="text-[10px] text-brand font-mono uppercase font-bold mt-0.5">{trainer.specialty}</p>
                </div>

                {/* Bill pricing */}
                <div className="p-4 bg-luxury-gray border border-white/5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Monthly Membership:</span>
                    <span className="font-mono text-white font-bold">${trainer.monthlyPrice}.00 / month</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                    <span className="font-bold text-white">Secure Total Charge:</span>
                    <span className="font-mono text-brand font-extrabold">${trainer.monthlyPrice}.00</span>
                  </div>
                </div>

                {/* credit cards triggers */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleProcessPayment}
                    disabled={isPaying}
                    className="flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg py-2.5 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    {isPaying ? "Processing..." : "Stripe Pay"}
                  </button>
                  <button
                    onClick={handleProcessPayment}
                    disabled={isPaying}
                    className="bg-white/10 hover:bg-white/15 text-white rounded-lg py-2.5 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                  >
                    Google Pay
                  </button>
                </div>

                <p className="text-[8px] text-gray-500 font-mono">
                  SSL SECURE 256-BIT. Auto-renews monthly. Cancel anytime under account settings.
                </p>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
