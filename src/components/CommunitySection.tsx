/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  HelpCircle, Trophy, MessageSquare, Heart, Plus, Globe, 
  Sparkles, CheckCircle, AlertCircle, Share2, Flame, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CommunityPost, Comment, UserRole } from "../types";

interface CommunitySectionProps {
  communityPosts: CommunityPost[];
  currentUser: { id: string; name: string; email: string; role: UserRole; avatar: string } | null;
  onLikeCommunityPost: (postId: string) => void;
  onAddCommunityPost: (newPost: Omit<CommunityPost, "id" | "userId" | "userName" | "userAvatar" | "userRole" | "likesCount" | "comments" | "date" | "translations">) => void;
  onAddCommunityComment: (postId: string, text: string) => void;
}

export default function CommunitySection({
  communityPosts,
  currentUser,
  onLikeCommunityPost,
  onAddCommunityPost,
  onAddCommunityComment,
}: CommunitySectionProps) {
  
  const [activeCategory, setActiveCategory] = useState<"all" | "question" | "flex" | "achievement" | "discussion">("all");
  const [isCreating, setIsCreating] = useState(false);
  
  // New Post State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"question" | "flex" | "achievement" | "discussion">("discussion");
  const [mediaUrl, setMediaUrl] = useState("");
  const [success, setSuccess] = useState("");

  // Comment state
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // Translation state
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [targetLanguages, setTargetLanguages] = useState<Record<string, string>>({});

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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddCommunityPost({
      title,
      content,
      type,
      mediaUrl: mediaUrl || undefined,
      originalLanguage: "English",
    });

    setTitle("");
    setContent("");
    setMediaUrl("");
    setIsCreating(false);
    setSuccess("Community post shared successfully with the locker room!");
    setTimeout(() => setSuccess(""), 4000);
  };

  const handlePostComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddCommunityComment(postId, commentText);
    setCommentText("");
    setActiveCommentId(null);
  };

  const getCategoryColor = (postType: string) => {
    switch (postType) {
      case "question": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "flex": return "bg-brand/10 text-brand border-brand/20";
      case "achievement": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  // Filter based on selected category
  const filteredPosts = communityPosts.filter(p => activeCategory === "all" || p.type === activeCategory);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Community Discussion Hub</h1>
          <p className="text-xs text-gray-400">Where Trainees connect, ask questions, share achievements, and discuss progression.</p>
        </div>

        {currentUser && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-brand/20 transition-all self-start md:self-center"
          >
            {isCreating ? "[Close form]" : "+ Share Post"}
          </button>
        )}
      </div>

      {success && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs mb-6 text-left">
          {success}
        </div>
      )}

      {/* Categories picker */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-luxury-gray border border-white/5 rounded-xl text-left mb-8 max-w-xl relative">
        {(["all", "question", "flex", "achievement", "discussion"] as const).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer select-none"
              style={{ color: isActive ? "#ffffff" : "#9ca3af" }}
            >
              {isActive && (
                <motion.div
                  layoutId="communityActiveCategory"
                  className="absolute inset-0 bg-brand rounded-lg shadow-md shadow-brand/20 z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}s</span>
            </button>
          );
        })}
      </div>

      {/* CREATE COMMUNITY POST FORMS */}
      {isCreating && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl glass-panel text-left space-y-4 mb-8 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-brand" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-white">Locker room submission</h3>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Discussion Category</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                >
                  <option value="discussion">Discussion / General</option>
                  <option value="question">Question (Trainee Assistance)</option>
                  <option value="flex">Flex (Physique progress)</option>
                  <option value="achievement">Milestone Achievement</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Visual Image Link (Optional)</label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Unsplash absolute URL"
                  className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Topic Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tips on recovering from quad tendon soreness"
                className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">Post Content Body</label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience, questions, or metrics with other trainees..."
                className="w-full bg-luxury-gray border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-brand transition-colors leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all"
            >
              Broadcast to Hub
            </button>
          </form>
        </div>
      )}

      {/* FEED ITEMS LIST */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-luxury-gray">
            <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs font-mono">No community records here yet.</p>
            <p className="text-[10px] text-gray-600 mt-1">Be the first to share your thoughts by clicking Share Post.</p>
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
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {filteredPosts.map((post) => {
            const originalText = post.content;
            const translatedText = translatedTexts[post.id];
            const selectedTargetLang = targetLanguages[post.id] || "Spanish";

            return (
              <motion.div 
                key={post.id} 
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
                }}
                className="p-6 rounded-2xl glass-panel text-left space-y-4 hover:border-brand/30 transition-colors"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={post.userAvatar} alt={post.userName} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                    <div>
                      <h4 className="text-xs font-bold text-white hover:underline cursor-pointer">{post.userName}</h4>
                      <p className="text-[9px] font-mono text-gray-500">{post.date.split("T")[0]} • {post.userRole}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-black tracking-wide border ${getCategoryColor(post.type)}`}>
                    {post.type}
                  </span>
                </div>

                {/* Body Content */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-white leading-snug">{post.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {translatedText ? translatedText : originalText}
                  </p>

                  {/* original text back button */}
                  {translatedText && (
                    <button
                      onClick={() => setTranslatedTexts((prev) => {
                        const copy = { ...prev };
                        delete copy[post.id];
                        return copy;
                      })}
                      className="text-[9px] font-mono text-brand hover:underline block uppercase tracking-wider"
                    >
                      ← Show original ({post.originalLanguage})
                    </button>
                  )}

                  {post.mediaUrl && (
                    <img src={post.mediaUrl} alt={post.title} className="w-full max-h-80 object-cover rounded-xl mt-3 filter grayscale hover:grayscale-0 transition-all duration-300" />
                  )}
                </div>

                {/* Interaction Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-gray-500">
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => onLikeCommunityPost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${post.isLiked ? "text-brand" : "hover:text-white"}`}
                    >
                      <Heart className="w-4 h-4" fill={post.isLiked ? "#ff0033" : "none"} />
                      {post.likesCount}
                    </button>

                    <button
                      onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-mono hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {post.comments.length}
                    </button>
                  </div>

                  {/* translation tool */}
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

                {/* Comments box */}
                {activeCommentId === post.id && (
                  <div className="space-y-3 pt-3 border-t border-white/5 animate-in slide-in-from-top-1">
                    <div className="max-y-36 overflow-y-auto space-y-2.5 max-h-40 pr-2">
                      {post.comments.length === 0 ? (
                        <p className="text-[10px] text-gray-600 italic">No community comments. Write something!</p>
                      ) : (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="text-xs bg-white/5 p-2 rounded-xl flex items-start gap-2 text-left">
                            <img src={comment.userAvatar} alt={comment.userName} className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/10" />
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
                        placeholder="Join discussion..."
                        className="flex-1 bg-luxury-gray border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
                      />
                      <button
                        type="submit"
                        className="bg-brand text-white text-[10px] font-mono font-bold uppercase px-3.5 py-1.5 rounded-xl"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}

              </motion.div>
            );
          })}
          </motion.div>
        )}
      </div>

    </div>
  );
}
