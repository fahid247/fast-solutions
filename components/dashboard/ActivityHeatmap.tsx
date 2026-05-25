"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Loader2 } from "lucide-react";

interface ActivityHeatmapProps {
  userId: string;
}

export function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const { data: activityMap = {}, isLoading } = useQuery<Record<string, number>>({
    queryKey: ["user-activity", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/activity`);
      const json = await res.json();
      return json.success ? json.data : {};
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Crunching data...</p>
      </div>
    );
  }

  // Generate days for the last 6 months (approx 26 weeks)
  const endDate = new Date();
  const startDate = subDays(endDate, 180); // ~6 months
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days by week (columns)
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  allDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || isSameDay(day, endDate)) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getIntensity = (count: number) => {
    if (!count) return "bg-secondary border-border/40";
    if (count < 3) return "bg-primary/20 border-primary/10 shadow-[0_0_10px_rgba(234,88,12,0.05)]";
    if (count < 6) return "bg-primary/45 border-primary/25 shadow-[0_0_15px_rgba(234,88,12,0.1)]";
    if (count < 10) return "bg-primary/75 border-primary/35 shadow-[0_0_20px_rgba(234,88,12,0.15)]";
    return "bg-primary border-primary/50 shadow-[0_0_25px_rgba(234,88,12,0.25)]";
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-foreground flex items-center gap-2 tracking-tight">
            Activity Distribution
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </h3>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
            Contribution heatmap based on daily engagement
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 bg-secondary/50 p-2 rounded-xl border border-border/80 w-fit shrink-0">
          <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">Less</span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-[4px] bg-secondary border border-border/40" />
            <div className="w-3 h-3 rounded-[4px] bg-primary/20 border border-primary/10" />
            <div className="w-3 h-3 rounded-[4px] bg-primary/45 border border-primary/25" />
            <div className="w-3 h-3 rounded-[4px] bg-primary/75 border border-primary/35" />
            <div className="w-3 h-3 rounded-[4px] bg-primary border border-primary/50" />
          </div>
          <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">More</span>
        </div>
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-2 shrink-0">
              {week.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const count = activityMap[dateStr] || 0;
                return (
                  <Tooltip key={dateStr}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (weekIndex * 0.01) + (day.getDay() * 0.005) }}
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-[4px] sm:rounded-md border transition-all hover:scale-125 hover:z-10 cursor-pointer ${getIntensity(count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border border-border/80 text-foreground p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{format(day, "MMMM d, yyyy")}</p>
                        <p className="text-sm font-bold text-foreground">{count} {count === 1 ? 'activity' : 'activities'}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </TooltipProvider>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40">
        <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60">
          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">Total Activities</p>
          <p className="text-xl font-black text-primary">
            {Object.values(activityMap).reduce((a: number, b: any) => a + (Number(b) || 0), 0)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60">
          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">Daily Average</p>
          <p className="text-xl font-black text-accent">
            {(Object.values(activityMap).reduce((a: number, b: any) => a + (Number(b) || 0), 0) / 180).toFixed(1)}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-secondary/35 border border-border/60">
          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">Peak Intensity</p>
          <p className="text-xl font-black text-amber-500">
            {Math.max(...(Object.values(activityMap).map(v => Number(v) || 0)), 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
