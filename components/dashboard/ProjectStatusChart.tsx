"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectStatusChart() {
  const { data: analytics, isLoading } = useAnalytics();
  
  const data = analytics?.statusDistribution || [];
  const total = data.reduce((s: number, d: any) => s + d.value, 0);

  if (isLoading) {
    return (
      <Card className="glass-card overflow-hidden rounded-3xl border border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-black tracking-tight text-foreground text-left">
            Project Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-center justify-center">
            <Skeleton className="w-40 h-40 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden rounded-3xl border border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-black tracking-tight text-foreground text-left">
          Project Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--foreground)",
                }}
                itemStyle={{ color: "var(--foreground)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-black text-foreground">{total}</p>
              <p className="text-[9px] text-muted-foreground/45 font-black uppercase tracking-wider">
                Total
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-left">
          {data.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-muted-foreground/60 font-bold truncate">
                {item.name}
              </span>
              <span className="text-[10px] text-muted-foreground/40 font-bold ml-auto font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
