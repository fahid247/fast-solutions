"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export function ProjectModal({ onSuccess }: { onSuccess?: () => void }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
  });

  useEffect(() => {
    if (open && !isAdmin && session?.user?.name) {
      setFormData(prev => ({ ...prev, developerName: session.user.name }));
    }
  }, [open, isAdmin, session]);

  useEffect(() => {
    async function fetchDevs() {
      try {
        const res = await fetch("/api/users");
        const json = await res.json();
        if (json.success && json.data?.users) {
          setDevelopers(
            json.data.users.filter((u: any) => u.status === "active")
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (open && isAdmin) fetchDevs();
  }, [open, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: formData.orderId,
          value: Number(formData.value),
          orderStatus: formData.orderStatus,
          developer: { name: formData.developerName },
          firstDraft: formData.firstDraft,
          deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : undefined,
          orderStart: formData.orderStart ? new Date(formData.orderStart) : undefined,
          incomingDate: formData.incomingDate ? new Date(formData.incomingDate) : undefined,
          orderSheet: formData.orderSheet,
          remarks: formData.remarks,
          deadline: new Date(formData.deadline),
          priority: formData.priority,
          clientName: formData.clientName,
          profileName: formData.profileName,
        }),
      });

      if (res.ok) {
        toast.success("Project created!");
        setOpen(false);
        setFormData({
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
        });
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to create project");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 w-full sm:w-auto justify-center cursor-pointer border-none">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        }
      />
      <DialogContent className="sm:max-w-[600px] bg-card border-border/80 text-foreground backdrop-blur-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
            Create New Order
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            Fill in the order details matching your tracking sheet
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-left">
          {/* Row 1: Order # + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                Order # *
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
                Value ($) *
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 flex flex-col">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                Developer Name *
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
                placeholder="e.g. https://docs.google.com/... "
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
                Deadline *
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

          {/* Row 5: Remarks + Client/Profile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
                Client Name *
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
                Profile Name *
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

          {/* Row 6: Remarks */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">
              Remarks
            </Label>
            <Input
              placeholder="e.g. 5 Star, Done, etc."
              className="bg-background border-border focus:border-primary focus-visible:ring-primary rounded-xl h-11 text-foreground placeholder:text-muted-foreground/30 font-medium"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-black h-12 rounded-xl shadow-xl shadow-primary/10 transition-all border-none mt-2 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Initiate Project"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
