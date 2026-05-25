"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTeamPerformance } from "@/hooks/useTeamPerformance";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Star, Target, DollarSign, Package, CheckCircle2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

export default function MemberProfilePage() {
  const { id } = useParams();
  const { data, isLoading, refetch } = useTeamPerformance();
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const member = data?.find((m: any) => String(m._id) === String(id));

  useEffect(() => {
    if (!id) return;
    
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const res = await fetch(`/api/projects?developer=${id}`);
        const json = await res.json();
        if (json.success) {
          setProjects(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading || !data || data.length === 0) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-foreground overflow-hidden">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-[1600px] mx-auto space-y-6">
                <Skeleton className="h-32 w-full rounded-2xl bg-secondary/80" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Skeleton className="h-24 w-full rounded-2xl bg-secondary/80" />
                  <Skeleton className="h-24 w-full rounded-2xl bg-secondary/80" />
                  <Skeleton className="h-24 w-full rounded-2xl bg-secondary/80" />
                </div>
                <Skeleton className="h-64 w-full rounded-2xl bg-secondary/80" />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!member) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-foreground overflow-hidden">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground/60 text-lg font-bold">Member not found</p>
                <Link href="/team" className="text-primary hover:opacity-80 text-sm mt-2 inline-block font-black">
                  Back to Team
                </Link>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Mock data for chart (scaled to real delivered value)
  const chartData = [
    { month: "Jan", earnings: Math.round((member.delivered || 0) * 0.5) },
    { month: "Feb", earnings: Math.round((member.delivered || 0) * 0.7) },
    { month: "Mar", earnings: Math.round((member.delivered || 0) * 0.6) },
    { month: "Apr", earnings: Math.round((member.delivered || 0) * 0.9) },
    { month: "May", earnings: Math.round(member.delivered || 0) },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-foreground overflow-hidden transition-colors duration-300">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto space-y-6 pb-20">
              
              {/* Header / Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl border border-border/60 p-6 flex flex-col md:flex-row items-center gap-6"
              >
                <div className="relative">
                  <Avatar className="w-24 h-24 rounded-2xl border-2 border-border shadow-sm">
                    <AvatarImage src={member.avatar} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary text-3xl font-black">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {member.stars > 0 && (
                    <div className="absolute -top-2 -right-2 bg-primary rounded-lg p-1.5 shadow-lg">
                      <Crown className="w-4 h-4 text-white fill-current" />
                    </div>
                  )}
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
                    <h1 className="text-3xl font-black text-foreground tracking-tight">{member.name}</h1>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Badge className="bg-secondary text-muted-foreground border border-border/80 capitalize font-bold text-[10px]">
                        {member.role}
                      </Badge>
                      {member.stars > 0 && (
                        <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 font-bold text-[10px]">
                          <Star className="w-3 h-3 fill-current" /> {member.stars} Stars
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground/60 text-sm mt-1 font-medium">{member.email}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3 justify-center md:justify-start">
                    {member.skills?.map((skill: string) => (
                      <span key={skill} className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-muted-foreground/80 border border-border/60">
                        {skill}
                      </span>
                    )) || (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-muted-foreground/45 border border-border/60">
                        No skills listed
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => refetch()}
                    className="p-2.5 rounded-xl border border-border/60 hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-muted-foreground/60" />
                  </button>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-card border border-border/60 p-5 rounded-3xl text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Total Delivered</p>
                      <p className="text-2xl font-black text-foreground mt-1">${(member.delivered || 0).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
                
                <Card className="glass-card border border-border/60 p-5 rounded-3xl text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Work In Progress</p>
                      <p className="text-2xl font-black text-foreground mt-1">${(member.wip || 0).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20 shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
                
                <Card className="glass-card border border-border/60 p-5 rounded-3xl text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Completed</p>
                      <p className="text-2xl font-black text-foreground mt-1">{member.completedCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
                
                <Card className="glass-card border border-border/60 p-5 rounded-3xl text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Monthly Target</p>
                      <p className="text-2xl font-black text-foreground mt-1">${(member.preferences?.monthlyTarget || 1100).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <Card className="lg:col-span-2 glass-card border border-border/60 p-6 rounded-3xl">
                  <CardHeader className="px-0 pt-0 text-left">
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground/80">Earnings Performance</CardTitle>
                  </CardHeader>
                  <div className="h-[250px] mt-4">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                        <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                        <YAxis stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--foreground)' }}
                          labelStyle={{ fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="earnings" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                
                {/* Additional Info */}
                <Card className="glass-card border border-border/60 p-6 rounded-3xl">
                  <CardHeader className="px-0 pt-0 text-left">
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground/80">Member Status</CardTitle>
                  </CardHeader>
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-xs text-muted-foreground/60">Account Score</span>
                      <span className="text-sm font-bold text-foreground">{member.score || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-xs text-muted-foreground/60">Role</span>
                      <span className="text-sm font-bold text-foreground capitalize">{member.role}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Projects Section */}
              <Card className="glass-card border border-border/60 p-6 rounded-3xl">
                <CardHeader className="px-0 pt-0 flex flex-row justify-between items-center text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground/80">Assigned Projects</CardTitle>
                  <Badge className="bg-primary/10 text-primary border border-primary/20">{projects.length} Total</Badge>
                </CardHeader>
                
                {loadingProjects ? (
                  <div className="space-y-3 mt-4">
                    <Skeleton className="h-12 w-full bg-secondary/50" />
                    <Skeleton className="h-12 w-full bg-secondary/50" />
                    <Skeleton className="h-12 w-full bg-secondary/50" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground/30 text-sm font-bold">
                    No projects assigned to this member yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 border-b border-border/40">
                        <tr>
                          <th className="pb-3 px-2">Order ID</th>
                          <th className="pb-3 px-2">Client</th>
                          <th className="pb-3 px-2">Status</th>
                          <th className="pb-3 px-2">Value</th>
                          <th className="pb-3 px-2">Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-[13px]">
                        {projects.map((project) => (
                          <tr key={project._id} className="hover:bg-secondary/20 transition-colors">
                            <td className="py-3.5 px-2 font-mono text-xs text-foreground/80">{project.orderId}</td>
                            <td className="py-3.5 px-2 font-bold text-foreground/90">{project.clientName}</td>
                            <td className="py-3.5 px-2">
                              <Badge className={`text-[10px] uppercase tracking-wider ${
                                project.orderStatus === "Delivered" || project.orderStatus === "Completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                project.orderStatus === "WIP" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                project.orderStatus === "Revision" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                "bg-secondary text-muted-foreground/60 border border-border/40"
                              }`}>
                                {project.orderStatus}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-2 font-black text-primary">${(project.value || 0).toLocaleString()}</td>
                            <td className="py-3.5 px-2 text-muted-foreground/65 text-xs font-mono">
                              {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
