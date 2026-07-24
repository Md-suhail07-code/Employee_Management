import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeDashboardService } from "../api/employeeDashboard";
import { taskService } from "../api/tasks";
import { authService } from "../api/auth";
import {
  CheckSquare,
  Loader2,
  Calendar,
  Clock,
  Award,
  Briefcase,
  Layers,
  Percent,
  AlertCircle,
  MessageSquare,
  LogOut,
  User,
} from "lucide-react";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patchLoadingId, setPatchLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    syncMetrics();
  }, []);

  const syncMetrics = async () => {
    setLoading(true);
    try {
      const data = await employeeDashboardService.getMetrics();
      setDashboard(data);
    } catch (err) {
      setError(
        "Failed to fetch custom personnel metrics from core framework logs.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout(); // Clears localStorage tokens
    navigate("/login");
  };

  const handleInlineStatusChange = async (taskId, nextStatus) => {
    setPatchLoadingId(taskId);
    try {
      await taskService.updateStatus(taskId, nextStatus);
      const data = await employeeDashboardService.getMetrics();
      setDashboard(data);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setPatchLoadingId(null);
    }
  };

  const handleInlineProgressChange = async (taskId, nextValue) => {
    try {
      await taskService.updateProgress(taskId, parseInt(nextValue, 10));
      const data = await employeeDashboardService.getMetrics();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Syncing Personnel Operational Matrix...
        </span>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-xl border border-red-200/50 bg-red-50/50 p-4 text-sm font-medium text-red-600 backdrop-blur-md dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-400">
        {error || "No active context map loaded."}
      </div>
    );
  }

  // Properties updated to exactly match the backend API schema keys
  const {
    employee,
    statistics,
    assignedTasks,
    upcomingDeadlines,
    recentCompletedTasks,
  } = dashboard;
  const maxStatCount = Math.max(
    statistics.todoTasks,
    statistics.inProgressTasks,
    statistics.completedTasks,
    1
  );

  // Fetch stored user data from localStorage for profile avatar
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="space-y-8 p-1">
      {/* Premium Glassmorphic Profile Banner Header with Actions */}
      <div className="p-6 rounded-2xl border border-slate-200/60 bg-gradient-to-r from-white/40 via-white/70 to-white/40 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate("/profile")}
            className="h-14 w-14 rounded-xl bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-950 flex items-center justify-center border border-slate-200/20 font-black text-xl shadow-inner cursor-pointer overflow-hidden hover:opacity-90 transition group"
            title="Click to open Profile"
          >
            {user.profilePicUrl ? (
              <img src={user.profilePicUrl} alt={employee.name} className="h-full w-full object-cover" />
            ) : (
              <span>{employee.name ? employee.name.charAt(0) : "E"}</span>
            )}
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Welcome back, {employee.name}!
            </h1>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
              ID Reference: {employee.employeeCode} • {employee.designation}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-900/5 px-3 py-2 rounded-xl border border-slate-200/30 dark:bg-white/5 dark:text-slate-400">
            <Briefcase className="h-3.5 w-3.5" /> Division Sector:{" "}
            {employee.department}
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition active:scale-95"
          >
            <User className="h-3.5 w-3.5" /> My Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700 transition active:scale-95"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* 📊 1. WORKSPACE SUMMARY COUNTERS CARD MATRIX[cite: 1] */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Allocated Tasks */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Allocated Tasks
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
              {statistics.assignedTasks}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* Personal Rating Percentage */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Rating
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
              {statistics.completionPercentage.toFixed(1)}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        {/* In Progress */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              In Progress
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
              {statistics.inProgressTasks}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Overdue Anchors */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overdue Tasks
            </span>
            <div
              className={`text-2xl font-black ${statistics.overdueTasks > 0 ? "text-rose-600 animate-pulse" : "text-slate-900 dark:text-slate-50"}`}
            >
              {statistics.overdueTasks}
            </div>
          </div>
          <div
            className={`p-3 rounded-xl ${statistics.overdueTasks > 0 ? "bg-rose-500/10 text-rose-600" : "bg-slate-500/10 text-slate-400"}`}
          >
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 📊 2. LOGICAL TIMELINE MAP & STATUS CHARTS SIMULATOR[cite: 1] */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Dynamic task status bars chart component */}
        <div className="lg:col-span-1 p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Action Vectors Distribution
          </h3>
          <div className="space-y-4.5 pt-2">
            {[
              {
                label: "TODO Queued",
                count: statistics.todoTasks,
                color: "bg-amber-500",
              },
              {
                label: "Active Sprint",
                count: statistics.inProgressTasks,
                color: "bg-indigo-600",
              },
              {
                label: "Completed Items",
                count: statistics.completedTasks,
                color: "bg-emerald-500",
              },
              {
                label: "Deferred Status",
                count: statistics.onHoldTasks,
                color: "bg-slate-400",
              },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">
                    {bar.label}
                  </span>
                  <span className="text-slate-900 dark:text-white">
                    {bar.count} Tasks
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-200/40 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(bar.count / maxStatCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadline Alerts (Last 5 records limit)[cite: 1] */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-rose-500" /> Approaching
            Operational Milestones
          </h3>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs font-medium text-slate-400 italic py-6 text-center">
                No high priority deadlines pending inside active portfolios.
              </p>
            ) : (
              upcomingDeadlines.map((task, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200/30 bg-white/30 dark:border-slate-800/30 dark:bg-slate-900/10 flex items-center justify-between group"
                >
                  <div className="truncate max-w-xs">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">
                      {task.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5">
                      Venture Core: {task.projectName}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-500/10 border border-rose-500/10">
                      Due: {task.deadline}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 📋 3. ACTIVE RUNTIME ASSIGNED TASK DATA INTERFACE[cite: 1] */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Dynamic Tasks Board (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckSquare className="h-4 w-4" /> Comprehensive Assigned Tasks
            Board
          </h3>
          <div className="space-y-3">
            {assignedTasks.length === 0 ? (
              <div className="p-6 text-center font-medium text-slate-400 bg-white/40 border rounded-2xl">
                No tasks logged.
              </div>
            ) : (
              assignedTasks.map((task) => (
                <div
                  key={task.taskId}
                  className="p-4 rounded-2xl border border-slate-200/60 bg-white/50 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-slate-50">
                          {task.title}
                        </h4>
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded ${task.priority === "HIGH"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-slate-100 text-slate-500"
                            }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-bold tracking-wide mt-0.5 uppercase">
                        Project: {task.projectName}
                      </p>
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">
                        Deadline: {task.deadline}
                      </p>
                    </div>

                    <select
                      disabled={patchLoadingId === task.taskId}
                      value={task.status}
                      onChange={(e) =>
                        handleInlineStatusChange(task.taskId, e.target.value)
                      }
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold bg-transparent outline-none transition disabled:opacity-30 ${task.status === "COMPLETED"
                          ? "text-emerald-600 border-emerald-500/30 dark:text-emerald-400 bg-emerald-500/10"
                          : task.status === "IN_PROGRESS"
                            ? "text-indigo-600 border-indigo-500/30 dark:text-indigo-400 bg-indigo-500/10"
                            : "text-amber-600 border-amber-500/30 dark:text-amber-400 bg-amber-500/10"
                        }`}
                    >
                      <option value="TODO" className="text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-100">
                        TODO
                      </option>
                      <option
                        value="IN_PROGRESS"
                        className="text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-100"
                      >
                        IN_PROGRESS
                      </option>
                      <option
                        value="COMPLETED"
                        className="text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-100"
                      >
                        COMPLETED
                      </option>
                    </select>

                  </div>

                  {/* Range Slider for Live Progress Manipulation updates */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-slate-200/40 pt-3 dark:border-slate-800/40">
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Sprint Progress Update</span>
                        <span>{task.progress || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={task.progress || 0}
                        onChange={(e) =>
                          handleInlineProgressChange(
                            task.taskId,
                            e.target.value,
                          )
                        } // Note: Use task.id if updating TaskManagement.jsx
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-800"
                        style={{
                          background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${task.progress || 0}%, #e2e8f0 ${task.progress || 0}%, #e2e8f0 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Victory Records / Completed Tasks (Right 1 Column)[cite: 1] */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-emerald-500" /> Recent Completed
            Tasks
          </h3>
          <div className="space-y-3">
            {recentCompletedTasks.length === 0 ? (
              <p className="text-xs font-medium text-slate-400 italic py-6 text-center">
                No successful milestone completions resolved yet this sprint.
              </p>
            ) : (
              recentCompletedTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] shadow-sm flex items-start gap-3"
                >
                  <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {task.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5">
                      Project: {task.projectName}
                    </p>
                    <div className="text-[10px] font-semibold text-emerald-600 mt-1">
                      Task Completed
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
