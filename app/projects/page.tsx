"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar, SidebarProvider } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProjectModal } from "@/components/dashboard/ProjectModal";
import { EditProjectModal } from "@/components/dashboard/EditProjectModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Clock,
  LayoutGrid,
  LayoutList,
  Trash2,
  Edit3,
  User,
  Star,
} from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { getTimeLeft } from "@/lib/utils/project";
import Swal from "sweetalert2";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  WIP: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Revision: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Delivered: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const priorityColors: Record<string, string> = {
  Green: "bg-emerald-500",
  Yellow: "bg-amber-500",
  Red: "bg-rose-500",
};

const kanbanColumns = ["Pending", "WIP", "Revision", "Delivered", "Completed"];

// Using centralized utility from @/lib/utils/project

import { useProjects, useUpdateProjectStatus, useDeleteProject, Project } from "@/hooks/useProjects";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isAdmin = session?.user?.role === "admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [editProject, setEditProject] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Modularized Hooks [hook-abstraction]
  const { data: projects = [], isLoading: loading } = useProjects();
  const statusMutation = useUpdateProjectStatus();
  const deleteMutation = useDeleteProject();

  const filteredProjects = projects.filter((p: any) => {
    const matchesSearch =
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.developer?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (projectId: string, newStatus: string) => {
    statusMutation.mutate({ projectId, status: newStatus });
  };

  const handleDelete = async (projectId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981', // emerald-500
      cancelButtonColor: '#f43f5e', // rose-500
      confirmButtonText: 'Yes, delete it!',
      background: '#0B0F14',
      color: '#fff',
      customClass: {
        popup: 'border border-white/10 rounded-2xl backdrop-blur-xl',
      }
    });

    if (result.isConfirmed) {
      try {
        await toast.promise(
          deleteMutation.mutateAsync(projectId),
          {
            loading: 'Deleting project...',
            success: 'Project deleted successfully',
            error: 'Failed to delete project',
          }
        );
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const totalValue = filteredProjects.reduce((s, p) => s + (p.value || 0), 0);

  return (
    <>
    <SidebarProvider>
    <div className="flex min-h-screen mesh-bg text-foreground transition-colors duration-300">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
        <DashboardHeader />
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-3 bg-primary/[0.08] text-primary border-primary/20 font-black tracking-[0.2em] uppercase text-[9px]">
              Project Hub
            </Badge>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em]">Manage Orders</h1>
                <p className="text-muted-foreground mt-1 font-medium">
                  {filteredProjects.length} projects · ${totalValue.toLocaleString()} total pipeline
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* View Toggle */}
                <div className="flex items-center bg-foreground/5 rounded-xl border border-border/50 p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "table"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "kanban"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
                <ProjectModal onSuccess={() => queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })} />
              </div>
            </div>
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            className="flex flex-col md:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by client, order ID, or developer..."
                className="pl-11 bg-background border-border text-foreground focus:border-primary/40 rounded-xl h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {["All", ...kanbanColumns, "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                    statusFilter === status
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground/60 hover:text-foreground hover:bg-foreground/5 border border-transparent"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {viewMode === "table" ? (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-2xl overflow-hidden border border-border/50"
              >
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent h-14">
                      <TableHead className="pl-6 text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">
                        Order Info
                      </TableHead>
                      <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">
                        Developer
                      </TableHead>
                      <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">
                        Value
                      </TableHead>
                      <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">
                        Time Left
                      </TableHead>
                      <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground hidden sm:table-cell">
                        Priority
                      </TableHead>
                      <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground text-right pr-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? Array.from({ length: 8 }).map((_, i) => (
                          <TableRow
                            key={i}
                            className="border-border/30 hover:bg-transparent"
                          >
                            <TableCell className="pl-6 py-5">
                              <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20 opacity-50" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Skeleton className="h-6 w-6 rounded-lg" />
                                <Skeleton className="h-4 w-20" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-14" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-10" />
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <Skeleton className="h-8 w-8 rounded-xl ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      : filteredProjects.length === 0
                      ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-16">
                            <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground font-bold">No projects match your filters.</p>
                          </TableCell>
                        </TableRow>
                      )
                      : filteredProjects.map((project: any) => {
                          const timeLeft = getTimeLeft(project.deadline, project.orderStatus);
                          return (
                            <TableRow
                              key={project._id}
                              className="border-border/50 hover:bg-foreground/5 transition-all group"
                            >
                              <TableCell className="pl-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm text-foreground/80 group-hover:text-primary transition-colors">
                                    {project.clientName}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    {project.orderId} · {project.profileName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-lg bg-foreground/5 flex items-center justify-center">
                                    <User className="w-3 h-3 text-muted-foreground" />
                                  </div>
                                  <span className="text-xs font-bold text-muted-foreground">
                                    {project.developer?.name || "Unassigned"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={project.orderStatus}
                                  onValueChange={(val) =>
                                    handleStatusChange(project._id, val)
                                  }
                                >
                                  <SelectTrigger className="w-[120px] h-8 bg-transparent border-none text-xs font-bold p-0 focus:ring-0">
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        statusStyles[project.orderStatus] || ""
                                      } font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full`}
                                    >
                                      {project.orderStatus}
                                    </Badge>
                                  </SelectTrigger>
                                  <SelectContent className="bg-card border-border text-foreground">
                                    {[...kanbanColumns, "Cancelled"].map((s) => (
                                      <SelectItem key={s} value={s}>
                                        {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono font-bold text-primary text-sm">
                                  ${project.value}
                                </span>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center space-x-1.5">
                                  <Clock className={`w-3 h-3 ${timeLeft.color}`} />
                                  <span className={`text-xs font-bold ${timeLeft.color}`}>
                                    {timeLeft.text}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1.5">
                                  <div className={`w-2 h-2 rounded-full ${priorityColors[timeLeft.priority]}`} />
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                    {timeLeft.priority}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="pr-6 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {project.star > 0 && (
                                    <div className="flex items-center gap-0.5 mr-2">
                                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                      <span className="text-[10px] font-bold text-amber-400">{project.star}</span>
                                    </div>
                                  )}
                                  {(isAdmin || 
                                    session?.user?.id === project.developer?.id?._id?.toString() || 
                                    session?.user?.id === project.developer?.id?.toString() || 
                                    session?.user?.id === project.createdBy?.toString() ||
                                    session?.user?.name === project.developer?.name) && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="rounded-xl hover:bg-primary/10 hover:text-primary h-8 w-8 transition-all"
                                      onClick={() => {
                                        setEditProject(project);
                                        setEditOpen(true);
                                      }}
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                  {(isAdmin || (project?.createdBy && session?.user?.id === project.createdBy.toString())) && (
                                    <button
                                      type="button"
                                      className="rounded-xl hover:bg-rose-500/10 hover:text-rose-600 h-8 w-8 transition-all flex items-center justify-center cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(project._id);
                                      }}
                                    >
                                      <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                                    </button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile Stacked Cards View */}
              <div className="md:hidden flex flex-col divide-y divide-border/50">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="p-4 space-y-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                    ))
                  : filteredProjects.length === 0
                  ? (
                      <div className="text-center py-12">
                        <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground font-bold">No projects match your filters.</p>
                      </div>
                    )
                  : filteredProjects.map((project: any) => {
                      const timeLeft = getTimeLeft(project.deadline, project.orderStatus);
                      return (
                        <div key={project._id} className="p-4 space-y-4 hover:bg-foreground/5 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm text-foreground/90">{project.clientName}</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                {project.orderId} · {project.profileName}
                              </p>
                            </div>
                            <span className="font-mono font-black text-primary text-sm">
                              ${project.value}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Select
                              value={project.orderStatus}
                              onValueChange={(val) => handleStatusChange(project._id, val)}
                            >
                              <SelectTrigger className="w-[110px] h-7 bg-foreground/5 border-border/50 text-[10px] font-bold p-0 px-2 focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border text-foreground">
                                {[...kanbanColumns, "Cancelled"].map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex items-center space-x-1.5 bg-foreground/5 px-2 py-1 rounded-md border border-border/50">
                              <Clock className={`w-3 h-3 ${timeLeft.color}`} />
                              <span className={`text-[10px] font-bold ${timeLeft.color}`}>
                                {timeLeft.text}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-lg bg-foreground/5 flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-xs font-bold text-muted-foreground">
                                {project.developer?.name || "Unassigned"}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {(isAdmin || 
                                session?.user?.id === project.developer?.id?._id?.toString() || 
                                session?.user?.id === project.developer?.id?.toString() || 
                                session?.user?.id === project.createdBy?.toString() ||
                                session?.user?.name === project.developer?.name) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg bg-foreground/5 hover:bg-primary/10 hover:text-primary"
                                  onClick={() => {
                                    setEditProject(project);
                                    setEditOpen(true);
                                  }}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              {(isAdmin || (project?.createdBy && session?.user?.id === project.createdBy.toString())) && (
                                <button
                                  type="button"
                                  className="h-8 w-8 rounded-lg bg-foreground/5 hover:bg-rose-500/10 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(project._id);
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
              </motion.div>
            ) : (
              /* KANBAN VIEW */
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
              >
                {kanbanColumns.map((column) => {
                  const columnProjects = filteredProjects.filter(
                    (p) => p.orderStatus === column
                  );
                  return (
                    <div key={column} className="space-y-3">
                      {/* Column Header */}
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              column === "Pending"
                                ? "bg-amber-500"
                                : column === "WIP"
                                ? "bg-blue-500"
                                : column === "Revision"
                                ? "bg-rose-500"
                                : column === "Delivered"
                                ? "bg-purple-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            {column}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground/60 bg-foreground/5 px-2 py-0.5 rounded-full">
                          {columnProjects.length}
                        </span>
                      </div>

                      {/* Cards */}
                      <div className="space-y-2 min-h-[200px]">
                        {columnProjects.map((project) => {
                          const timeLeft = getTimeLeft(project.deadline, project.orderStatus);
                          return (
                            <motion.div
                              key={project._id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <Card
                                className="bg-card/60 border-border/50 hover:bg-card transition-all group cursor-pointer"
                                onClick={() => {
                                  if (isAdmin || 
                                      session?.user?.id === project.developer?.id?._id?.toString() || 
                                      session?.user?.id === project.developer?.id?.toString() || 
                                      session?.user?.id === project.createdBy?.toString() ||
                                      session?.user?.name === project.developer?.name) {
                                    setEditProject(project);
                                    setEditOpen(true);
                                  } else {
                                    toast.error("You don't have permission to edit this project.");
                                  }
                                }}
                              >
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-bold text-sm text-foreground/80 group-hover:text-primary transition-colors">
                                        {project.clientName}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                        {project.orderId}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {project.star > 0 && (
                                        <div className="flex items-center gap-0.5">
                                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                          <span className="text-[9px] font-bold text-amber-400">{project.star}</span>
                                        </div>
                                      )}
                                      <div className={`w-2 h-2 rounded-full ${priorityColors[timeLeft.priority]}`} />
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-primary text-sm">
                                      ${project.value}
                                    </span>
                                    <span className={`text-[10px] font-bold ${timeLeft.color}`}>
                                      {timeLeft.text}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-2 pt-1 border-t border-border/50">
                                    <div className="w-5 h-5 rounded-md bg-foreground/5 flex items-center justify-center">
                                      <User className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground">
                                      {project.developer?.name || "Unassigned"}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
    </SidebarProvider>

    {/* Edit Modal */}
    <EditProjectModal
      project={editProject}
      open={editOpen}
      onOpenChange={setEditOpen}
      onSuccess={() => queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })}
    />
    </>
  );
}
