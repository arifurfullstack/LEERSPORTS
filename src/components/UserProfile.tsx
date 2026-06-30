/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  User, Mail, Camera, Check, Lock, Bell, Shield, Award, 
  Activity, Sparkles, Smartphone, ChevronRight, Star, 
  MessageSquare, LogOut, Heart, Eye, CheckCircle2, ShieldCheck,
  RefreshCw, Save, Settings, Dumbbell, Trophy, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole, TrainerProfile, UserFitnessData } from "../types";

interface UserProfileProps {
  currentUser: { 
    id: string; 
    name: string; 
    email: string; 
    role: UserRole; 
    avatar: string; 
    subscriptions: string[]; 
    verified?: boolean; 
  } | null;
  fitnessData: UserFitnessData;
  trainers: TrainerProfile[];
  onUpdateProfile: (updated: { name: string; email: string; avatar: string }) => void;
  onLogout: () => void;
  onUnsubscribeTrainer?: (trainerId: string) => void;
  setTab: (tab: string) => void;
  onSelectTrainerProfile?: (id: string) => void;
}

export default function UserProfile({
  currentUser,
  fitnessData,
  trainers,
  onUpdateProfile,
  onLogout,
  onUnsubscribeTrainer,
  setTab,
  onSelectTrainerProfile
}: UserProfileProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editEmail, setEditEmail] = useState(currentUser?.email || "");
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || "");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Simulated preferences
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wearableSynced, setWearableSynced] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Subscribed trainers
  const subscribedCoaches = trainers.filter(t => 
    currentUser?.subscriptions.includes(t.id)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim() || !editAvatar.trim()) return;

    onUpdateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      avatar: editAvatar.trim()
    });

    setSaveSuccess("Profile records updated successfully!");
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(""), 4000);
  };

  const handleSyncWearable = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSaveSuccess("Wearable telemetry synced! Latest cardiac metrics fetched.");
      setTimeout(() => setSaveSuccess(""), 4000);
    }, 1500);
  };

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <div className="p-4 bg-brand/10 text-brand rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Access Restricted</h2>
          <p className="text-xs text-gray-400">Please sign in to configure metrics, subscription states, and custom locker keys.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 text-left space-y-8">
      
      {/* Header Banner Area */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-panel overflow-hidden border border-white/5 flex flex-col md:flex-row items-center gap-6">
        {/* Animated ambient blob */}
        <div className="absolute top-0 right-0 h-44 w-44 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative shrink-0 group">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-brand/40 shadow-xl shadow-brand/10"
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 justify-center md:justify-start">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              {currentUser.name}
              {currentUser.verified && <ShieldCheck className="w-5 h-5 text-brand" />}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[9px] font-mono uppercase font-black tracking-wider">
              {currentUser.role}
            </span>
          </div>
          
          <p className="text-xs text-gray-400 font-mono flex items-center justify-center md:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5 text-gray-500" />
            {currentUser.email}
          </p>

          <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-gray-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-brand" />
              Lvl 24 Sports Science
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-gray-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {fitnessData.achievements.length} Achievements
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-gray-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              {currentUser.subscriptions.length} Subscriptions
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full sm:w-auto md:w-fit">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isEditing 
                ? "bg-white/10 text-white border border-white/10" 
                : "bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/20"
            }`}
          >
            <Settings className="w-4 h-4" />
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
          
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/20 text-red-400 hover:text-red-300 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {saveSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          {saveSuccess}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column (2 spans wide) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PROFILE EDIT FORM PANEL */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSave} className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-brand font-black flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Modify Locker Identity Credentials
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Athlete Display Name</label>
                      <input 
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Secure Communication Email</label>
                      <input 
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase">Avatar Asset URL</label>
                    <input 
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-brand transition-colors font-mono"
                      placeholder="https://images.unsplash.com/... or other media host"
                      required
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent text-xs text-gray-300 font-mono transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Commit Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PHYSIOLOGICAL SUMMARY BIOMETRICS */}
          <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand" />
                  Somatic Profile & Biometrics
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Telemetry parameters synchronized with the Transformation Progress lab.</p>
              </div>
              <button 
                onClick={() => setTab("tracker")}
                className="text-[9px] font-mono uppercase bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center gap-1 cursor-pointer transition-all"
              >
                Go to Tracker
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-left space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase block">Total Mass</span>
                <span className="text-base font-black text-white block">{fitnessData.weight} kg</span>
                <span className="text-[9px] font-mono text-emerald-400 block">-4.5kg over 24wk</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-left space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase block">Adipose body fat</span>
                <span className="text-base font-black text-brand block">{fitnessData.bodyFat}%</span>
                <span className="text-[9px] font-mono text-emerald-400 block">-5.7% subthreshold</span>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-left space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase block">Lean Myofibrillar Mass</span>
                <span className="text-base font-black text-white block">{fitnessData.muscleMass} kg</span>
                <span className="text-[9px] font-mono text-emerald-400 block">+4.1kg hyper trophy</span>
              </div>
            </div>

            {/* Wearable synchronizer */}
            <div className="p-4 rounded-xl bg-[#0c0c10] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-white block flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-violet-400" />
                  Wearable Telemetry Stream
                </span>
                <span className="text-[10px] text-gray-400 block">Sync sleep, circadian mood loggers, and heart rate indices automatically.</span>
              </div>
              <button
                type="button"
                onClick={handleSyncWearable}
                disabled={syncing}
                className="bg-violet-600 hover:bg-violet-700 text-white font-mono text-[9px] uppercase font-black tracking-widest px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync Device Data"}
              </button>
            </div>
          </div>

          {/* SUBSCRIBED COACHES DIRECTORY */}
          <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Locker Subscriptions ({subscribedCoaches.length})
            </h3>
            <p className="text-[10px] text-gray-500">You have authorized premium access locks with these elite coaches.</p>

            {subscribedCoaches.length === 0 ? (
              <div className="p-8 text-center bg-black/20 rounded-xl border border-dashed border-white/5">
                <HelpCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <span className="text-xs font-mono text-gray-400 uppercase block">No active coaches</span>
                <button
                  onClick={() => setTab("coaching")}
                  className="mt-3 text-[10px] font-mono uppercase bg-brand text-white px-3 py-1.5 rounded-lg font-bold"
                >
                  Explore Coaching
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subscribedCoaches.map((coach) => (
                  <div key={coach.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex gap-3.5 items-start relative overflow-hidden group">
                    <img 
                      src={coach.avatar} 
                      alt={coach.name} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10 cursor-pointer hover:border-brand/40 transition-colors"
                      onClick={() => onSelectTrainerProfile?.(coach.id)}
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 
                        className="text-xs font-bold text-white truncate flex items-center gap-1 cursor-pointer hover:text-brand transition-colors"
                        onClick={() => onSelectTrainerProfile?.(coach.id)}
                      >
                        {coach.name}
                        {coach.verified && <CheckCircle2 className="w-3.5 h-3.5 text-brand" />}
                      </h4>
                      <p className="text-[10px] font-mono text-brand font-bold uppercase truncate">{coach.specialty}</p>
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => setTab("messages")}
                          className="bg-white/5 hover:bg-brand/10 text-[9px] font-mono text-gray-300 hover:text-brand border border-white/5 hover:border-brand/20 px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Chat
                        </button>
                        {onUnsubscribeTrainer && (
                          <button
                            onClick={() => onUnsubscribeTrainer(coach.id)}
                            className="text-[9px] font-mono text-gray-500 hover:text-red-400 px-2 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Unsubscribe
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Column (1 span wide) */}
        <div className="space-y-8">
          
          {/* INTERACTIVE TROPHY CABINET */}
          <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Trophy className="w-4.5 h-4.5 text-amber-500" />
              Trophy Showcase
            </h3>
            <p className="text-[10px] text-gray-500">Gamified milestones achieved during progressive overload periods.</p>

            <div className="space-y-3">
              {fitnessData.achievements.map((ach) => (
                <div key={ach.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-start gap-3 transition-transform hover:scale-[1.02]">
                  <span className="text-2xl shrink-0 mt-0.5 filter drop-shadow-md">{ach.icon}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate leading-snug">{ach.title}</h4>
                    <p className="text-[9px] text-gray-400 leading-normal mt-0.5 italic">"{ach.description}"</p>
                    <span className="text-[8px] font-mono text-brand font-bold block mt-1 uppercase">{ach.date} verified</span>
                  </div>
                </div>
              ))}
              
              {/* Locked Achievement teaser */}
              <div className="p-3 bg-black/10 border border-dashed border-white/5 rounded-xl flex items-start gap-3 opacity-40">
                <span className="text-2xl shrink-0 mt-0.5 grayscale">🔒</span>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 truncate leading-snug">Centurion Overload</h4>
                  <p className="text-[9px] text-gray-500 leading-normal mt-0.5">Sustain &gt;100kg load squat for 3 full templates.</p>
                </div>
              </div>
            </div>
          </div>

          {/* APPLICATION CONFIG PREFERENCES */}
          <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand" />
              Locker Preferences
            </h3>
            
            <div className="space-y-3">
              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-white block">Acoustic Feedbacks</span>
                  <span className="text-[9px] text-gray-500 block">Somatic completion rings</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
                    soundEnabled ? "bg-brand" : "bg-white/10"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                    soundEnabled ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Wearable Device Synced Toggle */}
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-white block">Auto-Sync Wearables</span>
                  <span className="text-[9px] text-gray-500 block">Query health links hourly</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWearableSynced(!wearableSynced)}
                  className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
                    wearableSynced ? "bg-brand" : "bg-white/10"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                    wearableSynced ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Email Alerts Toggle */}
              <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-white block">Trainer Post Digests</span>
                  <span className="text-[9px] text-gray-500 block">Weekly premium notifications</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
                    emailAlerts ? "bg-brand" : "bg-white/10"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                    emailAlerts ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* DEVELOPER PROFILE & CUSTOMIZATION SERVICES CARD */}
          <div className="p-6 rounded-2xl bg-luxury-gray border border-white/5 space-y-4 font-mono">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 flex items-center justify-between border-b border-white/5 pb-2">
              <span>Developer Profile</span>
              <span className="text-[8px] bg-brand/10 text-brand px-1.5 py-0.5 rounded font-black">SERVICES</span>
            </h3>
            
            <div className="space-y-2 text-[11px] text-gray-300">
              <div>
                <span className="text-gray-500">Lead Developer:</span> <span className="text-white font-bold">MD Arifur Rahman</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">💬 WhatsApp:</span>
                <a href="https://wa.me/8801756601431" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                  +880 1756-601431
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">✉️ Email:</span>
                <a href="mailto:arifur.fullstack@gmail.com" className="text-brand hover:underline">
                  arifur.fullstack@gmail.com
                </a>
              </div>
              <div className="text-[10px] text-gray-500 bg-black/40 rounded-xl p-3 border border-white/5 leading-relaxed mt-2">
                🛠️ <span className="text-gray-300 font-bold">Notice:</span> For any additional custom integrations or platform tailoring, feel free to send a DM!
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
