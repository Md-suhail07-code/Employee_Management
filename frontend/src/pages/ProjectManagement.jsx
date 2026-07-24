import React, { useState, useEffect } from "react";
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
  Briefcase,
  Calendar,
  Layers,
  Activity,
  UserCheck,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";

export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Client-Side Active Filtering & Sorting State Engines
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("NONE"); // OPTIONS: 'NONE', 'NAME', 'DEADLINE', 'PRIORITY'

  // Pagination Settings
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modal Dialog UI Flags
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    projectCode: "",
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "PLANNED",
    priority: "MEDIUM",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError("Failed to fetch project repository directory.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      projectCode: "",
      projectName: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "PLANNED",
      priority: "MEDIUM",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      projectCode: project.projectCode,
      projectName: project.projectName,
      description: project.description,
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      status: project.status,
      priority: project.priority,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, formData);
      } else {
        await projectService.create(formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Error processing request payload parameters.");
    }
  };

  const confirmDelete = (id) => {
    setTargetDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!targetDeleteId) return;
    try {
      await projectService.delete(targetDeleteId);
      setIsDeleteOpen(false);
      setTargetDeleteId(null);
      fetchProjects();
    } catch (err) {
      setError("Failed to execute project deletion sequence.");
      setIsDeleteOpen(false);
    }
  };

  // Pure Client-Side Compound Filter Pipeline Engine (No Network Cost)
  const processProjectData = () => {
    // 1. Structural Keyword Search Filter[cite: 1]
    let result = projects.filter(
      (proj) =>
        proj.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.projectCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Status Category Matching Node[cite: 1]
    if (statusFilter !== "ALL") {
      result = result.filter((proj) => proj.status === statusFilter);
    }

    // 3. Priority Tier Selection Node[cite: 1]
    if (priorityFilter !== "ALL") {
      result = result.filter((proj) => proj.priority === priorityFilter);
    }

    // 4. Sorting Metrics Processing Node[cite: 1]
    if (sortKey === "NAME") {
      result.sort((a, b) => a.projectName.localeCompare(b.projectName));
    } else if (sortKey === "DEADLINE") {
      result.sort((a, b) => new Date(a.endDate || "9999-12-31") - new Date(b.endDate || "9999-12-31"));
    } else if (sortKey === "PRIORITY") {
      const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      result.sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));
    }

    return result;
  };

  const processedProjects = processProjectData();

  // Pagination Calculus Layer[cite: 1]
  const totalItems = processedProjects.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = processedProjects.slice(indexOfFirstRow, indexOfLastRow);

  // Auto-reset page view index on search/filter modifications
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter, sortKey]);

  const getStatusBadge = (status) => {
    const maps = {
      PLANNED: "bg-amber-500/10 text-amber-600 border-amber-200/30 dark:bg-amber-500/20 dark:text-amber-400",
      IN_PROGRESS: "bg-indigo-500/10 text-indigo-600 border-indigo-200/30 dark:bg-indigo-500/20 dark:text-indigo-400",
      COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-200/30 dark:bg-emerald-500/20 dark:text-emerald-400",
    };
    return maps[status] || "bg-slate-500/10 text-slate-600 border-slate-200/30";
  };

  const getPriorityBadge = (priority) => {
    const maps = {
      HIGH: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      MEDIUM: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      LOW: "bg-slate-500/10 text-slate-600 dark:bg-slate-50/10 dark:text-slate-400",
    };
    return maps[priority] || "bg-slate-500/10 text-slate-600";
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900/5 dark:bg-slate-50/5 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
              <Briefcase className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-slate-50 dark:via-slate-300 dark:to-slate-50">
              Projects
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Track high-level application portfolios, development priorities, and milestone lifecycles[cite: 1].
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4.5 py-2.5 text-sm font-semibold text-slate-50 shadow-md transition-all duration-200 hover:bg-slate-800 hover:shadow-lg active:scale-95 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" /> Add Project
        </button>
      </div>

      {/* Glassmorphic Control Strip Bar (Search + Filtering + Sorting Combo) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Keyword Search Input */}
        <div className="flex items-center w-full lg:max-w-xs relative group">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-slate-50" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-2.5 pl-11 pr-4 text-sm outline-none backdrop-blur-md transition-all placeholder:text-slate-400/80 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800/80 dark:bg-slate-950/40 dark:focus:border-slate-700 dark:focus:bg-slate-950 dark:focus:ring-slate-50/5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dynamic Filters Control Shell */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
          {/* Status Selection */}
          <div className="relative flex items-center">
            <Activity className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-2.5 pl-9 pr-8 text-xs font-bold uppercase text-slate-600 outline-none backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLANNED">PLANNED</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          {/* Priority Selection */}
          <div className="relative flex items-center">
            <SlidersHorizontal className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-2.5 pl-9 pr-8 text-xs font-bold uppercase text-slate-600 outline-none backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* Engine Data Sorter */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-2.5 pl-9 pr-8 text-xs font-bold uppercase text-slate-600 outline-none backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300"
            >
              <option value="NONE">Sort Rules</option>
              <option value="NAME">Name</option>
              <option value="DEADLINE">Deadline</option>
              <option value="PRIORITY">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200/50 bg-red-50/50 p-4 text-sm font-medium text-red-600 backdrop-blur-md dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Glassmorphic Table Scaffolding */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 shadow-xl shadow-slate-200/20 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30 dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-900/[0.02] text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/60 dark:bg-white/[0.01] dark:border-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">Project Spec</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Timeline</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Assigned Assets</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center font-medium text-slate-400 bg-white/[0.02]">
                      No active programmatic ventures match standard filters.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((proj) => (
                    <tr
                      key={proj.id}
                      className="group transition-colors duration-150 hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01]"
                    >
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {proj.projectName}
                        </div>
                        <div className="text-xs text-slate-400 font-bold mt-0.5 tracking-wide uppercase">
                          Code: {proj.projectCode}
                        </div>
                        <p className="text-xs text-slate-505 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${getPriorityBadge(proj.priority)}`}>
                          {proj.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Start: {proj.startDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Layers className="h-3.5 w-3.5" />
                          <span>End: {proj.endDate || "Indefinite"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(proj.status)}`}>
                          <Activity className="h-3 w-3" />
                          {proj.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-semibold text-xs">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="h-4 w-4 text-slate-400" />
                          <span>{proj.employeeCount || 0} Staff Locked</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(proj)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-50 transition-all"
                          >
                            <Edit2 className="h-4 w-4 stroke-[2]" />
                          </button>
                          <button
                            onClick={() => confirmDelete(proj.id)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all"
                          >
                            <Trash2 className="h-4 w-4 stroke-[2]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Core[cite: 1] */}
          {totalItems > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/60 bg-slate-900/[0.01] px-6 py-4 dark:border-slate-800/60 dark:bg-white/[0.01]">
              <div className="text-xs font-semibold tracking-wide uppercase text-slate-400/90 text-center sm:text-left">
                Index: <span className="font-bold text-slate-700 dark:text-slate-300">{indexOfFirstRow + 1}</span> to{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {Math.min(indexOfLastRow, totalItems)}
                </span>{" "}
                — Active Clusters: <span className="font-bold text-slate-700 dark:text-slate-300">{totalItems}</span>
              </div>
              
              <div className="flex items-center justify-center gap-1 bg-slate-200/40 dark:bg-slate-900/60 p-1 rounded-xl w-fit mx-auto sm:mx-0 border border-slate-300/30 dark:border-slate-800/30">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:pointer-events-none disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1 stroke-[2.5]" /> Prev
                </button>
                
                {Array.from({ length: totalPages || 1 }, (_, idx) => idx + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === num
                        ? "bg-slate-900 text-slate-50 shadow-sm dark:bg-slate-50 dark:text-slate-900"
                        : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                  disabled={currentPage === totalPages || totalPages <= 1}
                  className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:pointer-events-none disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Unified Action Create/Edit Glassmorphic Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5 dark:border-slate-800/60">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {editingProject ? "Update Venture Configuration" : "Initialize New Corporate Project"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Code[cite: 1]</label>
                  <input
                    type="text"
                    name="projectCode"
                    required
                    placeholder="e.g. PRJ-001"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white"
                    value={formData.projectCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Name[cite: 1]</label>
                  <input
                    type="text"
                    name="projectName"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white"
                    value={formData.projectName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Scope Description[cite: 1]</label>
                  <textarea
                    name="description"
                    rows="2"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white resize-none"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Start Date[cite: 1]</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Deadline Target[cite: 1]</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Lifecycle Status[cite: 1]</label>
                  <select
                    name="status"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="PLANNED">PLANNED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Tier[cite: 1]</label>
                  <select
                    name="priority"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4.5 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-850 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 transition-all"
                >
                  Save Venture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Destructive Dialog Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 border border-red-200/20 dark:bg-red-500/20 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Purge Project Profile
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Are you absolutely positive you want to destroy this operational track index? Associated structural task matrices will lose reference anchors[cite: 1].
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
                className="rounded-xl border border-slate-300 px-4.5 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExecute}
                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all shadow-sm"
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