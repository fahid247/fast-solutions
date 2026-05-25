"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Star, MessageSquare, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { ProjectChat } from "./ProjectChat";
import Swal from "sweetalert2";

interface EditProjectModalProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditProjectModal({
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectModalProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "chat">("details");
  const [developers, setDevelopers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    orderId: "",
    value: "",
    orderStatus: "Pending",
    developerName: "",
    firstDraft: "Pending",
    deliveryDate: "",
    orderStart: "",
    incomingDate: "",
    orderSheet: "",
    remarks: "",
    deadline: "",
    priority: "Green",
    clientName: "",
    profileName: "",
    star: 0,
  });

  // Load project data when modal opens
  useEffect(() => {
    if (project && open) {
      setFormData({
        orderId: project.orderId || "",
        value: String(project.value || ""),
        orderStatus: project.orderStatus || "Pending",
        developerName: project.developer?.name || "",
        firstDraft: project.firstDraft || "Pending",
        deliveryDate: project.deliveryDate
          ? new Date(project.deliveryDate).toISOString().split("T")[0]
          : "",
        orderStart: project.orderStart
          ? new Date(project.orderStart).toISOString().split("T")[0]
          : "",
        incomingDate: project.incomingDate
          ? new Date(project.incomingDate).toISOString().split("T")[0]
          : "",
        orderSheet: project.orderSheet || "",
        remarks: project.remarks || "",
        deadline: project.deadline
          ? new Date(project.deadline).toISOString().split("T")[0]
          : "",
        priority: project.priority || "Green",
        clientName: project.clientName || "",
        profileName: project.profileName || "",
        star: project.star || 0,
      });
    }
  }, [project, open]);

  useEffect(() => {
    async function fetchDevs() {
      try {
        const res = await fetch("/api/users");
        const json = await res.json();
        if (json.success && json.data?.users) {
          setDevelopers(json.data.users.filter((u: any) => u.status === "active"));
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (open) fetchDevs();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: formData.orderId,
          value: Number(formData.value),
          orderStatus: formData.orderStatus,
          developer: { name: formData.developerName },
          firstDraft: formData.firstDraft,
          deliveryDate: formData.deliveryDate
            ? new Date(formData.deliveryDate)
            : undefined,
          orderStart: formData.orderStart
            ? new Date(formData.orderStart)
            : undefined,
          incomingDate: formData.incomingDate
            ? new Date(formData.incomingDate)
            : undefined,
          orderSheet: formData.orderSheet,
          remarks: formData.remarks,
          deadline: new Date(formData.deadline),
          priority: formData.priority,
          clientName: formData.clientName,
          profileName: formData.profileName,
          star: formData.star,
        }),
      });

      if (res.ok) {
        toast.success("Project updated!");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error("Failed to update project");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1000px] bg-card border-border/80 text-foreground backdrop-blur-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-3xl shadow-2xl">
        
        {/* Header Section */}
        <div className="p-6 border-b border-border/40 flex items-center justify-between shrink-0 bg-secondary/20">
          <div>
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2 text-foreground">
              {project?.clientName || "Edit Order"}
              {project?.orderStatus && (
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {project.orderStatus}
                </span>
              )}
            </DialogTitle>
            <p className="text-xs text-muted-foreground/60 font-bold mt-1 tracking-widest uppercase font-mono">
              {project?.orderId || "Updating Project"}
            </p>
          </div>
          
          {/* Custom Tabs */}
          <div className="flex bg-secondary p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "details" ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              Details
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "chat" ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-card">
          {activeTab === "details" ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Row 1: Order # + Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Order #
                  </Label>
                  <Input
                    placeholder="e.g. FO21BAFB08386"
                    className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground placeholder:text-muted-foreground/30 font-medium"
                    value={formData.orderId}
                    onChange={(e) =>
                      setFormData({ ...formData, orderId: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Value ($)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground placeholder:text-muted-foreground/30 font-medium"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Row 2: Order Status + Developer Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Order Status
                  </Label>
                  <Select
                    value={formData.orderStatus}
                    onValueChange={(val) =>
                      setFormData({ ...formData, orderStatus: val ?? "Pending" })
                    }
                  >
                    <SelectTrigger className="bg-background border-border focus:border-primary focus:ring-primary rounded-xl h-11 text-foreground text-left font-medium">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/80 text-foreground">
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="WIP">WIP</SelectItem>
                      <SelectItem value="Revision">Revision</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Developer Name
                  </Label>
                  {isAdmin ? (
                    <Select
                      value={formData.developerName}
                      onValueChange={(val) =>
                        setFormData({ ...formData, developerName: val ?? "" })
                      }
                    >
                      <SelectTrigger className="bg-background border-border focus:border-primary focus:ring-primary rounded-xl h-11 text-foreground text-left font-medium">
                        <SelectValue placeholder="Select developer" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/80 text-foreground">
                        {developers.map((dev) => (
                          <SelectItem key={dev._id} value={dev.name}>
                            {dev.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.developerName}
                      disabled
                      className="bg-secondary border-border text-muted-foreground rounded-xl h-11 cursor-not-allowed"
                    />
                  )}
                </div>
              </div>

              {/* Row 2.5: Incoming Date + Order Sheet */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Incoming Date
                  </Label>
                  <Input
                    type="date"
                    className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground font-medium"
                    value={formData.incomingDate}
                    onChange={(e) =>
                      setFormData({ ...formData, incomingDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Order Sheet (Link)
                  </Label>
                  <Input
                    placeholder="e.g. https://docs.google.com/spreadsheets/..."
                    className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground placeholder:text-muted-foreground/30 font-medium"
                    value={formData.orderSheet}
                    onChange={(e) =>
                      setFormData({ ...formData, orderSheet: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 3: First Draft + Delivery Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    First Draft
                  </Label>
                  <Select
                    value={formData.firstDraft}
                    onValueChange={(val) =>
                      setFormData({ ...formData, firstDraft: val ?? "Pending" })
                    }
                  >
                    <SelectTrigger className="bg-background border-border focus:border-primary focus:ring-primary rounded-xl h-11 text-foreground text-left font-medium">
                      <SelectValue placeholder="Draft status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/80 text-foreground">
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Delivery Date
                  </Label>
                  <Input
                    type="date"
                    className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground font-medium"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 4: Deadline + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Deadline
                  </Label>
                  <Input
                    type="date"
                    className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground font-medium"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Green or Yellow
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(val) =>
                      setFormData({ ...formData, priority: val ?? "Green" })
                    }
                  >
                    <SelectTrigger className="bg-background border-border focus:border-primary focus:ring-primary rounded-xl h-11 text-foreground text-left font-medium">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/80 text-foreground">
                      <SelectItem value="Green">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          Green
                        </div>
                      </SelectItem>
                      <SelectItem value="Yellow">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          Yellow
                        </div>
                      </SelectItem>
                      <SelectItem value="Red">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          Red
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 5: Client + Profile */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Client Name
                  </Label>
                  <Input
                    placeholder="e.g. John Doe"
                    className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground placeholder:text-muted-foreground/30 font-medium"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                    Profile Name
                  </Label>
                  <Input
                    placeholder="e.g. FastSolutions"
                    className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground placeholder:text-muted-foreground/30 font-medium"
                    value={formData.profileName}
                    onChange={(e) =>
                      setFormData({ ...formData, profileName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                  Star Rating
                </Label>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/60">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, star: formData.star === s ? 0 : s })}
                        className="p-0.5 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            s <= formData.star
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/30 hover:text-muted-foreground/60"
                          }`}
                        />
                      </button>
                    ))}
                    {formData.star > 0 && (
                      <span className="text-xs text-amber-500 font-bold ml-2">{formData.star} Star</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                  Remarks
                </Label>
                <Input
                  placeholder="e.g. 5 Star, Done, revision needed..."
                  className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground placeholder:text-muted-foreground/30 font-medium"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                {(isAdmin || (project?.createdBy && session?.user?.id === project.createdBy.toString())) && (
                  <button
                    type="button"
                    className="w-1/3 border border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 font-bold h-12 rounded-xl transition-all cursor-pointer flex items-center justify-center text-xs"
                    disabled={loading}
                    onClick={async () => {
                      if (!project?._id) return;
                      
                      const result = await Swal.fire({
                        title: 'Delete Project?',
                        text: `Are you sure you want to delete ${project.orderId}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: 'var(--primary)',
                        cancelButtonColor: '#f43f5e',
                        confirmButtonText: 'Yes, delete it!',
                        background: 'var(--card)',
                        color: 'var(--foreground)',
                        customClass: {
                          popup: 'border border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl',
                          title: 'font-black tracking-tight text-foreground',
                          htmlContainer: 'text-muted-foreground font-medium',
                          confirmButton: 'rounded-xl font-bold px-6',
                          cancelButton: 'rounded-xl font-bold px-6',
                        }
                      });

                      if (result.isConfirmed) {
                        setLoading(true);
                        try {
                          const res = await fetch(`/api/projects/${project._id}`, { method: "DELETE" });
                          if (res.ok) {
                            toast.success("Project deleted");
                            onOpenChange(false);
                            onSuccess();
                          } else {
                            toast.error("Failed to delete project");
                          }
                        } catch {
                          toast.error("Network error");
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                  >
                    Delete Project
                  </button>
                )}
                <Button
                  type="submit"
                  className={`${(isAdmin || (project?.createdBy && session?.user?.id === project.createdBy.toString())) ? 'w-2/3' : 'w-full'} bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-black h-12 rounded-xl shadow-xl shadow-primary/10 transition-all border-none cursor-pointer`}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Update Project"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="h-full min-h-[400px]">
              <ProjectChat projectId={project?._id} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
