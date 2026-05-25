"use client";

import { useState, useEffect } from "react";
import { Search, Bell, CheckCircle2, AlertCircle, TrendingUp, LogOut, User, Mail, Key, Menu, Globe } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useSidebar } from "./DashboardSidebar";

import Image from "next/image";
import { useNotifications } from "@/hooks/useNotifications";

export function DashboardHeader() {
  const { data: session, update } = useSession();
  const { setMobileOpen } = useSidebar();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [hasSynced, setHasSynced] = useState(false);

  // Sync session if avatar is missing or stale [session-sync-effect]
  useEffect(() => {
    if (session?.user?.id && !session.user.avatar && !hasSynced) {
      setHasSynced(true);
      const syncSession = async () => {
        try {
          const res = await fetch(`/api/users/${session.user.id}`);
          const json = await res.json();
          if (json.success && json.data.user.avatar) {
            update({
              user: {
                ...session.user,
                avatar: json.data.user.avatar,
                name: json.data.user.name,
              }
            });
          }
        } catch (err) {
          console.warn("Session sync failed:", err);
        }
      };
      syncSession();
    }
  }, [session?.user?.id, session?.user?.avatar, update, hasSynced]);

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <header className="h-14 sm:h-16 border-b border-border/40 bg-background/60 backdrop-blur-2xl sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 text-foreground">
        {/* Left side: hamburger + search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Mobile hamburger — inside header */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-secondary/60 transition-colors md:hidden shrink-0 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Search bar trigger */}
          <button
            onClick={openCommandPalette}
            className="group flex-1 max-w-xs sm:max-w-sm md:max-w-md hidden sm:flex items-center gap-3 px-3 sm:px-4 h-9 sm:h-10 bg-secondary/35 hover:bg-secondary border border-border/80 hover:border-primary/40 rounded-xl transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground/50 group-hover:text-muted-foreground flex-1 text-left">Search dashboard...</span>
            <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/40 bg-secondary/50 text-[9px] font-black text-muted-foreground/50">
              <span className="text-[10px]">⌘</span>K
            </div>
          </button>

          {/* Mobile search icon */}
          <button
            onClick={openCommandPalette}
            className="p-2 rounded-xl hover:bg-secondary transition-colors sm:hidden shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4 text-muted-foreground/60" />
          </button>
        </div>

        {/* Right side: status + bell + profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
          {/* Live indicator — desktop only */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
              Live
            </span>
          </div>

          {/* Theme Toggle */}


          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="p-2 rounded-xl hover:bg-secondary/80 relative border border-border/60 transition-all active:scale-95 group outline-none cursor-pointer" />}>
                <Bell className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] sm:w-[320px] md:w-[380px] bg-card border border-border/80 p-0 overflow-hidden text-foreground shadow-2xl rounded-2xl">
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border/40">
                <span className="font-bold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAsRead.mutate({ markAll: true })}
                    className="text-[10px] uppercase font-black text-primary hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[260px] sm:max-h-[300px] overflow-y-auto divide-y divide-border/40">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground/40 text-xs font-bold">No new notifications</div>
                ) : (
                  notifications.slice(0, 4).map((notif: any) => (
                    <div 
                      key={notif._id} 
                      onClick={() => {
                        if (!notif.read) markAsRead.mutate({ id: notif._id });
                      }}
                      className={`p-3 sm:p-4 hover:bg-secondary/35 transition-colors flex gap-3 cursor-pointer text-left ${!notif.read ? 'bg-secondary/15' : ''}`}
                    >
                      <div className="shrink-0 mt-0.5 relative">
                        {!notif.read && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />}
                        {notif.type === "payment" ? (
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        ) : notif.type === "order" ? (
                          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs truncate ${!notif.read ? 'font-black text-foreground' : 'font-semibold text-muted-foreground'}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground/75 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[9px] text-muted-foreground/45 mt-1 font-bold font-mono">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/notifications">
                <div className="p-3 text-center text-xs font-black text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer border-t border-border/40">
                  View All Notifications
                </div>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-5 sm:h-6 w-px bg-border/40 hidden sm:block" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group p-1 md:pr-3 rounded-xl hover:bg-secondary transition-all outline-none border border-transparent" />}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform shrink-0 overflow-hidden relative">
                  {session?.user?.avatar ? (
                    <Image src={session.user.avatar} alt={session.user.name || "User"} fill className="object-cover" sizes="40px" />
                  ) : (
                    session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "F"
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-black leading-tight tracking-tight text-foreground/80">
                    {session?.user?.name || "Loading..."}
                  </p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-[0.25em] font-black">
                    {((session?.user as unknown) as { role?: string })?.role || "user"}
                  </p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px] sm:w-[240px] bg-card border border-border/80 p-2 text-foreground shadow-2xl rounded-2xl">
              <div className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-lg shadow-lg shrink-0 overflow-hidden relative">
                  {session?.user?.avatar ? (
                    <Image src={session.user.avatar} alt={session.user.name || "User"} fill className="object-cover" sizes="40px" />
                  ) : (
                    session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "F"
                  )}
                </div>
                <div className="min-w-0 text-left">
                  <p className="font-bold text-sm leading-none truncate">{session?.user?.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider text-primary border-primary/30 px-1.5 py-0 bg-primary/10">
                      Pro
                    </Badge>
                    <span className="text-[10px] text-muted-foreground capitalize">{((session?.user as unknown) as { role?: string })?.role || "user"}</span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border/40 my-1" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary focus:bg-secondary focus:text-foreground transition-all flex items-center" render={<Link href="/" />}>
                    <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                    Home
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary focus:bg-secondary focus:text-foreground transition-all flex items-center" render={<Link href="/profile" />}>
                    <User className="w-4 h-4 mr-3 text-muted-foreground" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary focus:bg-secondary focus:text-foreground transition-all flex items-center" render={<Link href="/notifications" />}>
                    <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                    Inbox
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary focus:bg-secondary focus:text-foreground transition-all flex items-center" render={<Link href="/settings" />}>
                    <Key className="w-4 h-4 mr-3 text-muted-foreground" />
                    Change Password
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/40 my-1" />
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="py-2.5 px-3 cursor-pointer hover:bg-rose-500/10 focus:bg-rose-500/10 text-rose-500 rounded-lg text-xs font-bold transition-all flex items-center"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
