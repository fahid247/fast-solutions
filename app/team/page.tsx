"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { useUsers, useUpdateUser, useDeleteUser } from "@/hooks/useUsers";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";
import Swal from "sweetalert2";

export default function TeamPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showPending, setShowPending] = useState(false);
  
  const isAdmin = session?.user?.role === "admin";

  const { data: members = [], isLoading: loadingUsers } = useUsers();
  const { data: performance = [], isLoading: loadingPerformance } = useTeamPerformance();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const loading = loadingUsers || loadingPerformance;

  const handleStatusUpdate = (userId: string, newStatus: string) => {
    updateMutation.mutate({ userId, data: { status: newStatus } });
  };

  const handleRoleUpdate = (userId: string, newRole: string) => {
    updateMutation.mutate({ userId, data: { role: newRole } });
  };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Remove Member?",
      text: "This action will permanently delete this member from the agency. This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Yes, remove them!",
      cancelButtonText: "Cancel",
      background: "var(--card)",
      color: "var(--foreground)",
      customClass: {
        popup: "border border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl",
        title: "font-black tracking-tight text-foreground",
        htmlContainer: "text-muted-foreground font-medium",
        confirmButton: "rounded-xl font-bold px-6",
        cancelButton: "rounded-xl font-bold px-6",
      },
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(deleteMutation.mutateAsync(userId), {
          loading: "Removing member...",
          success: "Member removed successfully",
          error: "Failed to remove member",
        });
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const activeMembers = (Array.isArray(members) ? members : [])
    .filter((m) => m.status === "active" && m.role !== "client")
    .map((member) => {
      const perf = Array.isArray(performance) ? performance.find((p: any) => p._id === member._id) : null;
      return {
        ...member,
        performance_score: perf ? Math.round(perf.efficiencyScore || perf.totalActive / 10) : 0,
        total_earnings: perf ? perf.totalActive : 0,
        projects_completed: perf ? perf.projectCount : 0
      };
    });
    
  const pendingMembers = (Array.isArray(members) ? members : []).filter((m) => m.status === "pending" && m.role !== "client");

  const roleColors: Record<string, string> = {
    admin: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    moderator: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    member: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-foreground transition-colors duration-300">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse-slow pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

          <DashboardHeader />
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-6 pb-20">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
                Team Roster
              </Badge>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em] text-foreground">
                    Fast Solutions Crew
                  </h1>
                  <p className="text-muted-foreground mt-1 font-medium text-sm">
                    {activeMembers.length} active members • {pendingMembers.length} awaiting clearance
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {isAdmin && pendingMembers.length > 0 && (
                    <Button
                      variant="outline"
                      className={`rounded-xl border-border/60 font-bold text-xs h-10 ${
                        showPending
                          ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(234,88,12,0.1)]"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setShowPending(!showPending)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Pending Requests ({pendingMembers.length})
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Pending Approval Queue */}
            {isAdmin && (
              <AnimatePresence>
                {showPending && pendingMembers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Card className="border-primary/20 bg-primary/[0.03] rounded-3xl p-6 mb-6">
                      <CardHeader className="p-0 pb-4">
                        <CardTitle className="text-base font-black flex items-center space-x-2 text-foreground">
                          <Shield className="w-4 h-4 text-primary" />
                          <span>Awaiting Admin Clearance</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-3">
                        {pendingMembers.map((member) => (
                          <div
                            key={member._id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 shadow-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10 rounded-xl border border-border/80">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-black">
                                  {member.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-sm text-foreground">
                                  {member.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-semibold font-mono mt-0.5">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-bold rounded-xl h-9 text-xs border-none px-4 shadow-md"
                                onClick={() =>
                                  handleStatusUpdate(member._id, "active")
                                }
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive/20 text-destructive hover:bg-destructive/10 font-bold rounded-xl h-9 text-xs px-4"
                                onClick={() => handleDelete(member._id)}
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="glass-card rounded-3xl p-6 h-64 space-y-4 border border-border/60">
                      <div className="flex justify-between items-start">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-12 rounded-md" />
                        <Skeleton className="h-4 w-12 rounded-md" />
                      </div>
                      <div className="pt-4 border-t border-border/40 grid grid-cols-3 gap-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </Card>
                  ))
                : activeMembers.length === 0
                ? (
                  <div className="col-span-full py-20 text-center glass-card rounded-3xl border border-border/60">
                    <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground font-bold">
                      No active team members yet.
                    </p>
                  </div>
                )
                : activeMembers.map((member: any, index: number) => (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group overflow-hidden relative h-full flex flex-col rounded-3xl">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                        
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-5">
                            <Link href={`/team/${member._id}`}>
                              <Avatar className="w-16 h-16 rounded-2xl border border-border hover:border-primary/35 transition-colors cursor-pointer shadow-sm">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary text-xl font-black">
                                  {member.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </Link>
                            {isAdmin && session?.user?.id !== member._id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-xl hover:bg-secondary border border-transparent hover:border-border opacity-0 group-hover:opacity-100 transition-all h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground">
                                  <MoreHorizontal className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-card border border-border/80 text-foreground rounded-xl">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleUpdate(member._id, "admin")
                                    }
                                    className="font-bold text-xs cursor-pointer hover:bg-secondary"
                                  >
                                    Make Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleUpdate(member._id, "moderator")
                                    }
                                    className="font-bold text-xs cursor-pointer hover:bg-secondary"
                                  >
                                    Make Moderator
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleUpdate(member._id, "member")
                                    }
                                    className="font-bold text-xs cursor-pointer hover:bg-secondary"
                                  >
                                    Make Member
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusUpdate(member._id, "suspended")
                                    }
                                    className="text-rose-500 focus:text-rose-500 font-bold text-xs cursor-pointer hover:bg-secondary"
                                  >
                                    Suspend
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(member._id)}
                                    className="text-rose-500 focus:text-rose-500 font-bold text-xs cursor-pointer hover:bg-secondary"
                                  >
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          <div className="space-y-4 flex-1 flex flex-col">
                            <div>
                              <Link href={`/team/${member._id}`}>
                                <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                                  {member.name}
                                </h3>
                              </Link>
                              <div className="flex items-center space-x-2 mt-1.5">
                                <Badge
                                  variant="outline"
                                  className={`${
                                    roleColors[member.role] || ""
                                  } font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full`}
                                >
                                  {member.role}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                              {member.skills && member.skills.length > 0 ? (
                                member.skills.slice(0, 3).map((skill: string) => (
                                  <span
                                    key={skill}
                                    className="text-[10px] font-bold text-muted-foreground/60 bg-secondary/50 px-2 py-0.5 rounded-md border border-border/40"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] font-bold text-muted-foreground/30 italic">No skills listed</span>
                              )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-border/40 grid grid-cols-3 gap-3 text-left">
                              <div>
                                <p className="text-[9px] text-muted-foreground/45 font-black uppercase tracking-wider">
                                  Score
                                </p>
                                <p className="text-sm font-black text-primary">
                                  {member.performance_score || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-[9px] text-muted-foreground/45 font-black uppercase tracking-wider">
                                  Earnings
                                </p>
                                <p className="text-sm font-black text-foreground/80">
                                  ${(member.total_earnings || 0).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-[9px] text-muted-foreground/45 font-black uppercase tracking-wider">
                                  Projects
                                </p>
                                <p className="text-sm font-black text-foreground/80">
                                  {member.projects_completed || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
