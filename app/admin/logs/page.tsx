"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Shield, Activity as ActivityIcon, User, RefreshCw, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { motion } from "framer-motion";

export default function ActivityLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect non-admins
  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["admin-activities"],
    queryFn: async () => {
      const res = await fetch("/api/activities?limit=100");
      if (!res.ok) throw new Error("Failed to fetch activities");
      const json = await res.json();
      return json.data?.activities || [];
    },
    enabled: status === "authenticated" && (session?.user as any)?.role === "admin",
  });

  if (status === "loading" || isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen mesh-bg text-foreground">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
            <DashboardHeader />
            <div className="flex-1 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-muted-foreground/20 animate-spin" />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-foreground transition-colors duration-300">
        <DashboardSidebar />
        
        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          {/* Animated background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />

          <DashboardHeader />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6 sm:space-y-8 pb-20"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
                  Audit Trail
                </Badge>
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em] text-foreground">
                    System Audit Logs
                  </h1>
                </div>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base font-medium max-w-xl">
                  A permanent ledger of all critical actions taken within the Fast Solutions platform.
                </p>
              </div>
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-secondary border border-border/80 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
                Refresh Ledger
              </button>
            </div>

            {/* Ledger Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-secondary/40 border-b border-border/40 text-[10px] uppercase font-black text-muted-foreground tracking-[0.1em]">
                    <tr>
                      <th className="px-6 py-5">Timestamp</th>
                      <th className="px-6 py-5">User</th>
                      <th className="px-6 py-5">Action Taken</th>
                      <th className="px-6 py-5 text-center">Target</th>
                      <th className="px-6 py-5 text-right">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {!data || data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground/45">
                          <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p className="font-bold">No activity logs found in the system ledger.</p>
                        </td>
                      </tr>
                    ) : (
                      data.map((log: any) => (
                        <tr key={log._id} className="hover:bg-secondary/20 transition-colors group text-[13px]">
                          <td className="px-6 py-4 whitespace-nowrap text-muted-foreground/60 font-black text-[10px] font-mono">
                            {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center border border-border/60">
                                <User className="w-3.5 h-3.5 text-muted-foreground/60" />
                              </div>
                              <span className="font-bold text-foreground/80 group-hover:text-primary transition-colors">{log.userName || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-foreground/75">{log.action}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {log.target ? (
                              <span className="font-black text-[10px] px-2 py-1 bg-primary/10 rounded border border-primary/20 text-primary">
                                {log.target}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <Badge variant="outline" className={`
                              uppercase tracking-wider text-[9px] font-black rounded-md
                              ${log.type === "project" || log.type === "status" ? "bg-primary/10 text-primary border-primary/20" : ""}
                              ${log.type === "team" ? "bg-accent/10 text-accent border-accent/20" : ""}
                              ${log.type === "system" ? "bg-secondary text-muted-foreground border-border/80" : ""}
                            `}>
                              {log.type}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  );
}
