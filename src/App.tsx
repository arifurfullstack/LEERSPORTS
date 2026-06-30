/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navigation from "./components/Navigation";
import AuthModal from "./components/AuthModal";
import GlobalFeed from "./components/GlobalFeed";
import ShortsFeed from "./components/ShortsFeed";
import CommunitySection from "./components/CommunitySection";
import CoachingPortal from "./components/CoachingPortal";
import TransformationTracker from "./components/TransformationTracker";
import DashboardTrainer from "./components/DashboardTrainer";
import DashboardAdmin from "./components/DashboardAdmin";
import DirectMessages from "./components/DirectMessages";
import UserProfile from "./components/UserProfile";
import TrainerProfileView from "./components/TrainerProfileView";

import { 
  UserRole, TrainerProfile, Post, Short, CommunityPost, 
  CoachingQuestion, Notification, UserFitnessData 
} from "./types";

import { 
  START_TRAINERS, START_POSTS, START_SHORTS, 
  START_COMMUNITY, START_COACHING 
} from "./data";

import { 
  Award, Bell, Shield, LogOut, CheckCircle, ArrowRight, 
  UserCheck, Trash2, Sparkles, Lock, CreditCard, 
  ChevronRight, Activity, Calendar, ShieldAlert, Star,
  LockKeyhole, Mail, ShieldCheck, Languages, Eye, User
} from "lucide-react";

export default function App() {
  
  // -------------------------------------------------------------
  // Persistent State Handlers (LocalStorage fallback)
  // -------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: UserRole; avatar: string; subscriptions: string[]; verified?: boolean } | null>(() => {
    const saved = localStorage.getItem("leer_current_user");
    if (saved) return JSON.parse(saved);
    // Default mock Trainee login on initial playground load for convenient play
    return {
      id: "trainee_david",
      name: "David Chen",
      email: "david@gmail.com",
      role: UserRole.TRAINEE,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      subscriptions: ["alex_strength"], // default subscribed to Coach Alexander
    };
  });

  const [currentTab, setTab] = useState<string>(() => {
    return localStorage.getItem("leer_active_tab") || "feed";
  });

  const [trainers, setTrainers] = useState<TrainerProfile[]>(() => {
    const saved = localStorage.getItem("leer_trainers");
    return saved ? JSON.parse(saved) : START_TRAINERS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem("leer_posts");
    return saved ? JSON.parse(saved) : START_POSTS;
  });

  const [shorts, setShorts] = useState<Short[]>(() => {
    const saved = localStorage.getItem("leer_shorts");
    return saved ? JSON.parse(saved) : START_SHORTS;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem("leer_community");
    return saved ? JSON.parse(saved) : START_COMMUNITY;
  });

  const [coachingQuestions, setCoachingQuestions] = useState<CoachingQuestion[]>(() => {
    const saved = localStorage.getItem("leer_coaching");
    return saved ? JSON.parse(saved) : START_COACHING;
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif_1",
      type: "reply",
      title: "Coaching Prescription Ready",
      message: "Coach Alexander has analyzed your snatch pull knee path. Review the spreadsheet!",
      date: "2026-06-30T01:30:00Z",
      read: false,
    },
    {
      id: "notif_2",
      type: "tip",
      title: "$15 Tip Received",
      message: "An anonymous athlete tipped you for your mobility guide article. Keep writing!",
      date: "2026-06-29T21:10:00Z",
      read: true,
    }
  ]);

  const [fitnessData, setFitnessData] = useState<UserFitnessData>({
    weight: 84.0,
    bodyFat: 13.8,
    muscleMass: 42.1,
    history: [
      { date: "Jan", weight: 88.5, bodyFat: 19.5, muscleMass: 38.0 },
      { date: "Feb", weight: 87.2, bodyFat: 18.1, muscleMass: 39.2 },
      { date: "Mar", weight: 86.1, bodyFat: 16.1, muscleMass: 40.5 },
      { date: "Apr", weight: 85.0, bodyFat: 14.9, muscleMass: 41.2 },
      { date: "May", weight: 84.0, bodyFat: 13.8, muscleMass: 42.1 },
    ],
    goals: [
      "Overhead Squat hold stability under 110% load",
      "Decrease general lower back compression tension",
      "Achieve sub-12% body fat index",
    ],
    achievements: [
      { id: "ach_1", title: "Iron Core", description: "Successfully logged 5 consecutive core workouts.", date: "2026-06-15", icon: "🏆" },
      { id: "ach_2", title: "Overhead Mastery", description: "Completed Coach Alexander's Week Peaking block.", date: "2026-06-22", icon: "🔥" },
    ],
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedTrainerProfileId, setSelectedTrainerProfileId] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("leer_current_user", currentUser ? JSON.stringify(currentUser) : "");
    localStorage.setItem("leer_active_tab", currentTab);
    localStorage.setItem("leer_trainers", JSON.stringify(trainers));
    localStorage.setItem("leer_posts", JSON.stringify(posts));
    localStorage.setItem("leer_shorts", JSON.stringify(shorts));
    localStorage.setItem("leer_community", JSON.stringify(communityPosts));
    localStorage.setItem("leer_coaching", JSON.stringify(coachingQuestions));
  }, [currentUser, currentTab, trainers, posts, shorts, communityPosts, coachingQuestions]);

  // Unread notification counter
  const unreadCount = notifications.filter(n => !n.read).length;

  // -------------------------------------------------------------
  // Global Trigger Event Handlers
  // -------------------------------------------------------------
  const handleAuthSuccess = (user: any) => {
    setCurrentUser({
      ...user,
      subscriptions: user.role === UserRole.TRAINEE ? ["alex_strength"] : [], // Pre-subscribe trainee to alex for interactive view
    });
    // Redirect newly logged in users to Global Feed
    setTab("feed");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTab("feed");
    localStorage.removeItem("leer_current_user");
  };

  const handleUpdateProfile = (updated: { name: string; email: string; avatar: string }) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        name: updated.name,
        email: updated.email,
        avatar: updated.avatar
      };
    });
  };

  const handleUnsubscribeTrainer = (trainerId: string) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        subscriptions: prev.subscriptions.filter(id => id !== trainerId)
      };
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const liked = !p.isLiked;
        return {
          ...p,
          isLiked: liked,
          likesCount: p.likesCount + (liked ? 1 : -1)
        };
      }
      return p;
    }));
  };

  const handleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isSaved: !p.isSaved };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      userName: currentUser?.name || "Anonymous Guest",
      userAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
      text,
      date: new Date().toISOString(),
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  const handleLikeShort = (shortId: string) => {
    setShorts(prev => prev.map(s => {
      if (s.id === shortId) {
        const liked = !s.isLiked;
        return {
          ...s,
          isLiked: liked,
          likesCount: s.likesCount + (liked ? 1 : -1)
        };
      }
      return s;
    }));
  };

  const handleLikeCommunityPost = (postId: string) => {
    setCommunityPosts(prev => prev.map(cp => {
      if (cp.id === postId) {
        const liked = !cp.isLiked;
        return {
          ...cp,
          isLiked: liked,
          likesCount: cp.likesCount + (liked ? 1 : -1)
        };
      }
      return cp;
    }));
  };

  const handleAddCommunityPost = (newPost: any) => {
    const created: CommunityPost = {
      ...newPost,
      id: `cp_${Date.now()}`,
      userId: currentUser?.id || "guest",
      userName: currentUser?.name || "Guest Athlete",
      userAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
      userRole: (currentUser?.role as any) || UserRole.TRAINEE,
      likesCount: 0,
      comments: [],
      date: new Date().toISOString(),
      translations: {},
    };
    setCommunityPosts(prev => [created, ...prev]);
  };

  const handleAddCommunityComment = (postId: string, text: string) => {
    const newComment = {
      id: `cc_${Date.now()}`,
      userName: currentUser?.name || "Anonymous Guest",
      userAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
      text,
      date: new Date().toISOString(),
    };
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  const handleSubscribeTrainer = (trainerId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setCurrentUser(prev => {
      if (!prev) return null;
      if (prev.subscriptions.includes(trainerId)) return prev;
      return {
        ...prev,
        subscriptions: [...prev.subscriptions, trainerId]
      };
    });
  };

  const handleAddCoachingQuestion = (newQuestion: any) => {
    const created: CoachingQuestion = {
      ...newQuestion,
      id: `cq_${Date.now()}`,
      traineeId: currentUser?.id || "guest",
      traineeName: currentUser?.name || "David Chen",
      traineeAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      status: "pending",
      date: new Date().toISOString(),
    };
    setCoachingQuestions(prev => [created, ...prev]);

    // Send mock notification to active trainer
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        type: "coaching",
        title: "New Coaching Consultation",
        message: `${currentUser?.name} submitted biomechanics query: "${newQuestion.title}"`,
        date: new Date().toISOString(),
        read: false,
      },
      ...prev
    ]);
  };

  const handleReplyToQuestion = (questionId: string, replyText: string) => {
    setCoachingQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          status: "replied",
          trainerReplyText: replyText,
          replyDate: new Date().toISOString()
        };
      }
      return q;
    }));

    // Alert Trainee via notifications
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        type: "reply",
        title: "Training Prescription Ready",
        message: `Your coach has replied to your query: "${replyText.substring(0, 45)}..."`,
        date: new Date().toISOString(),
        read: false,
      },
      ...prev
    ]);
  };

  const handleFollowUpCoaching = (questionId: string, text: string) => {
    setCoachingQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          status: "coached",
          followUpText: text,
        };
      }
      return q;
    }));
  };

  const handleVerifyTrainerStatus = (trainerId: string, status: "verified" | "rejected") => {
    setTrainers(prev => prev.map(t => {
      if (t.id === trainerId) {
        return {
          ...t,
          verified: status === "verified",
          verificationStatus: status,
        };
      }
      return t;
    }));
  };

  const handleModeratePost = (postId: string, action: "delete" | "dismiss") => {
    if (action === "delete") {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const handleModerateCommunityPost = (postId: string, action: "delete" | "dismiss") => {
    if (action === "delete") {
      setCommunityPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const handleLogMetrics = (m: { date: string; weight: number; bodyFat: number; muscleMass: number }) => {
    setFitnessData(prev => ({
      ...prev,
      weight: m.weight,
      bodyFat: m.bodyFat,
      muscleMass: m.muscleMass,
      history: [...prev.history, m],
    }));
  };

  const handleAddGoal = (goal: string) => {
    setFitnessData(prev => ({
      ...prev,
      goals: [...prev.goals, goal],
    }));
  };

  const handleToggleGoal = (goal: string) => {
    setFitnessData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g !== goal),
    }));
  };

  // Add mock trainer-published content to feeds
  const handleAddNewTrainerPost = (newPost: any) => {
    const created: Post = {
      ...newPost,
      id: `p_${Date.now()}`,
      likesCount: 0,
      viewsCount: 1,
      comments: [],
      date: new Date().toISOString(),
      translations: {},
    };
    setPosts(prev => [created, ...prev]);
  };

  const handleAddNewTrainerShort = (newShort: any) => {
    const created: Short = {
      ...newShort,
      id: `s_${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    };
    setShorts(prev => [created, ...prev]);
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col pb-16 md:pb-0">
      
      {/* Dynamic Top/Bottom Navigation */}
      <Navigation 
        currentTab={currentTab} 
        setTab={setTab} 
        currentUser={currentUser} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        notificationCount={unreadCount}
        trainers={trainers}
        posts={posts}
        communityPosts={communityPosts}
        onSelectTrainerProfile={setSelectedTrainerProfileId}
      />

      {/* Main viewport frame */}
      <main className="flex-1 pb-10">
        <AnimatePresence mode="wait">
          
          {/* DYNAMIC CREATOR/TRAINER PROFILE PAGE */}
          {selectedTrainerProfileId && (
            <motion.div
              key="trainer_profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <TrainerProfileView
                trainerId={selectedTrainerProfileId}
                trainers={trainers}
                posts={posts}
                currentUser={currentUser}
                onSubscribeTrainer={handleSubscribeTrainer}
                onUnsubscribeTrainer={handleUnsubscribeTrainer}
                onBack={() => setSelectedTrainerProfileId(null)}
                setTab={(tab) => {
                  setSelectedTrainerProfileId(null);
                  setTab(tab);
                }}
              />
            </motion.div>
          )}

          {/* 1. GLOBAL INSTAGRAM-STYLE FEED */}
          {currentTab === "feed" && !selectedTrainerProfileId && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <GlobalFeed
                posts={posts}
                trainers={trainers}
                currentUser={currentUser}
                onLikePost={handleLikePost}
                onSavePost={handleSavePost}
                onAddComment={handleAddComment}
                onSubscribeTrainer={handleSubscribeTrainer}
                onSelectTrainerProfile={setSelectedTrainerProfileId}
              />
            </motion.div>
          )}

          {/* 2. TIKTOK-STYLE SHORTS ARENA */}
          {currentTab === "shorts" && !selectedTrainerProfileId && (
            <motion.div
              key="shorts"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <ShortsFeed
                shorts={shorts}
                trainers={trainers}
                currentUser={currentUser}
                onLikeShort={handleLikeShort}
                onSubscribeTrainer={handleSubscribeTrainer}
              />
            </motion.div>
          )}

          {/* 3. REDDIT-STYLE DISCUSSION FORUMS */}
          {currentTab === "community" && !selectedTrainerProfileId && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <CommunitySection
                communityPosts={communityPosts}
                currentUser={currentUser}
                onLikeCommunityPost={handleLikeCommunityPost}
                onAddCommunityPost={handleAddCommunityPost}
                onAddCommunityComment={handleAddCommunityComment}
              />
            </motion.div>
          )}

          {/* 4. BIOMECHANICS COACHING TICKETS PORTAL */}
          {currentTab === "coaching" && !selectedTrainerProfileId && (
            <motion.div
              key="coaching"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <CoachingPortal
                trainers={trainers.filter(t => t.verified)}
                coachingQuestions={coachingQuestions}
                currentUser={currentUser}
                onSubmitQuestion={handleAddCoachingQuestion}
                onSubmitFollowUp={handleFollowUpCoaching}
              />
            </motion.div>
          )}

          {/* 5. METRICS PROGRESSION GRAPHS LAB */}
          {currentTab === "tracker" && !selectedTrainerProfileId && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <TransformationTracker
                fitnessData={fitnessData}
                onLogMetrics={handleLogMetrics}
                onAddGoal={handleAddGoal}
                onToggleGoal={handleToggleGoal}
              />
            </motion.div>
          )}

          {/* 6. INSTANT MESSAGING DESK */}
          {currentTab === "messages" && !selectedTrainerProfileId && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <DirectMessages 
                trainers={trainers.filter(t => t.verified)}
                currentUser={currentUser}
              />
            </motion.div>
          )}

          {/* 7. NOTIFICATIONS LIST PANEL */}
          {currentTab === "notifications" && !selectedTrainerProfileId && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="mx-auto max-w-2xl px-4 py-8 sm:px-6 text-left"
            >
              <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-6">Alert Notifications</h1>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-2xl border transition-all flex gap-3.5 items-start ${
                      n.read ? "bg-white/5 border-white/5 opacity-60" : "bg-brand/5 border-brand/20"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-brand/10 text-brand">
                      <Bell className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-normal">{n.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{n.message}</p>
                      <span className="text-[9px] font-mono text-gray-500 block mt-2">Received: {n.date.split("T")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 8. TRAINER CREATOR DASHBOARD */}
          {currentTab === "trainer_dashboard" && currentUser?.role === UserRole.TRAINER && !selectedTrainerProfileId && (
            <motion.div
              key="trainer_dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <DashboardTrainer
                trainer={trainers.find(t => t.id === "alex_strength") || trainers[0]}
                coachingQuestions={coachingQuestions}
                onReplyToQuestion={handleReplyToQuestion}
                onAddPost={handleAddNewTrainerPost}
                onAddShort={handleAddNewTrainerShort}
              />
            </motion.div>
          )}

          {/* 9. ADMIN SECURITY CONTROL ROOM */}
          {currentTab === "admin_dashboard" && currentUser?.role === UserRole.ADMIN && !selectedTrainerProfileId && (
            <motion.div
              key="admin_dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <DashboardAdmin
                trainers={trainers}
                posts={posts}
                communityPosts={communityPosts}
                onVerifyTrainer={handleVerifyTrainerStatus}
                onModeratePost={handleModeratePost}
                onModerateCommunityPost={handleModerateCommunityPost}
              />
            </motion.div>
          )}

          {/* 10. USER ACCOUNT PROFILE SETTINGS */}
          {currentTab === "user_profile" && !selectedTrainerProfileId && (
            <motion.div
              key="user_profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <UserProfile
                currentUser={currentUser}
                fitnessData={fitnessData}
                trainers={trainers}
                onUpdateProfile={handleUpdateProfile}
                onLogout={handleLogout}
                onUnsubscribeTrainer={handleUnsubscribeTrainer}
                setTab={setTab}
                onSelectTrainerProfile={setSelectedTrainerProfileId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-white/5 bg-black/60 backdrop-blur-md py-8 px-4 mt-auto pb-24 md:pb-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <span className="font-mono text-sm font-black tracking-widest text-white uppercase">
              LEER <span className="text-brand">SPORTS</span>
            </span>
            <p className="text-[11px] text-gray-500 max-w-sm">
              Premium fitness creator & coaching platform. All rights reserved.
            </p>
          </div>
          
          {/* Developer Profile & Customization Services */}
          <div className="flex flex-col gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl max-w-md w-full text-left font-mono">
            <h4 className="text-xs font-bold text-white tracking-wide border-b border-white/5 pb-1.5 flex items-center justify-between">
              <span>Developer Profile & Customization Services</span>
              <span className="text-[9px] text-brand bg-brand/10 px-1.5 py-0.5 rounded">Lead Developer</span>
            </h4>
            <div className="space-y-1 text-[11px] text-gray-400 mt-1">
              <div>
                <span className="text-gray-500">Lead Developer:</span> <span className="text-white font-semibold">MD Arifur Rahman</span>
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
              <div className="text-[10px] text-gray-500 bg-white/5 rounded p-1.5 mt-2 border border-white/5 leading-relaxed">
                🛠️ <span className="text-gray-300 font-bold">Notice:</span> For any additional custom integrations or platform tailoring, feel free to send a DM!
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Dynamic Authorization Dialog Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
