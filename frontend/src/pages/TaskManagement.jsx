import React, { useState, useEffect } from "react";
import { taskService } from "../api/tasks";
import { employeeService } from "../api/employee";
import { projectService } from "../api/project";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckSquare,
  Calendar,
  SlidersHorizontal,
  ArrowUpDown,
  User,
  Folder,
  MessageSquare,
  Flame,
  CheckCircle,
} from "lucide-react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("NONE");

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    deadline: "",
    employeeId: "",
    projectId: "",
    remarks: "",
  });

  useEffect(() => {
    syncDependencies();
  }, []);

  const syncDependencies = async () => {
    setLoading(true);
    try {
      const [taskData, empData, projData] = await Promise.all([
        taskService.getAll(),
        employeeService.getAll(),
        projectService.getAll(),
      ]);
      setTasks(taskData);
      setEmployees(empData);
      setProjects(projData);
    } catch (err) {
      setError("Failed to synchronize task operational dashboard indices.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      deadline: new Date().toISOString().split("T")[0],
      employeeId: employees[0]?.id || "",
      projectId: projects[0]?.id || "",
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      employeeId: task.employeeId,
      projectId: task.projectId,
      remarks: task.remarks || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitLoading(true);
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, formData);
      } else {
        await taskService.create(formData);
      }
      setIsModalOpen(false);
      const updated = await taskService.getAll();
      setTasks(updated);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Operational validation constraint failure.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleInlineStatusChange = async (id, nextStatus) => {
    try {
      await taskService.updateStatus(id, nextStatus);
      const updated = await taskService.getAll();
      setTasks(updated);
    } catch (err) {
      setError("Failed to inline-patch operational task tracking status.");
    }
  };

  const handleInlineProgressChange = async (id, value) => {
    try {
      await taskService.updateProgress(id, parseInt(value, 10));
      const updated = await taskService.getAll();
      setTasks(updated);
    } catch (err) {
      setError("Failed to record progression update parameters.");
    }
  };

  const confirmDelete = (id) => {
    setTargetDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!targetDeleteId) return;
    try {
      await taskService.delete(targetDeleteId);
      setIsDeleteOpen(false);
      setTargetDeleteId(null);
      const updated = await taskService.getAll();
      setTasks(updated);
    } catch (err) {
      setError("Failed to safely purge operational assignment vector index.");
    }
  };

  // Pipeline Filtering
  const processTaskData = () => {
    let result = [...tasks];

    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (statusFilter !== "ALL")
      result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "ALL")
      result = result.filter((t) => t.priority === priorityFilter);

    if (sortKey === "TITLE")
      result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortKey === "DEADLINE")
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    else if (sortKey === "PROGRESS")
      result.sort((a, b) => b.progress - a.progress);

    return result;
  };

  const processedTasks = processTaskData();
  const totalItems = processedTasks.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const currentRows = processedTasks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter, sortKey]);

  return (
    <div className="space-y-8 p-1">
      {/* Header Container */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900/5 dark:bg-slate-50/5 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
              <CheckSquare className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-slate-50 dark:via-slate-300 dark:to-slate-50">
              Tasks Board
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Create and assign atomic action elements, track progression values,
            and submit code comments[cite: 1].
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4.5 py-2.5 text-sm font-semibold text-slate-50 shadow-md transition-all hover:bg-slate-800 active:scale-95 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" /> Create Task
        </button>
      </div>

      {/* Control Filters Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center w-full lg:max-w-xs relative group">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks or assignments..."
            className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-2.5 pl-11 pr-4 text-sm outline-none backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/60 p-2.5 text-xs font-bold uppercase text-slate-600 outline-none backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300"
          >
            <option value="ALL" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">All Statuses</option>
            <option value="TODO" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">TODO</option>
            <option value="IN_PROGRESS" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">IN PROGRESS</option>
            <option value="DONE" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">DONE</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/60 p-2.5 text-xs font-bold uppercase text-slate-600 outline-none backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300"
          >
            <option value="ALL" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">All Priorities</option>
            <option value="LOW" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">LOW</option>
            <option value="MEDIUM" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">MEDIUM</option>
            <option value="HIGH" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">HIGH</option>
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/60 p-2.5 text-xs font-bold uppercase text-slate-600 outline-none backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300"
          >
            <option value="NONE" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Sort Rules</option>
            <option value="TITLE" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Title</option>
            <option value="DEADLINE" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Deadline</option>
            <option value="PROGRESS" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Progress</option>
          </select>
        </div>

      </div>

      {error && (
        <div className="rounded-xl bg-red-50/50 border border-red-200 p-4 text-sm font-medium text-red-600 backdrop-blur-md dark:bg-red-950/20 dark:border-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Glassmorphic Table Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Syncing Matrix Vectors...
          </span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-900/[0.02] text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/60 dark:bg-white/[0.01] dark:border-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Task Details</th>
                  <th className="px-6 py-4">Context Vectors</th>
                  <th className="px-6 py-4">Progression Metrics</th>
                  <th className="px-6 py-4">Lifecycle State</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {currentRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center font-medium text-slate-400"
                    >
                      No organizational matrix allocation targets found.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((task) => (
                    <tr
                      key={task.id}
                      className="group hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01]"
                    >
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 transition-colors">
                          {task.title}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                        {task.remarks && (
                          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                            <MessageSquare className="h-3 w-3" />{" "}
                            <span className="truncate max-w-[200px]">
                              {task.remarks}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Folder className="h-3.5 w-3.5 text-slate-400" />
                          <span>Proj: {task.projectName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>User: {task.employeeName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-rose-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Due: {task.deadline}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-500">
                            <span>Progress</span>
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
                                task.id,
                                e.target.value,
                              )
                            }
                            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-800"
                            style={{
                              background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${task.progress || 0}%, #e2e8f0 ${task.progress || 0}%, #e2e8f0 100%)`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleInlineStatusChange(task.id, e.target.value)
                          }
                          className={`rounded-lg border px-2.5 py-1 text-xs font-bold bg-transparent outline-none ${
                            task.status === "DONE"
                              ? "text-emerald-600 border-emerald-200 bg-emerald-500/5"
                              : task.status === "IN_PROGRESS"
                                ? "text-indigo-600 border-indigo-200 bg-indigo-500/5"
                                : "text-amber-600 border-amber-200 bg-amber-500/5"
                          }`}
                        >
                          <option
                            value="TODO"
                            className="text-slate-900 bg-white"
                          >
                            TODO
                          </option>
                          <option
                            value="IN_PROGRESS"
                            className="text-slate-900 bg-white"
                          >
                            IN_PROGRESS
                          </option>
                          <option
                            value="COMPLETED"
                            className="text-slate-900 bg-white"
                          >
                            COMPLETED
                          </option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(task)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/5 dark:text-slate-400"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(task.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Component[cite: 1] */}
          {totalItems > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/60 bg-slate-900/[0.01] px-6 py-4 dark:border-slate-800/60 dark:bg-white/[0.01]">
              <div className="text-xs font-semibold tracking-wide uppercase text-slate-400/90 text-center sm:text-left">
                Viewing:{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {(currentPage - 1) * rowsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {Math.min(currentPage * rowsPerPage, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {totalItems}
                </span>{" "}
                Nodes
              </div>
              <div className="flex items-center justify-center gap-1 bg-slate-200/40 dark:bg-slate-900/60 p-1 rounded-xl w-fit border border-slate-300/30 dark:border-slate-800/30">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                </button>
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${currentPage === num ? "bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900" : "text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-800"}`}
                    >
                      {num}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages <= 1}
                  className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Dialog Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5 dark:border-slate-800/60">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {editingTask
                  ? "Modify Allocation Criteria"
                  : "Initialize Matrix Action Element"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Task Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Scope Description
                  </label>
                  <textarea
                    rows="2"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Project
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                    value={formData.projectId}
                    onChange={(e) =>
                      setFormData({ ...formData, projectId: e.target.value })
                    }
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                        {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Assigned Team Asset
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                  >
                    {employees.map((e) => (
                      <option key={e.id} value={e.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Priority Tier
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  >
                    <option value="LOW" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">LOW</option>
                    <option value="MEDIUM" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">MEDIUM</option>
                    <option value="HIGH" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">HIGH</option>
                  </select>
                </div>


                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Remarks / Operational Comments
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4.5 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-850 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {submitLoading && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}{" "}
                  Commit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Destructive Confirm Dialog Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 border border-red-200/20 dark:bg-red-500/20 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Purge Active Task Allocation
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Are you absolutely positive you want to destroy this
                  operational track index? Progress metrics and comments will be
                  permanently lost.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setTargetDeleteId(null);
                }}
                className="rounded-xl border border-slate-300 px-4.5 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExecute}
                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 shadow-sm"
              >
                Purge Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
