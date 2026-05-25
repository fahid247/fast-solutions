"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { ExportButton } from "@/components/dashboard/ExportButton";
import dynamic from "next/dynamic";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";
import {
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
  Zap,
  Clock,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const RevenueChart = dynamic(
  () =>
    import("@/components/dashboard/RevenueChart").then(
      (mod) => mod.RevenueChart
    ),
  { ssr: false }
);
const ProjectStatusChart = dynamic(
  () =>
    import("@/components/dashboard/ProjectStatusChart").then(
      (mod) => mod.ProjectStatusChart
    ),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.08,
    },
  },
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

  const [clientActiveTab, setClientActiveTab] = useState<"pipeline" | "meeting" | "order">("pipeline");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "meeting" || tab === "order" || tab === "pipeline") {
        setClientActiveTab(tab);
      }
    }
  }, []);

  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingGoal, setMeetingGoal] = useState("");
  const [meetingDev, setMeetingDev] = useState("");

  // Query for developers roster (for booking meeting dropdown)
  const { data: usersResponse } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: isClient,
  });

  const allUsers = usersResponse?.data?.users || [];
  const activeDevelopers = allUsers.filter((u: any) => u.status === "active" && u.role !== "client");

  const handleBookMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate || !meetingTime || !meetingDev) {
      toast.error("Please fill out all meeting details.");
      return;
    }
    Swal.fire({
      title: "Confirm Consultation",
      html: `You are booking a meeting on <b>${meetingDate}</b> at <b>${meetingTime}</b> with <b>${meetingDev}</b>.<br/><br/>Goal: <i>"${meetingGoal || "General Consultation"}"</i>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm Booking",
      confirmButtonColor: "#EA580C", // Sunset Orange
      cancelButtonColor: "#EF4444",
      background: "var(--card)",
      color: "var(--foreground)",
      customClass: {
        popup: "border border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl",
        title: "font-black text-foreground",
      }
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Meeting booked successfully! Calendar invite sent.");
        setMeetingDate("");
        setMeetingTime("");
        setMeetingGoal("");
        setMeetingDev("");
      }
    });
  };

  const handleOrderService = async (serviceName: string, value: number, durationDays: number) => {
    const result = await Swal.fire({
      title: `Order ${serviceName}`,
      html: `Are you sure you want to purchase this premium service package for <b>$${value.toLocaleString()}</b>?<br/><br/>This will create a new project in your live tracking pipeline.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm Order",
      confirmButtonColor: "#EA580C", // Sunset Orange
      cancelButtonColor: "#EF4444",
      background: "var(--card)",
      color: "var(--foreground)",
      customClass: {
        popup: "border border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl",
        title: "font-black text-foreground",
      }
    });

    if (result.isConfirmed) {
      try {
        const orderId = `FS-${Math.floor(10000 + Math.random() * 90000)}`;
        const deadlineDate = new Date();
        deadlineDate.setDate(deadlineDate.getDate() + durationDays);

        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: session?.user?.name || "Client",
            profileName: serviceName,
            orderId,
            value,
            orderStatus: "Pending",
            deadline: deadlineDate.toISOString(),
            client: {
              id: session?.user?.id,
              name: session?.user?.name,
              email: session?.user?.email
            }
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to order service");

        toast.success(`Order ${orderId} created successfully!`);
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
        setClientActiveTab("pipeline");
      } catch (err: any) {
        toast.error(err.message || "Failed to create order");
      }
    }
  };

  // Global statistics for admin/dev
  const { data: statsData } = useAnalytics({
    enabled: sessionStatus === "authenticated" && !isClient
  });

  const stats = statsData || {
    revenue: 0,
    activeOrders: 0,
    totalProjects: 0,
    totalMembers: 0,
    completionRate: 0,
    cancelledRate: 0,
  };

  // Client-specific queries
  const { data: clientProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const json = await res.json();
      return json.data || [];
    },
    enabled: isClient,
  });

  const { data: clientInvoices = [] } = useQuery({
    queryKey: ["client-invoices"],
    queryFn: async () => {
      const json = await fetch("/api/projects").then(r => r.json());
      const projects = json.data || [];
      const invoicesList = [];
      for (const p of projects) {
        if (p.orderStatus === "Completed" || p.orderStatus === "WIP") {
          invoicesList.push({
            id: p._id,
            invoiceNumber: `INV-2026-${(p.orderId || "").substring(3, 7) || "001"}`,
            project: p.clientName,
            amount: p.value,
            status: p.orderStatus === "Completed" ? "paid" : "sent",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString()
          });
        }
      }
      return invoicesList;
    },
    enabled: isClient,
  });

  const handleProjectCreated = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
  };

  // 1. Internal Admin & Developer Dashboard View
  const renderInternalDashboard = () => (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6"
        variants={itemVariants}
      >
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

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <motion.div variants={itemVariants}>
          <KPICard
            title="Total Revenue"
            value={stats.revenue}
            prefix="$"
            trend={stats.revenue > 0 ? { value: 12.5, isPositive: true } : undefined}
            description="vs last month"
            icon={DollarSign}
            gradient="primary"
            isLive
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            title="Active Orders"
            value={stats.activeOrders}
            trend={stats.activeOrders > 0 ? { value: 8, isPositive: true } : undefined}
            description="in pipeline"
            icon={Briefcase}
            gradient="amber"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            title="Success Rate"
            value={stats.completionRate}
            suffix="%"
            decimalPlaces={1}
            trend={stats.completionRate > 0 ? { value: 2.1, isPositive: true } : undefined}
            description="above target"
            icon={CheckCircle2}
            gradient="primary"
            isLive
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KPICard
            title="Cancelled"
            value={stats.cancelledRate}
            suffix="%"
            decimalPlaces={1}
            trend={stats.cancelledRate > 0 ? { value: 0.5, isPositive: false } : undefined}
            description="cancellation rate"
            icon={XCircle}
            gradient="rose"
          />
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <motion.div
          className="lg:col-span-8 space-y-4 sm:space-y-6"
          variants={itemVariants}
        >
          <ProjectTable />
          <RevenueChart />
        </motion.div>

        <motion.div
          className="lg:col-span-4 space-y-4 sm:space-y-6"
          variants={itemVariants}
        >
          <ProjectStatusChart />
          <LeaderboardWidget />
          <RecentActivity />
        </motion.div>
      </div>
    </motion.div>
  );

  // 2. Premium Client Portal Dashboard View
  const renderClientDashboard = () => {
    const activeProjects = clientProjects.filter((p: any) => ["Pending", "WIP", "Revision", "Delivered"].includes(p.orderStatus));
    const completedProjectsCount = clientProjects.filter((p: any) => p.orderStatus === "Completed").length;
    const totalInvested = clientProjects.reduce((acc: number, p: any) => acc + (p.value || 0), 0);
    const avgProgress = clientProjects.length > 0 
      ? Math.round(clientProjects.reduce((acc: number, p: any) => acc + (p.progress || 0), 0) / clientProjects.length)
      : 0;

    return (
      <motion.div
        className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Client Welcome Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6"
          variants={itemVariants}
        >
          <div>
            <Badge className="mb-3 bg-accent/10 text-accent border-accent/20 font-black tracking-[0.2em] uppercase text-[9px] px-3 py-1">
              Client Command Portal
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em] text-foreground">
              Welcome back, <span className="text-accent">{session?.user?.name || "Client"}.</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base font-medium">
              Track your custom solutions, view active project statuses, and message your design & development crew.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setClientActiveTab("pipeline")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border ${
                clientActiveTab === "pipeline"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setClientActiveTab("meeting")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border ${
                clientActiveTab === "meeting"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              Book Consultation
            </button>
            <button
              onClick={() => setClientActiveTab("order")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border ${
                clientActiveTab === "order"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              Order Service
            </button>
          </div>
        </motion.div>

        {/* Client KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <motion.div variants={itemVariants}>
            <KPICard
              title="Active Initiatives"
              value={activeProjects.length}
              description="in development pipeline"
              icon={Briefcase}
              gradient="primary"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPICard
              title="Delivered Solutions"
              value={completedProjectsCount}
              description="completed on-time"
              icon={CheckCircle2}
              gradient="primary"
              isLive
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPICard
              title="Overall Build Progress"
              value={avgProgress}
              suffix="%"
              description="average sprint progress"
              icon={TrendingUp}
              gradient="amber"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPICard
              title="Total Invested"
              value={totalInvested}
              prefix="$"
              description="total portfolio value"
              icon={DollarSign}
              gradient="primary"
            />
          </motion.div>
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          {clientActiveTab === "pipeline" && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
            >
              {/* Left Panel: Client Projects Table */}
              <div className="lg:col-span-8 space-y-4 sm:space-y-6">
                <div className="glass-card rounded-3xl p-6 border border-border/60 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-accent" />
                        Your Solutions Pipeline
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">Real-time status updates of your agency items</p>
                    </div>
                    <Badge className="bg-accent/10 text-accent border-accent/20 px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold">
                      {clientProjects.length} Total Projects
                    </Badge>
                  </div>

                  {projectsLoading ? (
                    <div className="py-20 text-center text-muted-foreground font-bold text-sm">Loading project logs...</div>
                  ) : clientProjects.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-border space-y-3">
                      <Sparkles className="w-8 h-8 text-primary/45 mx-auto" />
                      <p className="font-bold text-sm">No active initiatives found</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">Click "Order Service" at the top to launch your first premium custom package.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border/40 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            <th className="pb-3 pl-2">Project</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Sprint Progress</th>
                            <th className="pb-3">Primary Developer</th>
                            <th className="pb-3 text-right pr-2">Timeline</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {clientProjects.map((project: any) => {
                            const statusColors: Record<string, string> = {
                              Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              WIP: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                              Revision: "bg-rose-500/10 text-rose-500 border-rose-500/20",
                              Delivered: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                              Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                              Cancelled: "bg-foreground/5 text-muted-foreground border-border/50"
                            };

                            return (
                              <tr key={project._id} className="text-[13px] hover:bg-secondary/40 transition-colors group">
                                <td className="py-4 pl-2 font-bold text-foreground group-hover:text-primary transition-colors">
                                  {project.profileName}
                                  <span className="block text-[10px] text-muted-foreground font-medium font-mono mt-0.5">{project.orderId}</span>
                                </td>
                                <td className="py-4">
                                  <Badge className={`font-black text-[9px] uppercase tracking-wider ${statusColors[project.orderStatus] || ""}`}>
                                    {project.orderStatus}
                                  </Badge>
                                </td>
                                <td className="py-4 w-40">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground w-8">{project.progress}%</span>
                                  </div>
                                </td>
                                <td className="py-4 font-semibold text-foreground/90">
                                  {project.developer?.name || "Assigning Crew..."}
                                </td>
                                <td className="py-4 text-right pr-2 font-semibold text-muted-foreground">
                                  {project.orderStatus === "Completed" ? "Delivered" : project.timeLeft || "Pending Setup"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Invoices & Quick Crew Chat */}
              <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                <div className="glass-card rounded-3xl p-6 border border-border/60 shadow-xl">
                  <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-accent" />
                    Financial Invoices
                  </h3>
                  {clientInvoices.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-xs">No active invoices found.</div>
                  ) : (
                    <div className="space-y-3.5">
                      {clientInvoices.map((inv: any) => (
                        <div key={inv.id} className="p-3.5 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between group hover:bg-secondary/60 transition-all">
                          <div>
                            <p className="text-xs font-black text-foreground">{inv.invoiceNumber}</p>
                            <p className="text-[10px] text-muted-foreground font-bold font-mono mt-0.5">Due: {inv.dueDate}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-black text-foreground">${inv.amount}</span>
                            <Badge className={`text-[8px] uppercase tracking-widest font-black ${
                              inv.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}>
                              {inv.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass-card rounded-3xl p-6 border border-border/60 shadow-xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-black text-foreground">Need an adjustment?</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 leading-relaxed">
                      Start a direct chat with your assigned team members inside the projects panel.
                    </p>
                  </div>
                  <Link
                    href="/projects"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 font-bold text-xs text-white transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Go to Project Rooms
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {clientActiveTab === "meeting" && (
            <motion.div
              key="meeting"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto w-full"
            >
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/60 shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Book Live Consultation
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Schedule a direct sprint discussion with our active technical crew.</p>
                </div>

                <form onSubmit={handleBookMeeting} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Select Date</Label>
                      <input
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl h-12 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Select Time Slot</Label>
                      <select
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl h-12 px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold"
                        required
                      >
                        <option value="">Choose a time slot...</option>
                        <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM GMT+6</option>
                        <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM GMT+6</option>
                        <option value="04:30 PM - 05:15 PM">04:30 PM - 05:15 PM GMT+6</option>
                        <option value="08:00 PM - 08:45 PM">08:00 PM - 08:45 PM GMT+6</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Primary Developer / Lead</Label>
                    <select
                      value={meetingDev}
                      onChange={(e) => setMeetingDev(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl h-12 px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-semibold"
                      required
                    >
                      <option value="">Select a crew member...</option>
                      {activeDevelopers.length === 0 ? (
                        <option value="General Agency Architect">General Agency Architect (Auto-Assigned)</option>
                      ) : (
                        activeDevelopers.map((dev: any) => (
                          <option key={dev._id} value={dev.name}>{dev.name} ({dev.role === "admin" ? "Founder" : "Senior Developer"})</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">Session Goal & Remarks</Label>
                    <textarea
                      value={meetingGoal}
                      onChange={(e) => setMeetingGoal(e.target.value)}
                      rows={4}
                      placeholder="Outline what features or solutions we will discuss during this consultation session..."
                      className="w-full bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none font-medium"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-bold h-12 rounded-xl text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Confirm Booking Schedule
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {clientActiveTab === "order" && (
            <motion.div
              key="order"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 w-full"
            >
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-xl font-black text-foreground">Order Premium Agency Solutions</h3>
                <p className="text-xs text-muted-foreground font-medium">Select a standardized crew package to deploy live in your tracker pipeline.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4">
                {[
                  {
                    title: "UI/UX Design Sprint",
                    price: 999,
                    duration: 7,
                    description: "High-fidelity modern designs, user research, wireframes, and prototype links in Figma.",
                    features: ["Complete Figma Prototypes", "Interactive Animations", "User Flow Maps", "Modern SVG Assets", "7-Day Sprint Delivery"],
                    icon: Zap,
                    badge: "Fast Delivery"
                  },
                  {
                    title: "Creative Landing Page",
                    price: 2499,
                    duration: 14,
                    description: "Stunning static corporate agency web application utilizing rich typography and dynamic interactive CSS layouts.",
                    features: ["Next.js & Tailwind Core", "Framer Motion Effects", "Complete SEO Optimization", "Integrated Contact Form", "14-Day Delivery"],
                    icon: Sparkles,
                    badge: "Most Popular"
                  },
                  {
                    title: "SaaS Platform Build",
                    price: 4999,
                    duration: 30,
                    description: "Full-scale customized SaaS solution comprising responsive dashboards, databases, user management, and secure payments.",
                    features: ["Dynamic Crew Dashboards", "MongoDB Database Cluster", "NextAuth Integration", "Stripe Checkout Setup", "30-Day Project Delivery"],
                    icon: Briefcase,
                    badge: "Enterprise"
                  }
                ].map((pkg) => (
                  <div key={pkg.title} className="glass-card rounded-3xl p-6 border border-border/60 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] hover:border-primary/30 transition-all duration-300">
                    <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl">
                      {pkg.badge}
                    </div>

                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <pkg.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-foreground text-lg">{pkg.title}</h4>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-3xl font-black text-foreground">${pkg.price.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground font-semibold">USD</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed font-medium">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="space-y-2.5 pt-4 border-t border-border/40">
                        {pkg.features.map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOrderService(pkg.title, pkg.price, pkg.duration)}
                      className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-bold h-11 rounded-xl text-xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      Deploy Solution Order
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen mesh-bg text-foreground selection:bg-primary/30 transition-colors duration-300">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
          {/* Animated background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -z-10" />

          <DashboardHeader />

          {/* Render Dashboard based on role */}
          {isClient ? renderClientDashboard() : renderInternalDashboard()}
        </main>
      </div>
    </SidebarProvider>
  );
}
