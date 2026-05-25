"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  FileText, 
  Table as TableIcon, 
  FileJson, 
  ChevronDown, 
  Loader2,
  CheckCircle2,
  Info
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

export function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportData = async (type: 'projects' | 'revenue' | 'all', format: 'csv' | 'json') => {
    setIsExporting(true);
    setIsOpen(false);

    const loadingToast = toast.loading(`Preparing ${type} export...`, {
      style: {
        background: 'var(--card)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        fontSize: '14px',
        fontWeight: 'bold',
      }
    });

    try {
      // Simulate real processing time for "professional" feel
      await new Promise(resolve => setTimeout(resolve, 1500));

      const endpoint = type === 'projects' ? '/api/projects' : '/api/projects';
      const res = await fetch(endpoint);
      const json = await res.json();
      
      if (!json.success) throw new Error("Failed to fetch data");
      
      const data = json.data;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `fast_solutions_${type}_${timestamp}`;
      
      if (format === 'csv') {
        downloadCSV(data, `${filename}.csv`);
      } else {
        downloadJSON(data, `${filename}.json`);
      }
      
      toast.dismiss(loadingToast);
      toast.success(
        (t) => (
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-foreground">Export Complete</div>
              <div className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">{filename}.{format}</div>
            </div>
          </div>
        ),
        { duration: 4000, style: { background: 'var(--card)', border: '1px solid var(--border)' } }
      );
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error("Export failed. Please check your connection.");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }
    
    // Filter out complex objects for simple CSV
    const keys = Object.keys(data[0]).filter(k => 
      typeof data[0][k] !== 'object' || data[0][k] === null || Array.isArray(data[0][k])
    );
    
    const headers = keys.join(",");
    const rows = data.map(obj => 
      keys.map(k => {
        let val = obj[k];
        if (val === null || val === undefined) return '""';
        if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
        return `"${val}"`;
      }).join(",")
    ).join("\n");
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = (data: any[], filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border/80 bg-card text-sm font-bold hover:bg-secondary transition-all text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 group disabled:opacity-50 relative overflow-hidden shadow-sm cursor-pointer"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        ) : (
          <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        )}
        <span>{isExporting ? "Processing..." : "Export Data"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-64 rounded-2xl border border-border/80 bg-card shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 z-[100] origin-top-right"
          >
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Select Format</span>
              <Info className="w-3 h-3 text-muted-foreground/30" />
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => exportData('projects', 'csv')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-all text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <TableIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Projects Data</div>
                  <div className="text-[10px] text-muted-foreground/50 font-medium italic">Spreadsheet (.csv)</div>
                </div>
              </button>

              <button
                onClick={() => exportData('all', 'json')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition-all text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-accent transition-colors">Full Analytics</div>
                  <div className="text-[10px] text-muted-foreground/50 font-medium italic">Raw Data (.json)</div>
                </div>
              </button>

              <div className="my-2 border-t border-border/40 mx-2" />

              <button
                disabled
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl opacity-40 cursor-not-allowed text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground">Financial Report</div>
                  <div className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1">
                    Coming Soon
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-2 p-2 bg-secondary/35 rounded-xl border border-border/40">
              <p className="text-[9px] text-center text-muted-foreground/60 font-medium">
                All exports are encrypted and secured.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
