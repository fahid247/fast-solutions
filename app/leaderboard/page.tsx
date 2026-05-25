"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Crown, RefreshCw } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { useSocket } from "@/components/providers/SocketProvider";

export default function LeaderboardPage() {
  const queryClient = useQueryClient();

  const { data: performanceData, isLoading: loading, isError, error } = useQuery({
    queryKey: queryKeys.performance.summary(),
    queryFn: async () => {
      const res = await fetch("/api/analytics/team-performance");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch");
      return json.data;
    },
    refetchInterval: 300000,
  });

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProjectUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.performance.all });
    };

    socket.on("project-updated", handleProjectUpdated);

    return () => {
      socket.off("project-updated", handleProjectUpdated);
    };
  }, [queryClient, socket, isConnected]);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-foreground">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground/60 font-black uppercase tracking-widest text-[10px]">Syncing Performance Data...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (isError) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-foreground">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 p-8 bg-destructive/10 border border-destructive/20 rounded-3xl max-w-md text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center text-destructive mb-2">
                  <Trophy className="w-8 h-8 opacity-40" />
                </div>
                <h2 className="text-xl font-black text-foreground">Performance Sync Failed</h2>
                <p className="text-sm text-muted-foreground/70 font-medium">{(error as Error)?.message || "An unexpected error occurred while fetching leaderboard data."}</p>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: queryKeys.performance.summary() })}
                  className="mt-4 bg-primary hover:opacity-95 text-white font-bold rounded-xl"
                >
                  Retry Connection
                </Button>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const data = performanceData;

  const chartData = data?.performance?.map((d: any) => ({
    name: d.name.split(' ')[0],
    WIP: d.wip,
    Canceled: d.cancelled,
    Delivered: d.delivered,
    Total: d.totalActive
  })) || [];

  const handleDownload = () => {
    window.print();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-foreground transition-colors duration-300">
        <div className="print:hidden">
          <DashboardSidebar />
        </div>
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <div className="print:hidden">
            <DashboardHeader />
          </div>
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 pb-20">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
                  Team Roster
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] text-foreground">Fast Solutions Team</h1>
                <p className="text-muted-foreground mt-2 text-sm font-medium">
                  {data?.performance?.length || 0} active members • {data?.totalStars || 0} total stars earned
                </p>
              </motion.div>

              {/* Top Performer Spotlight */}
              {data?.topPerformer && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border border-border/80 rounded-[2rem] p-5 flex items-center gap-5 shadow-2xl relative overflow-hidden group min-w-[280px]"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />
                  
                  <div className="relative">
                    <Avatar className="w-16 h-16 rounded-2xl border border-primary/30 shadow-lg shadow-primary/10">
                      <AvatarImage src={data.topPerformer.avatar} alt={data.topPerformer.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                        {getInitials(data.topPerformer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 bg-primary rounded-lg p-1 shadow-lg">
                      <Crown className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary mb-1 flex items-center gap-1.5">
                      Top Performer <Crown className="w-2.5 h-2.5" />
                    </p>
                    <h3 className="text-xl font-black text-foreground tracking-tight">{data.topPerformer.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground mt-1">${(data.topPerformer.delivered || 0).toLocaleString()} Delivered</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Performance Grid / Leaderboard */}
            <div className="glass-card rounded-3xl shadow-2xl overflow-hidden border border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/40">
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Developer Name</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">WIP</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Canceled</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Delivered</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Total Active</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Target</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Need</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 text-center">Stars</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-[13px]">
                    {data?.performance?.map((member: any) => (
                      <tr key={member._id} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 rounded-xl border border-border/60 shrink-0">
                              <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
                              <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-amber-500/80">${(member.wip || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 font-bold text-rose-500/50">${(member.cancelled || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 font-bold text-teal-600 dark:text-teal-400">${(member.delivered || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 font-black text-foreground">${(member.totalActive || 0).toLocaleString()}</td>
                        <td className="px-6 py-5 font-bold text-muted-foreground/45">${(member.target || 0).toLocaleString()}</td>
                        <td className="px-6 py-5">
                          <Badge className={`font-black text-[10px] px-3 py-1 rounded-lg border-none ${member.need > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'}`}>
                            {member.need > 0 ? `-$${(member.need || 0).toLocaleString()}` : `$${Math.abs(member.need || 0).toLocaleString()} Surplus`}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-amber-500 font-black">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{member.stars}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="bg-primary/5 font-black border-t border-primary/20">
                      <td className="px-6 py-7 text-primary uppercase tracking-[0.25em] text-[10px]">Total Aggregate</td>
                      <td className="px-6 py-7 text-amber-500/80">${(data?.totalWip || 0).toLocaleString()}</td>
                      <td className="px-6 py-7 text-rose-500/60">${(data?.totalCancelled || 0).toLocaleString()}</td>
                      <td className="px-6 py-7 text-teal-600 dark:text-teal-400">${(data?.totalDelivered || 0).toLocaleString()}</td>
                      <td className="px-6 py-7 text-foreground text-xl">${(data?.totalActiveAll || 0).toLocaleString()}</td>
                      <td className="px-6 py-7 text-muted-foreground/30">
                        ${data?.performance?.reduce((sum: number, m: any) => sum + m.target, 0).toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-7 text-muted-foreground/30">
                        <Badge className="bg-secondary text-muted-foreground/60 border border-border/60 font-black text-[10px] px-3 py-1 rounded-lg">
                          ${data?.performance?.reduce((sum: number, m: any) => sum + m.need, 0).toLocaleString() || 0} Total Need
                        </Badge>
                      </td>
                      <td className="px-6 py-7 text-amber-500 text-center text-lg">{data?.totalStars}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Analytics Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stacked Performance Chart */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-border/60 shadow-2xl">
                <div className="mb-8">
                  <h3 className="text-xl font-black text-foreground">Sprints & Operational Metrics</h3>
                  <p className="text-xs text-muted-foreground mt-1">Relative performance weightage per developer</p>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart
                      layout="vertical"
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      barSize={12}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} fontStyle="bold" />
                      <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={11} fontStyle="black" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--foreground)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold' }} />
                      <Bar dataKey="WIP" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Canceled" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Delivered" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Total" stackId="a" fill="var(--muted)" fillOpacity={0.4} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Distribution */}
              <div className="glass-card rounded-3xl p-6 border border-border/60 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-foreground">Revenue Distribution</h3>
                  <p className="text-xs text-muted-foreground mt-1">Contribution by each member</p>
                </div>
                <div className="space-y-6 my-8">
                  {data?.performance?.map((member: any) => (
                    <div key={member._id} className="space-y-2">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                        <span className="text-muted-foreground/80">{member.name}</span>
                        <span className="text-primary">{Math.round((member.totalActive / (data.totalActiveAll || 1)) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(member.totalActive / (data.totalActiveAll || 1)) * 100}%` }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-secondary border border-border hover:bg-secondary/85 text-foreground font-bold rounded-xl py-6 print:hidden shadow-sm"
                >
                  Download Full Report (PDF)
                </Button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
