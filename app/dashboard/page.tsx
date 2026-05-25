"use client";

import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { ExportButton } from "@/components/dashboard/ExportButton";
import dynamic from "next/dynamic";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";
import { DollarSign, Briefcase, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useSession } from "next-auth/react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";

const RevenueChart = dynamic(
  () => import("@/components/dashboard/RevenueChart").then((mod) => mod.RevenueChart),
  { ssr: false }
);
const ProjectStatusChart = dynamic(
  () => import("@/components/dashboard/ProjectStatusChart").then((mod) => mod.ProjectStatusChart),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function Dashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const userRole = (session?.user as any)?.role || "client";
  const isClient = userRole === "client";

  const { data: statsData } = useAnalytics({
    enabled: sessionStatus === "authenticated" && !isClient,
  });

  const stats = statsData || {
    revenue: 0, activeOrders: 0, totalProjects: 0,
    totalMembers: 0, completionRate: 0, cancelledRate: 0,
  };

  const handleProjectCreated = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-foreground selection:bg-primary/30 transition-colors duration-300">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />
          <DashboardHeader />

          {isClient ? (
            <ClientDashboard />
          ) : (
            /* Internal Admin / Developer Dashboard */
            <motion.div
              className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto w-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6" variants={itemVariants}>
                <div>
                  <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
                    Fast Solutions Console
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em] text-foreground">
                    Welcome back, <span className="text-primary">{session?.user?.name || "Admin"}.</span>
                  </h1>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base font-medium">
                    Real-time performance orchestration for your IT and creative agency
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <ExportButton />
                  <div className="flex-1 sm:flex-none">
                    <ProjectModal onSuccess={handleProjectCreated} />
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <motion.div variants={itemVariants}><KPICard title="Total Revenue" value={stats.revenue} prefix="$" trend={stats.revenue > 0 ? { value: 12.5, isPositive: true } : undefined} description="vs last month" icon={DollarSign} gradient="primary" isLive /></motion.div>
                <motion.div variants={itemVariants}><KPICard title="Active Orders" value={stats.activeOrders} trend={stats.activeOrders > 0 ? { value: 8, isPositive: true } : undefined} description="in pipeline" icon={Briefcase} gradient="amber" /></motion.div>
                <motion.div variants={itemVariants}><KPICard title="Success Rate" value={stats.completionRate} suffix="%" decimalPlaces={1} trend={stats.completionRate > 0 ? { value: 2.1, isPositive: true } : undefined} description="above target" icon={CheckCircle2} gradient="primary" isLive /></motion.div>
                <motion.div variants={itemVariants}><KPICard title="Cancelled" value={stats.cancelledRate} suffix="%" decimalPlaces={1} trend={stats.cancelledRate > 0 ? { value: 0.5, isPositive: false } : undefined} description="cancellation rate" icon={XCircle} gradient="rose" /></motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                <motion.div className="lg:col-span-8 space-y-4 sm:space-y-6" variants={itemVariants}>
                  <ProjectTable />
                  <RevenueChart />
                </motion.div>
                <motion.div className="lg:col-span-4 space-y-4 sm:space-y-6" variants={itemVariants}>
                  <ProjectStatusChart />
                  <LeaderboardWidget />
                  <RecentActivity />
                </motion.div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
