import React, { useState, useEffect } from "react";
import { dashboardService } from "../api/dashboard";
import {
  BarChart3,
  Users,
  CheckSquare,
  Loader2,
  TrendingUp,
  Calendar,
  Briefcase,
  Mail,
  Activity,
  AlertCircle,
  Clock,
  Percent,
  UserCheck,
  CheckCircle2,
  PieChart,
} from "lucide-react";

export default function ReportsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    setLoading(true);
    try {
      const stats = await dashboardService.getStats();
      setData(stats);
    } catch (err) {
      setError(
        "Failed to synchronize reporting context parameters from server core.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Syncing Operational Analytical Models...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200/50 bg-red-50/50 p-4 text-sm font-medium text-red-600 backdrop-blur-md dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-400">
        {error || "No dynamic statistical vectors available."}
      </div>
    );
  }

  const {
    employeeStatistics,
    projectStatistics,
    taskStatistics,
    recentEmployees,
    recentProjects,
    recentTasks,
    departmentDistribution,
    projectStatusChart,
    taskStatusChart,
  } = data;

  // Elite Advanced Quick Analytics Calculus (Calculated dynamically in real-time)
  const avgTasksPerEmployee =
    employeeStatistics.totalEmployees > 0
      ? (taskStatistics.totalTasks / employeeStatistics.totalEmployees).toFixed(
          1,
        )
      : 0;

  const avgEmployeesPerProject =
    projectStatistics.totalProjects > 0
      ? (
          employeeStatistics.totalEmployees / projectStatistics.totalProjects
        ).toFixed(1)
      : 0;

  // Helper calculation for dynamic pure-CSS chart scaling
  const maxProjectCount = Math.max(
    ...projectStatusChart.map((p) => p.count),
    1,
  );
  const maxTaskCount = Math.max(...taskStatusChart.map((t) => t.count), 1);

  return (
    <div className="space-y-8 p-1">
      {/* Dynamic Main Header View Segment */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900/5 dark:bg-slate-50/5 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
            <BarChart3 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-slate-50 dark:via-slate-300 dark:to-slate-50">
            Reports Overview
          </h1>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Real-time tracking analytics, system-wide entity states, and
          structural progress metrics.
        </p>
      </div>

      {/* 🚀 1. PROFESSIONAL TODAY'S SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Employees */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Employees
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
              {employeeStatistics.totalEmployees}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Active: {employeeStatistics.activeEmployees}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Total Projects */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Projects
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
              {projectStatistics.totalProjects}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Active Portfolios: {projectStatistics.activeProjects}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        {/* Total Tasks */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Tasks
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
              {taskStatistics.totalTasks}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Todo: {taskStatistics.todoTasks}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overdue Tasks
            </span>
            <div
              className={`text-2xl font-black ${taskStatistics.overdueTasks > 0 ? "text-rose-600" : "text-slate-900 dark:text-slate-50"}`}
            >
              {taskStatistics.overdueTasks}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Requires Immediate Review
            </div>
          </div>
          <div
            className={`p-3 rounded-xl ${taskStatistics.overdueTasks > 0 ? "bg-rose-500/10 text-rose-600" : "bg-slate-500/10 text-slate-400"}`}
          >
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 📊 2. ADVANCED INTERVIEW QUICK METRICS SECTION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Completion Rate */}
        <div className="p-4 rounded-xl border border-slate-200/50 bg-white/30 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/10 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center dark:bg-emerald-500/20">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Task Completion Rate
            </div>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200">
              {taskStatistics.completionPercentage}%
            </div>
          </div>
        </div>

        {/* Avg Tasks Per Employee */}
        <div className="p-4 rounded-xl border border-slate-200/50 bg-white/30 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/10 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center dark:bg-indigo-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Avg Tasks / Employee
            </div>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200">
              {avgTasksPerEmployee}
            </div>
          </div>
        </div>

        {/* Avg Employees Per Project */}
        <div className="p-4 rounded-xl border border-slate-200/50 bg-white/30 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/10 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center dark:bg-amber-500/20">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Avg Personnel / Project
            </div>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200">
              {avgEmployeesPerProject}
            </div>
          </div>
        </div>
      </div>

      {/* 📊 3. DYNAMIC VISUAL CHARTS SIMULATOR MATRIX */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Project Status Distribution Bar Chart */}
        <div className="p-6 rounded-2xl border border-slate-200/60 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <PieChart className="h-4 w-4" /> Project Status Tracking
          </h3>
          <div className="space-y-4 pt-2">
            {projectStatusChart.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.status}
                  </span>
                  <span className="text-slate-900 dark:text-white">
                    {item.count} Portfolios
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-200/40 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 dark:bg-slate-100 rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.count / maxProjectCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Status Distribution Progress Bars */}
        <div className="p-6 rounded-2xl border border-slate-200/60 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity className="h-4 w-4" /> Task Allocation Metrics
          </h3>
          <div className="space-y-4 pt-2">
            {taskStatusChart.map((item, idx) => {
              const statusConfig = {
                COMPLETED: {
                  color: "bg-emerald-500 dark:bg-emerald-400",
                  label: "Completed",
                },
                IN_PROGRESS: {
                  color: "bg-amber-500 dark:bg-amber-400",
                  label: "In Progress",
                },
                TODO: {
                  color: "bg-indigo-600 dark:bg-indigo-400",
                  label: "To Do",
                },
                ON_HOLD: {
                  color: "bg-orange-500 dark:bg-orange-400",
                  label: "On Hold",
                },
              };

              const config = statusConfig[item.status] || {
                color: "bg-slate-400 dark:bg-slate-500",
                label: item.status,
              };
              const percentage =
                maxTaskCount > 0 ? (item.count / maxTaskCount) * 100 : 0;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${config.color}`}
                      ></span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {config.label}
                      </span>
                    </div>
                    <span className="text-slate-900 dark:text-white">
                      {item.count} Actions
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200/40 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employees by Department (Vertical/Horizontal Distribution Chart) */}
        <div className="p-6 rounded-2xl border border-slate-200/60 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Personnel Density Pool
          </h3>
          <div className="space-y-4 pt-2">
            {departmentDistribution.map((dept, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">
                    {dept.department} Division
                  </span>
                  <span className="text-slate-900 dark:text-white">
                    {dept.count} Members
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-200/40 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(dept.count / employeeStatistics.totalEmployees) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🕒 4. HIGHLIGHTED RECENT METRICS VIEWPORTS (LAST 5 ITERATIONS TRACKER) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Last 5 Employees */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Recent Staff Accession
          </h3>
          <div className="space-y-3">
            {recentEmployees.slice(0, 5).map((emp) => (
              <div
                key={emp.id}
                className="p-3 rounded-xl border border-slate-200/30 bg-white/30 dark:border-slate-800/30 dark:bg-slate-900/10 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50">
                    {emp.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5">
                    {emp.employeeCode} • {emp.department}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Calendar className="h-3 w-3" /> {emp.joiningDate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last 5 Projects */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" /> Recent Active Ventures
          </h3>
          <div className="space-y-3">
            {recentProjects.slice(0, 5).map((proj) => (
              <div
                key={proj.id}
                className="p-3 rounded-xl border border-slate-200/30 bg-white/33 dark:border-slate-800/30 dark:bg-slate-900/10 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate max-w-[160px]">
                      {proj.projectName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">
                      Code: {proj.projectCode}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-950">
                    {proj.status.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{proj.progress ?? 0}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${proj.progress ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Assignment Nodes (Filtered for non-completed states) */}
        <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/50 shadow-md backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Pending Assignment Nodes
          </h3>
          <div className="space-y-3">
            {recentTasks
              ?.filter(
                (task) => task.status !== "COMPLETED" && task.status !== "DONE",
              )
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-slate-200/30 bg-white/33 dark:border-slate-800/30 dark:bg-slate-900/10 space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate max-w-[180px]">
                      {task.title}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded">
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <div className="truncate max-w-[120px]">
                      Asset: {task.employeeName}
                    </div>
                    <div className="text-rose-500">Limit: {task.deadline}</div>
                  </div>
                </div>
              ))}
            {recentTasks?.filter(
              (task) => task.status !== "COMPLETED" && task.status !== "DONE",
            ).length === 0 && (
              <div className="text-xs font-medium text-slate-400 text-center py-6">
                No pending task items detected in rotation.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
