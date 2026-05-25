"use client";

import { useState } from "react";
import { useProjects, useUpdateProjectStatus } from "@/hooks/useProjects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { getTimeLeft, autoPriority } from "@/lib/utils/project";

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

const statusFlow = ["Pending", "WIP", "Revision", "Delivered", "Completed"];

export function ProjectTable({ refreshTrigger }: { refreshTrigger?: number }) {
  const { data: allProjects = [], isLoading: loading } = useProjects();
  const updateStatusMutation = useUpdateProjectStatus();

  const projects = allProjects.slice(0, 6);

  const handleStatusChange = (projectId: string, newStatus: string) => {
    updateStatusMutation.mutate({ projectId, status: newStatus });
  };

  if (loading) {
    return (
      <Card className="glass-card rounded-3xl border border-border/60">
        <CardContent className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden rounded-3xl border border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2 text-left">
        <CardTitle className="text-lg font-black tracking-tight text-foreground">
          Active Projects
        </CardTitle>
        <Link href="/projects">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/10 text-xs font-black cursor-pointer flex items-center"
          >
            View All
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="pl-6 text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                  Client
                </TableHead>
                <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                  Status
                </TableHead>
                <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                  Value
                </TableHead>
                <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                  Time Left
                </TableHead>
                <TableHead className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                  Priority
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[13px]">
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground/40 font-bold"
                  >
                    No active projects found.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project: any) => {
                  const timeLeft = getTimeLeft(project.deadline, project.orderStatus);
                  const s = project.orderStatus?.toLowerCase();
                  const priority = (s === "completed" || s === "delivered") ? "Green" : autoPriority(project.deadline);
                  return (
                    <TableRow
                      key={project._id}
                      className="border-border/40 hover:bg-secondary/40 transition-colors group"
                    >
                      <TableCell className="pl-6 text-left">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground/80 group-hover:text-primary transition-colors tracking-tight">
                            {project.clientName}
                          </span>
                          <span className="text-[10px] text-muted-foreground/45 font-bold font-mono mt-0.5">
                            {project.orderId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <button
                          onClick={() => {
                            const currentIndex = statusFlow.indexOf(
                              project.orderStatus
                            );
                            if (
                              currentIndex >= 0 &&
                              currentIndex < statusFlow.length - 1
                            ) {
                              handleStatusChange(
                                project._id,
                                statusFlow[currentIndex + 1]
                              );
                            }
                          }}
                          className="cursor-pointer text-left border-none bg-transparent p-0"
                          title="Click to advance status"
                        >
                          <Badge
                            variant="outline"
                            className={`${
                              statusStyles[project.orderStatus] || ""
                            } font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full hover:opacity-80 transition-opacity`}
                          >
                            {project.orderStatus}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className="text-left">
                        <span className="font-mono font-bold text-primary text-sm">
                          ${project.value}
                        </span>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex items-center space-x-1.5">
                          <Clock className={`w-3.5 h-3.5 ${timeLeft.color}`} />
                          <span
                            className={`text-xs font-bold ${timeLeft.color}`}
                          >
                            {timeLeft.text}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              priorityColors[priority]
                            }`}
                          />
                          <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                            {priority}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="sm:hidden flex flex-col divide-y divide-border/40">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground/40 text-sm font-bold">
              No active projects found.
            </div>
          ) : (
            projects.map((project: any) => {
              const timeLeft = getTimeLeft(project.deadline, project.orderStatus);
              const s = project.orderStatus?.toLowerCase();
              const priority = (s === "completed" || s === "delivered") ? "Green" : autoPriority(project.deadline);
              
              return (
                <div key={project._id} className="p-4 space-y-3 hover:bg-secondary/40 transition-colors text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-foreground/90 tracking-tight">{project.clientName}</p>
                      <p className="text-[10px] text-muted-foreground/45 font-bold font-mono mt-0.5">
                        {project.orderId}
                      </p>
                    </div>
                    <span className="font-mono font-black text-primary text-sm">
                      ${project.value}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        const currentIndex = statusFlow.indexOf(project.orderStatus);
                        if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
                          handleStatusChange(project._id, statusFlow[currentIndex + 1]);
                        }
                      }}
                      className="cursor-pointer text-left border-none bg-transparent p-0"
                    >
                      <Badge
                        variant="outline"
                        className={`${statusStyles[project.orderStatus] || ""} font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full hover:opacity-80`}
                      >
                        {project.orderStatus}
                      </Badge>
                    </button>

                    <div className="flex items-center space-x-2 bg-secondary/80 px-2.5 py-1 rounded-xl border border-border/60">
                      <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[priority]}`} />
                      <Clock className={`w-3 h-3 ${timeLeft.color}`} />
                      <span className={`text-[10px] font-bold ${timeLeft.color}`}>
                        {timeLeft.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
