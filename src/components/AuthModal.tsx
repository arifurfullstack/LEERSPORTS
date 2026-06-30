/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Lock, Mail, User, Shield, Flame, CheckCircle, Chrome } from "lucide-react";
import { UserRole } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: string; name: string; email: string; role: UserRole; avatar: string; verified?: boolean }) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.TRAINEE);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Simulate standard authentications
    setTimeout(() => {
      setIsLoading(false);
      if (forgotPasswordMode) {
        setSuccessMessage(`Reset link dispatched to ${email}. Check your spam filter!`);
        return;
      }

      if (isLogin) {
        if (!email || !password) {
          setErrorMessage("Please supply a valid email and password.");
          return;
        }
        // Match mock profile for convenient testing
        let matchedRole = UserRole.TRAINEE;
        let finalName = email.split("@")[0];
        let avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop";
        let isTrainerVerified = true;

        if (email.includes("trainer") || email.includes("alex") || email.includes("elena") || email.includes("marcus")) {
          matchedRole = UserRole.TRAINER;
          finalName = email.includes("alex") ? "Coach Alexander" : email.includes("elena") ? "Elena Rostova" : "Dr. Marcus Vance";
          avatar = email.includes("alex") 
            ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=300&auto=format&fit=crop";
        } else if (email.includes("admin")) {
          matchedRole = UserRole.ADMIN;
          finalName = "System Moderator";
          avatar = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop";
        }

        onSuccess({
          id: `usr_${Math.random().toString(36).substr(2, 9)}`,
          name: finalName.charAt(0).toUpperCase() + finalName.slice(1),
          email,
          role: matchedRole,
          avatar,
          verified: isTrainerVerified,
        });
        onClose();
      } else {
        // Signup Flow
        if (!name || !email || !password) {
          setErrorMessage("All fields are mandatory to secure your account.");
          return;
        }
        setSuccessMessage("Account created! A confirmation link has been sent to your inbox.");
        setTimeout(() => {
          onSuccess({
            id: `usr_${Math.random().toString(36).substr(2, 9)}`,
            name,
            email,
            role,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
            verified: false, // Newly created trainers start as unverified
          });
          onClose();
        }, 1500);
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        id: "usr_google_123",
        name: "Google User",
        email: "greenwordpress.com@gmail.com",
        role: UserRole.TRAINEE,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl glass-panel-heavy border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-red-500 to-brand" />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-brand animate-pulse" />
              <span className="font-mono text-lg font-bold tracking-wider text-white">LEER <span className="text-brand font-black">SPORTS</span></span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {forgotPasswordMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-2">Recover Your Credentials</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Provide your email address below, and our server will dispatch a secure link to reset your key.
              </p>

              {successMessage && (
                <div className="p-3 text-xs bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 text-sm font-semibold uppercase tracking-wider font-mono cursor-pointer transition-all disabled:opacity-50"
              >
                {isLoading ? "Dispatching..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => setForgotPasswordMode(false)}
                className="block w-full text-center text-xs text-gray-400 hover:text-white mt-4 underline transition-colors"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-1">
                {isLogin ? "Welcome Back Athlete" : "Claim Your Fitness Locker"}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {isLogin 
                  ? "Access elite coaches, premium content lockers, and tracking tools." 
                  : "Begin your optimized progression journey today."}
              </p>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 text-xs bg-red-950/50 border border-red-500/30 rounded-lg text-red-400">
                  {errorMessage}
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="p-3 text-xs bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Registration Role Selector */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-2 p-1 bg-luxury-gray border border-white/5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.TRAINEE)}
                    className={`py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                      role === UserRole.TRAINEE ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Trainee Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.TRAINER)}
                    className={`py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                      role === UserRole.TRAINER ? "bg-brand text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Trainer Creator
                  </button>
                </div>
              )}

              {/* Form Input fields */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordMode(true)}
                      className="text-[10px] font-mono text-brand hover:underline"
                    >
                      FORGOT KEY?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-luxury-gray border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {/* Remember Me checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-luxury-gray text-brand focus:ring-0 focus:ring-offset-0 w-4 h-4"
                  />
                  <span className="text-xs text-gray-400">Remember session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl py-2.5 text-sm font-semibold uppercase tracking-wider font-mono cursor-pointer transition-all disabled:opacity-50 mt-2"
              >
                {isLoading ? "Authorizing..." : isLogin ? "LOGIN" : "CREATE LOCKER"}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0b0b0f] px-2 text-gray-500 font-mono">OR CONTINUE WITH</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-2.5 text-sm font-semibold font-mono cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Chrome className="w-4 h-4 text-white" />
                Google Authentication
              </button>

              {/* Dev notice footer */}
              <div className="p-2 bg-white/5 border border-white/5 rounded-lg text-[10px] text-gray-400 leading-normal text-center font-mono">
                💡 <span className="text-white">Tip:</span> Type <span className="text-brand">alex</span>, <span className="text-brand">elena</span>, or <span className="text-brand">marcus</span> in the email field for immediate simulated Trainer access, or <span className="text-brand">admin</span> for full Admin review dashboard!
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already verified? Sign in"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
