/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  TrendingUp, Scale, Flame, Award, Plus, 
  Trash2, Upload, Calendar, CheckSquare, Target, Dumbbell,
  Smile, Battery, Bed, Brain, Sparkles, Heart, Activity, ThumbsUp, 
  RefreshCw, BarChart3, ChevronRight, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserFitnessData } from "../types";

export interface WellnessCheckIn {
  date: string;
  mood: "tired" | "low" | "stable" | "energetic" | "peak";
  energyLevel: number; // 1-10
  sleepHours: number; // hours
  sleepQuality: "poor" | "fair" | "good" | "deep";
  notes?: string;
}

interface TransformationTrackerProps {
  fitnessData: UserFitnessData;
  onLogMetrics: (metrics: { date: string; weight: number; bodyFat: number; muscleMass: number }) => void;
  onAddGoal: (goal: string) => void;
  onToggleGoal: (goal: string) => void;
}

export default function TransformationTracker({
  fitnessData,
  onLogMetrics,
  onAddGoal,
  onToggleGoal,
}: TransformationTrackerProps) {
  
  // Local states
  const [inputWeight, setInputWeight] = useState("");
  const [inputBodyFat, setInputBodyFat] = useState("");
  const [inputMuscle, setInputMuscle] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [logSuccess, setLogSuccess] = useState("");

  // Gamified Daily Streak States
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem("leer_streak_count");
    return saved ? parseInt(saved, 10) : 5; // Default starter streak
  });

  const [lastLoggedDate, setLastLoggedDate] = useState<string>(() => {
    return localStorage.getItem("leer_streak_last_logged") || "";
  });

  const [weeklyActivity, setWeeklyActivity] = useState<{ day: string; label: string; active: boolean; isToday?: boolean }[]>(() => {
    const saved = localStorage.getItem("leer_weekly_activity");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Handled below
      }
    }
    return [
      { day: "Mon", label: "Jun 29", active: true },
      { day: "Tue", label: "Jun 30", active: false, isToday: true },
      { day: "Wed", label: "Jul 01", active: false },
      { day: "Thu", label: "Jul 02", active: false },
      { day: "Fri", label: "Jul 03", active: false },
      { day: "Sat", label: "Jul 04", active: false },
      { day: "Sun", label: "Jul 05", active: false }
    ];
  });

  const [streakCompletedToday, setStreakCompletedToday] = useState<boolean>(() => {
    return localStorage.getItem("leer_streak_last_logged") === "2026-06-30";
  });

  const [streakMultiplier, setStreakMultiplier] = useState<number>(1.5);
  const [streakXP, setStreakXP] = useState<number>(350);
  const [showStreakBonusToast, setShowStreakBonusToast] = useState(false);

  const incrementStreak = () => {
    const todayStr = "2026-06-30";
    if (lastLoggedDate === todayStr) return;

    const newCount = streakCount + 1;
    setStreakCount(newCount);
    setLastLoggedDate(todayStr);
    setStreakCompletedToday(true);
    setStreakXP(prev => prev + 100);
    setStreakMultiplier(1.8);
    setShowStreakBonusToast(true);

    localStorage.setItem("leer_streak_count", newCount.toString());
    localStorage.setItem("leer_streak_last_logged", todayStr);

    const updatedActivity = weeklyActivity.map(day => {
      if (day.isToday) {
        return { ...day, active: true };
      }
      return day;
    });
    setWeeklyActivity(updatedActivity);
    localStorage.setItem("leer_weekly_activity", JSON.stringify(updatedActivity));

    setTimeout(() => {
      setShowStreakBonusToast(false);
    }, 5000);
  };

  // New Wellness Check-In States
  const [wellnessLogs, setWellnessLogs] = useState<WellnessCheckIn[]>([
    { date: "Jan", mood: "low", energyLevel: 4, sleepHours: 5.5, sleepQuality: "poor", notes: "Felt general fatigue. Adapting to the new high-hypertrophy baseline program." },
    { date: "Feb", mood: "stable", energyLevel: 6, sleepHours: 6.2, sleepQuality: "fair", notes: "Stretching post-workout has helped limit lumbar compression." },
    { date: "Mar", mood: "energetic", energyLevel: 8, sleepHours: 7.5, sleepQuality: "good", notes: "Pristine overhead stability this month. Sleep hygiene improved." },
    { date: "Apr", mood: "peak", energyLevel: 9, sleepHours: 8.0, sleepQuality: "deep", notes: "Sub-15% body fat threshold reached. Energy remains fully saturated." },
    { date: "May", mood: "energetic", energyLevel: 8, sleepHours: 7.8, sleepQuality: "deep", notes: "Consistent deep sleep. High muscle recruitment during lat exercises." }
  ]);
  const [selectedChartTab, setSelectedChartTab] = useState<"physical" | "wellness" | "correlation">("physical");

  // Wellness Form States
  const [inputMood, setInputMood] = useState<"tired" | "low" | "stable" | "energetic" | "peak">("stable");
  const [inputEnergy, setInputEnergy] = useState<number>(7);
  const [inputSleep, setInputSleep] = useState<number>(7.5);
  const [inputSleepQuality, setInputSleepQuality] = useState<"poor" | "fair" | "good" | "deep">("good");
  const [inputNotes, setInputNotes] = useState("");
  const [wellnessSuccess, setWellnessSuccess] = useState("");

  const handleWellnessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    // Use short month format to align with chart labels like "Jan", "Feb", etc. or custom date representation
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = monthNames[today.getMonth()];

    // Remove any existing wellness log for this date to avoid duplicate entries
    setWellnessLogs(prev => {
      const filtered = prev.filter(item => item.date.toLowerCase() !== formattedDate.toLowerCase());
      return [
        ...filtered,
        {
          date: formattedDate,
          mood: inputMood,
          energyLevel: inputEnergy,
          sleepHours: inputSleep,
          sleepQuality: inputSleepQuality,
          notes: inputNotes.trim()
        }
      ];
    });

    setInputNotes("");
    setWellnessSuccess("Daily check-in completed! Wellness charts & correlation vectors compiled.");
    setTimeout(() => setWellnessSuccess(""), 4000);

    // Trigger daily streak increment
    incrementStreak();
  };

  const handleMetricsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(inputWeight);
    const bf = parseFloat(inputBodyFat);
    const m = parseFloat(inputMuscle);

    if (isNaN(w) || isNaN(bf) || isNaN(m)) return;

    const todayStr = new Date().toISOString().split("T")[0];

    onLogMetrics({
      date: todayStr,
      weight: w,
      bodyFat: bf,
      muscleMass: m,
    });

    setInputWeight("");
    setInputBodyFat("");
    setInputMuscle("");
    setLogSuccess("Today's physiological parameters logged! Metric graphs refreshed.");
    setTimeout(() => setLogSuccess(""), 4000);

    // Trigger daily streak increment
    incrementStreak();
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    onAddGoal(newGoal.trim());
    setNewGoal("");
  };

  // Mock progress photos
  const progressPhotos = [
    { date: "Week 1 (Jan 01)", weight: "88.5 kg", bodyFat: "19.5%", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop" },
    { date: "Week 12 (Mar 25)", weight: "86.1 kg", bodyFat: "16.1%", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop" },
    { date: "Week 24 (Today)", weight: "84.0 kg", bodyFat: "13.8%", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop" },
  ];

  // Prepare unified chart data mapping physical biometrics to corresponding wellness check-ins
  const chartData = fitnessData.history.map(item => {
    const matchingWellness = wellnessLogs.find(w => 
      w.date.toLowerCase() === item.date.toLowerCase() ||
      item.date.toLowerCase().includes(w.date.toLowerCase()) ||
      w.date.toLowerCase().includes(item.date.toLowerCase())
    );
    return {
      ...item,
      sleepHours: matchingWellness ? matchingWellness.sleepHours : 7.0,
      energyLevel: matchingWellness ? matchingWellness.energyLevel : 6,
      moodIndex: matchingWellness 
        ? (matchingWellness.mood === "tired" ? 2 
           : matchingWellness.mood === "low" ? 4 
           : matchingWellness.mood === "stable" ? 6 
           : matchingWellness.mood === "energetic" ? 8 
           : 10) // Map 1-10 for unified scaling
        : 6
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Title & Streak Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-brand/10 text-brand font-mono text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
              Performance Center
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Biometric Progression Lab
          </h1>
          <p className="text-xs text-gray-400">Track structural hypertrophy, body fat depletion indices, and compound performance metrics.</p>
        </div>

        {/* Daily Gamified Streak Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-xl shrink-0 w-full lg:w-auto">
          {/* Fire / Badge */}
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5 w-full sm:w-auto justify-center">
            <div className="relative">
              <motion.div
                animate={streakCompletedToday ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                className="p-2 rounded-lg bg-brand/10 border border-brand/20"
              >
                <Flame className={`w-6 h-6 ${streakCompletedToday ? "text-brand animate-pulse" : "text-gray-500"}`} />
              </motion.div>
              {streakCompletedToday && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
                </span>
              )}
            </div>
            
            <div className="text-left font-mono">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white">{streakCount}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Days</span>
              </div>
              <p className="text-[9px] text-brand uppercase tracking-wider font-black">Daily Streak</p>
            </div>
          </div>

          {/* 7-Day Timeline */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 uppercase px-1">
              <span>Weekly Consistency Vector</span>
              <span className="text-brand font-bold">{streakCompletedToday ? "Today Active!" : "Pending Check-In"}</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              {weeklyActivity.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 relative group cursor-pointer">
                  {/* Circle indicating check-in status */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border text-[9px] font-mono font-bold transition-all relative ${
                      day.active
                        ? "bg-brand/10 border-brand text-brand shadow-sm shadow-brand/10"
                        : day.isToday
                        ? "bg-transparent border-dashed border-gray-600 text-gray-400 animate-pulse"
                        : "bg-white/[0.02] border-white/5 text-gray-600"
                    }`}
                  >
                    {day.active ? (
                      <Flame className="w-3.5 h-3.5 text-brand" />
                    ) : (
                      <span>{day.day[0]}</span>
                    )}
                  </motion.div>
                  <span className="text-[8px] font-mono text-gray-500 scale-90">{day.day}</span>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center z-20">
                    <div className="bg-black text-[8px] border border-white/10 px-2 py-1 rounded shadow-lg text-white font-mono whitespace-nowrap">
                      {day.label} {day.active ? "• Completed!" : day.isToday ? "• Today (Pending)" : "• Incomplete"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP & Fast Action */}
          <div className="flex flex-col items-center justify-center p-1 font-mono text-left w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-4">
            <div className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Multiplier</div>
            <div className="text-sm font-black text-emerald-400">{streakMultiplier}x XP</div>
            
            {!streakCompletedToday ? (
              <button
                onClick={incrementStreak}
                className="mt-1.5 px-3 py-1 bg-brand hover:bg-brand-hover text-white font-mono font-black text-[9px] rounded-lg tracking-wider uppercase transition-all shadow-md shadow-brand/10"
              >
                Fast Check-In
              </button>
            ) : (
              <span className="mt-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-[9px] rounded-lg tracking-wider uppercase border border-emerald-500/20 font-bold">
                Logged (+100 XP)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Streak Reward Toast */}
      <AnimatePresence>
        {showStreakBonusToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-black border border-brand/40 shadow-xl shadow-brand/20 p-4 rounded-2xl z-50 flex items-center gap-3 text-left max-w-sm w-full"
          >
            <div className="p-2.5 bg-brand/20 rounded-xl border border-brand/40">
              <Flame className="w-6 h-6 text-brand animate-bounce" />
            </div>
            <div className="font-mono">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Streak Fire Ignited! 🔥</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">You've reached a <strong>{streakCount}-day tracking streak</strong>! Multiplier elevated to <strong>{streakMultiplier}x</strong>.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {logSuccess && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs mb-6 text-left">
          {logSuccess}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metric Visualizer Graphs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recharts Graphical Panel */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4 border border-white/5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand" />
                  Progression Analytics Hub
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">Select visualizer vector mapping physical vs sensory performance data.</p>
              </div>

              {/* Graphical Mode Tabs */}
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 self-start sm:self-auto shrink-0">
                {(["physical", "wellness", "correlation"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedChartTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                      selectedChartTab === tab 
                        ? "bg-brand text-white shadow-md shadow-brand/10" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Informational Legends based on tab */}
            <div className="flex flex-wrap gap-4 text-[10px] font-mono py-1">
              {selectedChartTab === "physical" && (
                <>
                  <span className="flex items-center gap-1.5 text-brand"><span className="w-2.5 h-2.5 bg-brand rounded-full inline-block" /> Weight (kg)</span>
                  <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2.5 h-2.5 bg-blue-400 rounded-full inline-block" /> Muscle (kg)</span>
                  <span className="flex items-center gap-1.5 text-amber-500"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block" /> Body Fat (%)</span>
                </>
              )}
              {selectedChartTab === "wellness" && (
                <>
                  <span className="flex items-center gap-1.5 text-violet-400"><span className="w-2.5 h-2.5 bg-violet-400 rounded-full inline-block" /> Sleep Duration (hrs)</span>
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block" /> Energy Index (1-10)</span>
                  <span className="flex items-center gap-1.5 text-pink-500"><span className="w-2.5 h-2.5 bg-pink-500 rounded-full inline-block" /> Mood Score (1-10)</span>
                </>
              )}
              {selectedChartTab === "correlation" && (
                <>
                  <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2.5 h-2.5 bg-blue-400 rounded-full inline-block" /> Muscle Mass (kg)</span>
                  <span className="flex items-center gap-1.5 text-violet-400"><span className="w-2.5 h-2.5 bg-violet-400 rounded-full inline-block" /> Sleep Hours</span>
                  <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block" /> Energy level</span>
                </>
              )}
            </div>

            {/* Recharts Container */}
            <div className="w-full h-80 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="date" stroke="#666" style={{ fontSize: 10, fontFamily: "monospace" }} />
                  <YAxis stroke="#666" style={{ fontSize: 10, fontFamily: "monospace" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0b0b0f", borderColor: "#333", borderRadius: 12, fontSize: 11 }}
                    labelStyle={{ color: "#888", fontFamily: "monospace", fontWeight: "bold" }}
                  />
                  
                  {/* Tab-conditioned lines */}
                  {selectedChartTab === "physical" && (
                    <>
                      <Line type="monotone" dataKey="weight" stroke="#ff0033" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Weight (kg)" />
                      <Line type="monotone" dataKey="muscleMass" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Muscle Mass (kg)" />
                      <Line type="monotone" dataKey="bodyFat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Body Fat (%)" />
                    </>
                  )}

                  {selectedChartTab === "wellness" && (
                    <>
                      <Line type="monotone" dataKey="sleepHours" stroke="#a78bfa" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Sleep duration (hrs)" />
                      <Line type="monotone" dataKey="energyLevel" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Energy Index (1-10)" />
                      <Line type="monotone" dataKey="moodIndex" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} name="Mood Score (1-10)" />
                    </>
                  )}

                  {selectedChartTab === "correlation" && (
                    <>
                      <Line type="monotone" dataKey="muscleMass" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Muscle Mass (kg)" />
                      <Line type="monotone" dataKey="sleepHours" stroke="#a78bfa" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3 }} name="Sleep Hours" />
                      <Line type="monotone" dataKey="energyLevel" stroke="#10b981" strokeWidth={2.5} strokeDasharray="3 3" dot={{ r: 3 }} name="Energy index" />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Analytical Insights based on Tab */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5 mt-2">
              {selectedChartTab === "physical" ? (
                <div className="text-[11px] text-gray-400 flex items-start gap-2 leading-relaxed">
                  <Activity className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span>
                    <strong>Biometric Trend:</strong> Linear hypertrophy of <strong>+4.1kg lean mass</strong> has successfully run parallel to a <strong>-5.7% systemic body fat drop</strong>. Central nervous system adaptations are positive.
                  </span>
                </div>
              ) : selectedChartTab === "wellness" ? (
                <div className="text-[11px] text-gray-400 flex items-start gap-2 leading-relaxed">
                  <Brain className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Wellness Trend:</strong> Sleep duration curves optimized by <strong>+2.3 hours</strong> since January. Subjective mood indices are closely linked with rapid cardiac recovery and reduced resting fatigue.
                  </span>
                </div>
              ) : (
                <div className="text-[11px] text-gray-300 flex flex-col gap-2 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <span className="font-bold text-white">Advanced Biometric Correlation Matrix:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 pt-1 font-mono text-[10px]">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-violet-400 font-bold uppercase block mb-1">Sleep vs Muscle Gain</span>
                      <span>An average of &gt; 7.5 hrs sleep correlates with a <strong>22% acceleration</strong> in monthly muscle synthesis.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-emerald-400 font-bold uppercase block mb-1">Energy vs fat loss</span>
                      <span>High Energy Index (&ge; 8) days correlate with an average of <strong>14% higher work density</strong> and accelerated fat burn rates.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transformation Photos Gallery */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-gray-400">Progressive Photo Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {progressPhotos.map((photo, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="relative group overflow-hidden rounded-xl border border-white/5 bg-luxury-gray cursor-pointer"
                >
                  <img 
                    src={photo.url} 
                    alt={photo.date} 
                    className="w-full h-44 object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent flex flex-col justify-end p-3 text-left">
                    <p className="text-[10px] font-mono text-brand font-bold uppercase">{photo.date}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[11px] font-bold text-white">Mass: {photo.weight}</span>
                      <span className="text-[10px] text-gray-400 font-mono">Fat: {photo.bodyFat}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Upload Mock Button */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-4 h-44 text-gray-500 cursor-pointer hover:border-brand hover:text-white transition-all"
              >
                <Upload className="w-6 h-6 mb-2 text-gray-600" />
                <span className="text-xs font-mono">Drop new photo</span>
                <span className="text-[9px] text-gray-600 mt-1">Accepts PNG/HEIC/HD</span>
              </motion.div>
            </div>
          </div>

        </div>

        {/* Right Column: Logging Form, Wellness Check-in, & Goals */}
        <div className="space-y-6">
          
          {/* Daily Wellness Check-In Card */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-white font-black">Daily Wellness Check-In</h3>
              </div>
              <span className="text-[8px] font-mono uppercase bg-brand/10 text-brand px-1.5 py-0.5 rounded font-black tracking-wider">Sensory</span>
            </div>

            <p className="text-[11px] text-gray-400">Log subjective neurological indices to align cognitive readiness with systemic body composition data.</p>

            {wellnessSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] leading-tight"
              >
                {wellnessSuccess}
              </motion.div>
            )}

            <form onSubmit={handleWellnessSubmit} className="space-y-4">
              
              {/* Mood Selection */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Subjective Mood Baseline</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(["tired", "low", "stable", "energetic", "peak"] as const).map((m) => {
                    const emojis = { tired: "😢", low: "😐", stable: "🙂", energetic: "😁", peak: "⚡" };
                    const isActive = inputMood === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setInputMood(m)}
                        title={`Felt ${m}`}
                        className={`py-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isActive 
                            ? "bg-brand/10 border-brand/50 scale-105" 
                            : "bg-[#0c0c10] border-white/5 hover:border-white/15"
                        }`}
                      >
                        <span className="text-sm">{emojis[m]}</span>
                        <span className="text-[7px] font-mono font-bold capitalize text-gray-400 mt-1">{m}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Energy Level (1-10 Segments) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-500 uppercase tracking-wider">Neural Energy index</span>
                  <span className="text-brand font-black">{inputEnergy}/10</span>
                </div>
                <div className="grid grid-cols-10 gap-1 bg-[#0c0c10] p-1.5 rounded-xl border border-white/5">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const val = i + 1;
                    const isActive = inputEnergy === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setInputEnergy(val)}
                        className={`h-6 rounded-md text-[9px] font-mono font-bold transition-all cursor-pointer ${
                          isActive 
                            ? "bg-brand text-white font-black scale-105" 
                            : "bg-white/5 text-gray-500 hover:text-white"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sleep Quality Grid */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Sleep Quality Index</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["poor", "fair", "good", "deep"] as const).map((q) => {
                    const labels = { poor: "🛌 Restless", fair: "💤 Broken", good: "😴 Restful", deep: "🔋 Deep" };
                    const isActive = inputSleepQuality === q;
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setInputSleepQuality(q)}
                        className={`py-2 px-3 rounded-xl border text-[10px] text-left transition-all cursor-pointer ${
                          isActive 
                            ? "bg-brand/10 border-brand/40 text-brand font-bold" 
                            : "bg-[#0c0c10] border-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {labels[q]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sleep Duration Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-gray-500 uppercase tracking-wider">Sleep Duration</span>
                  <span className="text-violet-400 font-bold">{inputSleep} Hours</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={inputSleep}
                  onChange={(e) => setInputSleep(parseFloat(e.target.value))}
                  className="w-full accent-brand bg-[#0c0c10] rounded-lg cursor-pointer h-1"
                />
              </div>

              {/* Subjective Check-in Notes */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Somatic Feedback / Daily Journal</label>
                <textarea
                  value={inputNotes}
                  onChange={(e) => setInputNotes(e.target.value)}
                  placeholder="Note muscular soreness, heart-rate state, cognitive focus level..."
                  rows={2}
                  className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2 px-3 text-[11px] text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-1.5"
              >
                <Smile className="w-4 h-4" />
                Submit Daily Wellness Check-In
              </button>
            </form>
          </div>

          {/* Metrics Entry Form */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-brand" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">Log Today's Biometrics</h3>
            </div>

            <form onSubmit={handleMetricsSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder="e.g. 84.2"
                  className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={inputBodyFat}
                    onChange={(e) => setInputBodyFat(e.target.value)}
                    placeholder="e.g. 14.5"
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Muscle Mass (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={inputMuscle}
                    onChange={(e) => setInputMuscle(e.target.value)}
                    placeholder="e.g. 41.2"
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-brand/20"
              >
                Save Log Metrics
              </button>
            </form>
          </div>

          {/* Historical Sensory Timeline */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4 border border-white/5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">Subjective Timeline Log</h3>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {wellnessLogs.slice().reverse().map((log, index) => {
                const emojis = { tired: "😢", low: "😐", stable: "🙂", energetic: "😁", peak: "⚡" };
                const colors = { tired: "text-blue-400", low: "text-amber-500", stable: "text-emerald-400", energetic: "text-pink-400", peak: "text-brand animate-pulse" };
                return (
                  <div key={index} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-gray-300 font-bold">{log.date} Check-in</span>
                      <span className="text-[9px] text-gray-500">{log.sleepHours}h sleep ({log.sleepQuality})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{emojis[log.mood]}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase ${colors[log.mood]}`}>{log.mood}</span>
                      <span className="text-gray-600 font-mono text-[9px]">•</span>
                      <span className="text-[9px] font-mono text-gray-400">Energy Index: {log.energyLevel}/10</span>
                    </div>
                    {log.notes && (
                      <p className="text-[10px] text-gray-400 leading-normal italic">
                        "{log.notes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goals Checklist Card */}
          <div className="p-6 rounded-2xl glass-panel text-left space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-brand" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">Active Milestone Anchors</h3>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {fitnessData.goals.map((goal, idx) => (
                  <motion.div 
                    key={goal}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    onClick={() => onToggleGoal(goal)}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckSquare className="w-4 h-4 text-brand" />
                      <span className="text-xs text-gray-200">{goal}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-brand/10 text-brand text-[8px] font-mono uppercase font-bold">Active</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add Goal form */}
            <form onSubmit={handleAddGoalSubmit} className="pt-2 border-t border-white/5 flex gap-2">
              <input
                type="text"
                required
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add custom milestone..."
                className="flex-1 bg-luxury-gray border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-brand transition-colors"
              />
              <button
                type="submit"
                className="bg-brand hover:bg-brand-hover text-white p-2 rounded-lg cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
