"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Target,
  Save,
  Shield,
  DollarSign,
  Users,
  TrendingUp,
  Check,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";

interface TeamMember {
  _id: string;
  name: string;
  email?: string;
  role: string;
  avatar: string;
  delivered: number;
  completedCount: number;
  target: number;
  preferences?: {
    monthlyTarget: number;
  };
}

export default function RevenueTargetsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = ((session?.user as any)?.role) || "member";
  const isAdmin = userRole === "admin";

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editedTargets, setEditedTargets] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);

  useEffect(() => {
    if (session && !isAdmin) {
      router.push("/");
      toast.error("Admin access only");
    }
  }, [session, isAdmin, router]);

  const { data: teamPerformanceData, isLoading: loading } = useTeamPerformance();

  useEffect(() => {
    if (teamPerformanceData && Array.isArray(teamPerformanceData)) {
      setMembers(teamPerformanceData);
      const targets: Record<string, number> = {};
      teamPerformanceData.forEach((m: TeamMember) => {
        targets[m._id] = m.target || 1100;
      });
      setEditedTargets(targets);
    }
  }, [teamPerformanceData]);

  const handleSaveOne = async (memberId: string) => {
    setSavingId(memberId);
    try {
      const res = await fetch(`/api/users/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            ...members.find((m) => m._id === memberId)?.preferences,
            monthlyTarget: editedTargets[memberId],
          },
        }),
      });
      if (res.ok) {
        toast.success("Target updated");
        setMembers((prev) =>
          prev.map((m) =>
            m._id === memberId
              ? { ...m, preferences: { ...m.preferences, monthlyTarget: editedTargets[memberId] } }
              : m
          )
        );
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSavingId(null);
    }
  };

  const handleApplyToAll = async (targetValue: number) => {
    setSavingAll(true);
    let successCount = 0;
    for (const member of members) {
      try {
        const res = await fetch(`/api/users/${member._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preferences: {
              ...member.preferences,
              monthlyTarget: targetValue,
            },
          }),
        });
        if (res.ok) successCount++;
      } catch {
        // continue
      }
    }
    const updatedTargets: Record<string, number> = {};
    const updatedMembers = members.map((m) => {
      updatedTargets[m._id] = targetValue;
      return { ...m, preferences: { ...m.preferences, monthlyTarget: targetValue } };
    });
    setMembers(updatedMembers);
    setEditedTargets(updatedTargets);
    toast.success(`Updated ${successCount} of ${members.length} members`);
    setSavingAll(false);
  };

  const totalTarget = Object.values(editedTargets).reduce((sum, v) => sum + v, 0);
  const totalEarnings = members.reduce((sum, m) => sum + (m.delivered || 0), 0);

  const roleColors: Record<string, string> = {
    admin: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    moderator: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    member: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-foreground transition-colors duration-300">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse-slow pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
          <DashboardHeader />
          
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6 pb-20">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-primary/10 text-primary border border-primary/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
                  Admin Control
                </Badge>
                <Badge className="bg-accent/10 text-accent border border-accent/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
                  <Shield className="w-3 h-3 mr-1" /> Protected
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em]">
                Revenue Targets Board
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base font-medium">
                Set monthly revenue goals for each team member
              </p>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Card className="glass-card overflow-hidden group rounded-3xl border border-border/60 p-5 text-left">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 w-fit mb-3 border border-primary/20">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mb-1">
                    Team Target
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-primary truncate">
                    ${totalTarget.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground/45 mt-1 font-medium">per month combined</p>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass-card overflow-hidden group rounded-3xl border border-border/60 p-5 text-left">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-accent/10 w-fit mb-3 border border-accent/20">
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mb-1">
                    Total Earnings
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-accent truncate">
                    ${totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground/45 mt-1 font-medium">all-time revenue</p>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="col-span-2 lg:col-span-1">
                <Card className="glass-card overflow-hidden group rounded-3xl border border-border/60 p-5 text-left">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-teal-500/10 w-fit mb-3 border border-teal-500/20">
                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mb-1">
                    Team Size
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400 truncate">
                    {members.length}
                  </p>
                  <p className="text-[10px] text-muted-foreground/45 mt-1 font-medium">active members</p>
                </Card>
              </motion.div>
            </div>

            {/* Apply same target to all */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-card rounded-3xl border border-border/60 overflow-hidden text-left p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground">Apply Same Target to All</p>
                    <p className="text-xs text-muted-foreground/60 font-medium mt-0.5">
                      Set one target for the entire team at once
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                      <Input
                        id="bulk-target"
                        type="number"
                        defaultValue={10000}
                        className="bg-background border border-border rounded-xl h-10 pl-8 w-full sm:w-36 text-foreground font-mono focus-visible:ring-primary"
                      />
                    </div>
                    <Button
                      disabled={savingAll}
                      onClick={() => {
                        const input = document.getElementById("bulk-target") as HTMLInputElement;
                        const value = Number(input?.value || 10000);
                        handleApplyToAll(value);
                      }}
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-bold rounded-xl h-10 px-5 shrink-0 border-none cursor-pointer shadow-md shadow-primary/10"
                    >
                      {savingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Member Targets List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="glass-card rounded-3xl border border-border/60 overflow-hidden text-left">
                <CardHeader className="pb-3 flex flex-row items-center space-x-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-foreground">Individual Targets</CardTitle>
                    <p className="text-[10px] text-muted-foreground/60 font-medium">
                      Set a specific monthly target for each member
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5 p-3 sm:p-6 pt-0 sm:pt-0">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-10 h-10 text-muted-foreground/35 mx-auto mb-3" />
                      <p className="text-muted-foreground/60 font-bold">No team members found</p>
                    </div>
                  ) : (
                    members.map((member, i) => {
                      const currentTarget = editedTargets[member._id] || 0;
                      const originalTarget = member.target || 1100;
                      const hasChanged = currentTarget !== originalTarget;
                      const progress = originalTarget > 0
                        ? Math.min(100, (member.delivered / originalTarget) * 100)
                        : 0;

                      return (
                        <motion.div
                          key={member._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.02 * i }}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-secondary/35 border border-border/60 hover:bg-secondary/50 transition-all text-left"
                        >
                          {/* Avatar + Info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-primary font-black text-sm border border-border/60 shrink-0 overflow-hidden relative shadow-sm">
                              {member.avatar ? (
                                <Image src={member.avatar} alt={member.name} fill className="object-cover" sizes="40px" />
                              ) : (
                                member.name?.charAt(0).toUpperCase() || "?"
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-sm text-foreground/80 truncate tracking-tight">{member.name}</p>
                                <Badge
                                  variant="outline"
                                  className={`${roleColors[member.role] || ""} font-black text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full`}
                                >
                                  {member.role}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 mt-1 font-semibold">
                                <span className="text-[10px] text-muted-foreground/60 truncate">{member.email}</span>
                                <span className="text-[10px] text-primary/80 font-bold hidden sm:inline">
                                  {member.completedCount} projects
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full sm:w-28 shrink-0 hidden md:block text-center space-y-1">
                            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-[9px] text-muted-foreground/45 font-bold font-mono">
                              {progress.toFixed(0)}% reached
                            </p>
                          </div>

                          {/* Target Input + Save */}
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/45" />
                              <Input
                                type="number"
                                value={currentTarget}
                                onChange={(e) =>
                                  setEditedTargets({
                                    ...editedTargets,
                                    [member._id]: Number(e.target.value),
                                  })
                                }
                                className="bg-background border border-border text-foreground font-mono rounded-xl h-10 pl-8 w-full sm:w-28 text-xs sm:text-sm font-bold focus-visible:ring-primary"
                              />
                            </div>
                            <Button
                              size="sm"
                              disabled={!hasChanged || savingId === member._id}
                              onClick={() => handleSaveOne(member._id)}
                              className={`rounded-xl h-10 px-3 font-bold shrink-0 transition-all cursor-pointer border-none ${
                                hasChanged
                                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/10"
                                  : "bg-secondary text-muted-foreground/30 cursor-not-allowed"
                              }`}
                            >
                              {savingId === member._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : hasChanged ? (
                                <Save className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
