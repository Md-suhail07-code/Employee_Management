import React, { useState, useEffect } from 'react';
import { assignmentService } from '../api/assignments';
import { X, UserPlus, UserMinus, Search, Loader2 } from 'lucide-react';

export default function ProjectAssignmentModal({ project, onClose, onRefreshProjectList }) {
  const [assigned, setAssigned] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAssets();
  }, [project.id]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const assignedData = await assignmentService.getAssignedEmployees(project.id);
      const unassignedData = await assignmentService.getUnassignedEmployees(project.id);
      setAssigned(assignedData || []);
      setUnassigned(unassignedData || []);
    } catch (err) {
      console.error("Failed to sync allocation profiles.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (empId) => {
    if (!empId) return;
    setActionId(empId);
    try {
      await assignmentService.assign(project.id, empId);
      await loadAssets();
      onRefreshProjectList();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = async (empId) => {
    if (!empId) return;
    setActionId(empId);
    try {
      await assignmentService.remove(project.id, empId);
      await loadAssets();
      onRefreshProjectList();
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  const filteredUnassigned = unassigned.filter(emp => 
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="h-full w-full max-w-lg border-l border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95 flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Resource Control</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 mt-0.5 truncate max-w-xs">
              {project.projectName}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900">
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Operational Manifest...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
            
            {/* 1. CURRENTLY ASSIGNED EMPLOYEES AREA */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                Active Employee Allocation <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-950">{assigned.length}</span>
              </h4>
              <div className="space-y-2">
                {assigned.length === 0 ? (
                  <p className="text-xs font-medium text-slate-400/90 italic p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    No active resource units locked onto this venture timeline[cite: 1].
                  </p>
                ) : (
                  assigned.map((emp) => (
                    <div key={emp.employeeId} className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60 bg-white/40 dark:border-slate-800/60 dark:bg-slate-950/40">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{emp.name}</div>
                        <div className="text-xs text-slate-400 font-medium">Code: {emp.employeeCode} | {emp.designation}</div>
                      </div>
                      <button
                        disabled={actionId !== null}
                        onClick={() => handleRemove(emp.employeeId)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        {actionId === emp.employeeId ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. AVAILABLE PERSONNEL POOL AREA */}
            <div className="space-y-3 border-t border-slate-200/50 pt-6 dark:border-slate-800/50">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Available Personnel Pool</h4>
              
              <div className="relative flex items-center group">
                <Search className="absolute left-3 h-4 w-4 text-slate-400 group-focus-within:text-slate-900" />
                <input
                  type="text"
                  placeholder="Filter available team members..."
                  className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-2 pl-9 pr-4 text-xs font-medium outline-none transition dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredUnassigned.length === 0 ? (
                  <p className="text-xs font-medium text-slate-400/90 text-center py-6">All available resources allocated.</p>
                ) : (
                  filteredUnassigned.map((emp) => (
                    <div key={emp.employeeId} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-900 dark:bg-slate-900/30">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{emp.name}</div>
                        <div className="text-xs text-slate-400 font-semibold">{emp.department} • {emp.designation}</div>
                      </div>
                      <button
                        disabled={actionId !== null}
                        onClick={() => handleAssign(emp.employeeId)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                      >
                        {actionId === emp.employeeId ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}