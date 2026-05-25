"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { useSocket } from "@/components/providers/SocketProvider";

interface LeaderEntry {
  _id: string;
  name: string;
  performance_score: number;
  total_earnings: number;
  projects_completed: number;
}

export function LeaderboardWidget() {
  const queryClient = useQueryClient();

  const { data: leaders = [], isLoading } = useQuery<LeaderEntry[]>({
    queryKey: queryKeys.performance.list(),
    queryFn: async () => {
      const res = await fetch("/api/analytics/team-performance");
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch");
      
      return json.data.performance
        .slice(0, 5)
        .map((m: any) => ({
          _id: m._id,
          name: m.name,
          performance_score: Math.round(m.efficiencyScore || m.totalActive / 10),
          total_earnings: m.delivered,
          projects_completed: m.completedCount
        }));
    },
    staleTime: 0,
  });

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProjectUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.performance.list() });
    };

    socket.on("project-updated", handleProjectUpdated);

    return () => {
      socket.off("project-updated", handleProjectUpdated);
    };
  }, [queryClient, socket, isConnected]);

  const medalColors = [
    "from-amber-400 to-amber-600",
    "from-slate-300 to-slate-400",
    "from-orange-400 to-orange-600",
  ];

  return (
    <Card className="glass-card overflow-hidden rounded-3xl border border-border/60">
      <CardHeader className="pb-3 text-left">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black tracking-tight flex items-center space-x-2 text-foreground">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top Performers</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {!Array.isArray(leaders) || leaders.length === 0 ? (
          <p className="text-muted-foreground/40 text-xs font-bold text-center py-6">No data yet</p>
        ) : (
          leaders.map((member, index) => (
            <div
              key={member._id}
              className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-secondary/40 transition-all group text-left"
            >
              {/* Rank */}
              <div className="shrink-0">
                {index < 3 ? (
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${medalColors[index]} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white font-black text-xs">{index + 1}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center border border-border/40">
                    <span className="text-muted-foreground/60 font-black text-xs">{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Avatar + Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-foreground/80 truncate group-hover:text-primary transition-colors tracking-tight">
                  {member.name}
                </p>
                <p className="text-[10px] text-muted-foreground/50 font-bold font-mono mt-0.5">
                  {member.projects_completed || 0} projects
                </p>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-primary">{member.performance_score || 0}</p>
                <p className="text-[9px] text-muted-foreground/45 font-bold uppercase tracking-wider">pts</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
