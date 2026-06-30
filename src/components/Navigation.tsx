/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Flame, Home, Video, Heart, HelpCircle, 
  MessageSquare, User, Settings, Shield, 
  Bell, Award, TrendingUp, KeyRound, LogOut,
  Search, X, BookOpen, MessageCircle, Star, ArrowRight,
  ShieldCheck, Calendar, Languages, Check, Sparkles, Filter, 
  AlertCircle, ChevronRight, HelpCircle as QuestionIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole, TrainerProfile, Post, CommunityPost } from "../types";

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string) => void;
  currentUser: { id: string; name: string; email: string; role: UserRole; avatar: string; verified?: boolean; subscriptions: string[] } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  notificationCount: number;
  trainers?: TrainerProfile[];
  posts?: Post[];
  communityPosts?: CommunityPost[];
  onSelectTrainerProfile?: (id: string) => void;
}

interface SearchResult {
  id: string;
  type: "trainer" | "post" | "community";
  title: string;
  subtitle: string;
  body: string;
  original: any;
}

export default function Navigation({ 
  currentTab, 
  setTab, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  notificationCount,
  trainers = [],
  posts = [],
  communityPosts = [],
  onSelectTrainerProfile
}: NavigationProps) {
  
  const mainNavItems = [
    { id: "feed", label: "Global Feed", icon: Home },
    { id: "shorts", label: "Shorts Arena", icon: Video },
    { id: "community", label: "Community Hub", icon: HelpCircle },
    { id: "coaching", label: "Coaching Desk", icon: Award },
    { id: "tracker", label: "Progress Lab", icon: TrendingUp },
  ];

  // -------------------------------------------------------------
  // Global Search Overlay States & Handlers
  // -------------------------------------------------------------
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<"all" | "trainers" | "posts" | "discussions">("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Monitor shortcut Cmd+K or Ctrl+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input when search modal is opened
  useEffect(() => {
    if (isSearchOpen) {
      setSearchQuery("");
      setActiveIndex(0);
      setMobileDetailOpen(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Handle active index reset upon filter change
  useEffect(() => {
    setActiveIndex(0);
    setMobileDetailOpen(false);
  }, [searchFilter, searchQuery]);

  // Data Filtering
  const query = searchQuery.trim().toLowerCase();

  const matchedTrainers = trainers.filter(t => 
    t.name.toLowerCase().includes(query) || 
    t.specialty.toLowerCase().includes(query) || 
    t.bio.toLowerCase().includes(query) ||
    t.languages.some(lang => lang.toLowerCase().includes(query)) ||
    t.country.toLowerCase().includes(query)
  );

  const matchedPosts = posts.filter(p => 
    p.title.toLowerCase().includes(query) || 
    p.content.toLowerCase().includes(query) || 
    p.trainerName.toLowerCase().includes(query)
  );

  const matchedCommunity = communityPosts.filter(c => 
    c.title.toLowerCase().includes(query) || 
    c.content.toLowerCase().includes(query) || 
    c.userName.toLowerCase().includes(query)
  );

  // Map into standardized Result objects for universal list display
  const searchResults: SearchResult[] = [];

  if (searchFilter === "all" || searchFilter === "trainers") {
    matchedTrainers.forEach(t => {
      searchResults.push({
        id: t.id,
        type: "trainer",
        title: t.name,
        subtitle: t.specialty,
        body: t.bio,
        original: t
      });
    });
  }

  if (searchFilter === "all" || searchFilter === "posts") {
    matchedPosts.forEach(p => {
      searchResults.push({
        id: p.id,
        type: "post",
        title: p.title,
        subtitle: `By ${p.trainerName} • Specialist Post`,
        body: p.content,
        original: p
      });
    });
  }

  if (searchFilter === "all" || searchFilter === "discussions") {
    matchedCommunity.forEach(c => {
      searchResults.push({
        id: c.id,
        type: "community",
        title: c.title,
        subtitle: `By ${c.userName} • Thread [${c.type.toUpperCase()}]`,
        body: c.content,
        original: c
      });
    });
  }

  // Active highlighted item
  const selectedResult = searchResults[activeIndex] || null;

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedResult) {
        setMobileDetailOpen(true);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsSearchOpen(false);
    }
  };

  const handleNavigateFromSearch = (tab: string) => {
    setTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setTab("feed")} 
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
        >
          <Flame className="h-6 w-6 text-brand transition-transform group-hover:scale-110 duration-200 animate-pulse" />
          <span className="font-mono text-lg font-black tracking-widest text-white">
            LEER <span className="text-brand">SPORTS</span>
          </span>
        </div>

        {/* Global Search trigger bar in header */}
        <div 
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-2.5 w-36 lg:w-48 xl:w-40 2xl:w-64 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl px-3 py-1.5 cursor-pointer text-gray-400 text-xs font-mono transition-all group select-none shrink-0"
        >
          <Search className="h-4 w-4 text-gray-500 group-hover:text-brand transition-colors shrink-0" />
          <span className="flex-1 text-left text-gray-500 group-hover:text-gray-300 truncate whitespace-nowrap">Search database...</span>
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-black text-gray-400 bg-white/10 rounded-md border border-white/10 uppercase">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-black text-gray-400 bg-white/10 rounded-md border border-white/10 uppercase">
              K
            </kbd>
          </div>
        </div>

        {/* Responsive Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 shrink-0">
          {mainNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] xl:text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer select-none whitespace-nowrap"
                style={{ color: isActive ? "#ffffff" : "#9ca3af" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-brand rounded-lg shadow-lg shadow-brand/20 z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <IconComponent className="h-3.5 w-3.5 shrink-0" />
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Conditional Role-Based Navigation */}
          {currentUser?.role === UserRole.TRAINER && (
            <button
              onClick={() => setTab("trainer_dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] xl:text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                currentTab === "trainer_dashboard"
                  ? "bg-brand text-white"
                  : "text-brand hover:bg-brand/10"
              }`}
            >
              <Settings className="h-3.5 w-3.5 animate-spin-slow shrink-0" />
              Creator Panel
            </button>
          )}

          {currentUser?.role === UserRole.ADMIN && (
            <button
              onClick={() => setTab("admin_dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] xl:text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                currentTab === "admin_dashboard"
                  ? "bg-amber-600 text-white"
                  : "text-amber-500 hover:bg-amber-500/10"
              }`}
            >
              <Shield className="h-3.5 w-3.5 shrink-0" />
              Admin Panel
            </button>
          )}
        </nav>

        {/* User profile / Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Header Mobile Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer md:hidden"
            title="Search database"
          >
            <Search className="w-5 h-5" />
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Notification Bell */}
              <button 
                onClick={() => setTab("notifications")}
                className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
                  </span>
                )}
              </button>

              {/* Chat Toggle */}
              <button 
                onClick={() => setTab("messages")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  currentTab === "messages" ? "text-brand bg-brand/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* Mini Profile Info */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full border border-white/25 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setTab("user_profile")}
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-[9px] font-mono tracking-widest text-brand leading-none uppercase">
                    {currentUser.role} {currentUser.role === UserRole.TRAINER && currentUser.verified && "✓"}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                  title="Logout session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold tracking-wider uppercase px-4 py-2 rounded-xl cursor-pointer shadow-lg shadow-brand/30 transition-all active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>

      {/* Mobile Tab bar at bottom (Only rendered on smaller widths) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/95 backdrop-blur-md px-2 py-1 pb-safe">
        <div className="grid grid-cols-5 gap-1 text-center">
          {mainNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="relative flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors cursor-pointer select-none"
                style={{ color: isActive ? "#ff0033" : "#6b7280" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveIndicator"
                    className="absolute inset-x-4 top-0 h-0.5 bg-brand shadow-sm shadow-brand/50"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <IconComponent className="h-5 w-5" />
                </motion.div>
                <span className="text-[9px] font-bold mt-0.5 max-w-full truncate">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------
          STATEFUL SPOTLIGHT SEARCH MODAL OVERLAY
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 md:p-20 flex items-start justify-center">
            
            {/* Click outside to close */}
            <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />

            {/* Main spotlight container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onKeyDown={handleModalKeyDown}
              className="relative w-full max-w-5xl bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[580px] z-10"
            >
              
              {/* Search bar header */}
              <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-5 py-4">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-brand" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search over trainers, articles, recipes, biomechanical posts..."
                    className="w-full bg-transparent border-none text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-0 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white/5 rounded border border-white/10 uppercase">
                    ESC
                  </kbd>
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filtering Sub-Header */}
              <div className="flex items-center justify-between border-b border-white/5 bg-[#121212] px-5 py-2.5">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                  <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  {(["all", "trainers", "posts", "discussions"] as const).map((filter) => {
                    const active = searchFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => setSearchFilter(filter)}
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg border transition-all cursor-pointer shrink-0 ${
                          active 
                            ? "bg-brand text-white border-brand" 
                            : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">
                  Matches: <span className="text-white font-bold">{searchResults.length}</span>
                </span>
              </div>

              {/* Main content body (Two-column layout on desktop) */}
              <div className="flex-1 flex overflow-hidden min-h-0 relative">
                
                {/* Left pane: Results List */}
                <div className="w-full md:w-1/2 overflow-y-auto divide-y divide-white/5 border-r border-white/5 p-2">
                  {searchResults.length === 0 ? (
                    <div className="p-12 text-center space-y-4">
                      <AlertCircle className="w-8 h-8 text-gray-600 mx-auto" />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">No Records Found</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                          {searchQuery 
                            ? `Could not locate logs matching "${searchQuery}". Attempt querying keywords like "Alex", "Lat", "Squat", or "Spine".`
                            : "Start typing to look up verified coaches, master tutorials, and trainee discussion threads."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    searchResults.map((result, idx) => {
                      const isActive = activeIndex === idx;
                      return (
                        <div
                          key={`${result.type}-${result.id}`}
                          onMouseEnter={() => {
                            setActiveIndex(idx);
                            setMobileDetailOpen(false);
                          }}
                          onClick={() => {
                            setActiveIndex(idx);
                            setMobileDetailOpen(true);
                          }}
                          className={`p-3.5 rounded-xl transition-all flex items-start gap-3.5 cursor-pointer text-left ${
                            isActive 
                              ? "bg-brand/10 border border-brand/25" 
                              : "border border-transparent hover:bg-white/5"
                          }`}
                        >
                          {/* Visual Icon Badge */}
                          <div className={`p-2 rounded-xl shrink-0 ${
                            result.type === "trainer" 
                              ? "bg-brand/10 text-brand" 
                              : result.type === "post"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}>
                            {result.type === "trainer" ? (
                              <User className="w-4 h-4" />
                            ) : result.type === "post" ? (
                              <BookOpen className="w-4 h-4" />
                            ) : (
                              <MessageCircle className="w-4 h-4" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                                result.type === "trainer"
                                  ? "bg-brand/20 text-brand"
                                  : result.type === "post"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-emerald-500/20 text-emerald-400"
                              }`}>
                                {result.type}
                              </span>
                              <span className="text-[9px] font-mono text-gray-500 truncate">{result.subtitle.split("•")[1] || result.subtitle}</span>
                            </div>
                            <h4 className="text-xs font-bold text-white mt-1.5 leading-snug truncate">{result.title}</h4>
                            <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-normal italic">{result.body}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right/Overlay Pane: Detail View */}
                {/* Desktop: persistent split panel | Mobile: absolute slide-over panel */}
                <div className={`w-full md:w-1/2 overflow-y-auto p-6 bg-black/40 text-left md:block ${
                  mobileDetailOpen ? "absolute inset-0 bg-[#0d0d0d] z-20 block" : "hidden"
                }`}>
                  
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setMobileDetailOpen(false)}
                    className="md:hidden flex items-center gap-1.5 text-xs text-brand font-mono uppercase font-black tracking-widest mb-4 cursor-pointer"
                  >
                    ← Back to List
                  </button>

                  {selectedResult ? (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      
                      {/* TRAINER PREVIEW SHEET */}
                      {selectedResult.type === "trainer" && (() => {
                        const t = selectedResult.original as TrainerProfile;
                        const isSub = currentUser?.subscriptions.includes(t.id);
                        return (
                          <div className="space-y-5 text-left">
                            <div className="flex items-start gap-4">
                              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
                              <div className="space-y-1">
                                <h3 className="text-base font-black text-white flex items-center gap-1.5 leading-snug">
                                  {t.name}
                                  {t.verified && <ShieldCheck className="w-4.5 h-4.5 text-brand" />}
                                </h3>
                                <p className="text-xs font-mono text-brand font-bold uppercase">{t.specialty}</p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-mono">
                                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                    <Star className="w-3 h-3 fill-amber-500" />
                                    {t.rating}
                                  </span>
                                  <span>•</span>
                                  <span>{t.subscribersCount} Subscribed</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                              <span className="text-[9px] font-mono uppercase text-gray-500 font-black tracking-wider block">Bio & Philosophy</span>
                              <p className="text-xs text-gray-300 leading-relaxed italic">"{t.bio}"</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                                <span className="text-[9px] font-mono text-gray-500 block uppercase font-bold">Locker Rate</span>
                                <span className="text-sm font-mono font-black text-white block mt-1">${t.monthlyPrice} <span className="text-[9px] font-medium text-gray-400">/ mo</span></span>
                              </div>
                              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                                <span className="text-[9px] font-mono text-gray-500 block uppercase font-bold">Nationality</span>
                                <span className="text-xs text-white font-medium block mt-1.5">{t.country}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[9px] font-mono uppercase text-gray-500 font-black tracking-wider block">Coaching Credentials</span>
                              <div className="space-y-1.5">
                                {t.certificates.map((cert, index) => (
                                  <div key={index} className="flex justify-between items-center text-[11px] bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                    <span className="text-gray-300 font-medium truncate max-w-[200px]">{cert.name}</span>
                                    <span className="text-[9px] font-mono text-brand font-bold shrink-0">{cert.date}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 space-y-2">
                              <button
                                onClick={() => handleNavigateFromSearch("coaching")}
                                className="w-full bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand/10"
                              >
                                <Award className="w-4 h-4" />
                                Initiate Biomechanical Question
                              </button>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleNavigateFromSearch("messages")}
                                  className="bg-white/5 hover:bg-white/10 text-white border border-white/5 text-xs font-mono py-2 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" /> Direct Chat
                                </button>
                                <button
                                  onClick={() => {
                                    setIsSearchOpen(false);
                                    onSelectTrainerProfile?.(t.id);
                                  }}
                                  className="bg-white/5 hover:bg-white/10 text-white border border-white/5 text-xs font-mono py-2 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                >
                                  <Home className="w-3.5 h-3.5" /> View Locker
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* ARTICLE POST PREVIEW SHEET */}
                      {selectedResult.type === "post" && (() => {
                        const p = selectedResult.original as Post;
                        return (
                          <div className="space-y-4 text-left">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                              <img src={p.trainerAvatar} alt={p.trainerName} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <h4 className="text-xs font-bold text-white">{p.trainerName}</h4>
                                <span className="text-[9px] font-mono text-brand font-bold uppercase tracking-wide">Elite Specialist</span>
                              </div>
                            </div>

                            <h3 className="text-base font-black text-white leading-snug">{p.title}</h3>
                            
                            <p className="text-xs text-gray-300 leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
                              "{p.content}"
                            </p>

                            {p.mediaUrls && p.mediaUrls.length > 0 && (
                              <img 
                                src={p.mediaUrls[0]} 
                                alt={p.title} 
                                className="w-full h-44 object-cover rounded-xl border border-white/10" 
                              />
                            )}

                            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 bg-black/40 p-3 rounded-xl border border-white/5">
                              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-brand" /> {p.likesCount} Stars</span>
                              <span>•</span>
                              <span>{p.comments.length} Comments</span>
                              <span>•</span>
                              <span className="uppercase text-brand font-bold">{p.type} locker</span>
                            </div>

                            {p.comments.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-[9px] font-mono uppercase text-gray-500 font-bold tracking-wider block">Featured Comment</span>
                                <div className="p-3 bg-black/50 border border-white/5 rounded-xl space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-white">{p.comments[0].userName}</span>
                                    <span className="text-[8px] font-mono text-gray-500">Verified</span>
                                  </div>
                                  <p className="text-[11px] text-gray-400 italic">"{p.comments[0].text}"</p>
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => handleNavigateFromSearch("feed")}
                              className="mt-3 w-full bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
                            >
                              <Home className="w-4 h-4" />
                              View & Discuss in Global Feed
                            </button>
                          </div>
                        );
                      })()}

                      {/* DISCUSSION THREAD PREVIEW SHEET */}
                      {selectedResult.type === "community" && (() => {
                        const c = selectedResult.original as CommunityPost;
                        return (
                          <div className="space-y-4 text-left">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                              <img src={c.userAvatar} alt={c.userName} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <h4 className="text-xs font-bold text-white">{c.userName}</h4>
                                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wide">Community Athlete</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-black ${
                                c.type === "question" 
                                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                                  : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              }`}>
                                {c.type}
                              </span>
                              <span className="text-[9px] font-mono text-gray-500">Thread log #{c.id}</span>
                            </div>

                            <h3 className="text-base font-black text-white leading-snug">{c.title}</h3>
                            
                            <p className="text-xs text-gray-300 leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
                              "{c.content}"
                            </p>

                            {c.mediaUrl && (
                              <img 
                                src={c.mediaUrl} 
                                alt={c.title} 
                                className="w-full h-44 object-cover rounded-xl border border-white/10" 
                              />
                            )}

                            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 bg-black/40 p-3 rounded-xl border border-white/5">
                              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-brand" /> {c.likesCount} Votes</span>
                              <span>•</span>
                              <span>{c.comments.length} Comments</span>
                            </div>

                            {c.comments.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-[9px] font-mono uppercase text-gray-500 font-bold tracking-wider block">Verified Reply</span>
                                <div className="p-3 bg-black/50 border border-white/5 rounded-xl space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-white">{c.comments[0].userName}</span>
                                    <span className="text-[8px] font-mono text-gray-400">Coach Feedback</span>
                                  </div>
                                  <p className="text-[11px] text-gray-300 italic">"{c.comments[0].text}"</p>
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => handleNavigateFromSearch("community")}
                              className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              View Thread in Discussion Hub
                            </button>
                          </div>
                        );
                      })()}

                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                      <Sparkles className="w-8 h-8 text-gray-600 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold">Select a Result</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                          Hover or arrow-key through any listing on the left to instantly review details without exiting the portal.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Spotlight footer keyboard hint */}
              <div className="bg-black/80 border-t border-white/5 px-5 py-3 flex items-center justify-between text-[10px] font-mono text-gray-500 shrink-0">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">↓↑</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">Enter</kbd> Preview Details
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white/5 rounded border border-white/10">Esc</kbd> Close Search
                  </span>
                </div>
                <span className="text-brand hidden sm:inline">LEER Database Console v1.0.4</span>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
}
