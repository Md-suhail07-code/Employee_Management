import React, { useState, useEffect } from "react";
import { projectService } from "../api/project";
import ProjectAssignmentModal from "../components/ProjectAssignmentModal";
import {
  Plus, Search, Edit2, Trash2, X, Loader2, ChevronLeft, ChevronRight,
  AlertTriangle, Briefcase, Calendar, Layers, Activity, UserCheck,
  ArrowUpDown, Clock, Tag
} from "lucide-react";

export default function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("NONE");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [assignmentTargetProject, setAssignmentTargetProject] = useState(null);

  const [formData, setFormData] = useState({
    projectCode: "", projectName: "", description: "", startDate: "",
    endDate: "", status: "NOT_STARTED", priority: "MEDIUM",
  });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError("Failed to fetch projects.");
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
      status: "NOT_STARTED",
      priority: "MEDIUM"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      projectCode: project.projectCode,
      projectName: project.projectName,
      description: project.description,
      startDate: project.startDate? project.startDate.split("T")[0] : "",
      endDate: project.endDate? project.endDate.split("T")[0] : "",
      status: project.status,
      priority: project.priority,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitLoading(true);
    try {
      if (editingProject) await projectService.update(editingProject.id, formData);
      else await projectService.create(formData);
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Error processing request.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setTargetDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!targetDeleteId) return;
    setDeleteLoading(true);
    try {
      await projectService.delete(targetDeleteId);
      setIsDeleteOpen(false);
      setTargetDeleteId(null);
      fetchProjects();
    } catch (err) {
      setError("Failed to delete project.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const processProjectData = () => {
    let result = projects.filter((proj) =>
      proj.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.projectCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter!== "ALL") result = result.filter((proj) => proj.status === statusFilter);
    if (priorityFilter!== "ALL") result = result.filter((proj) => proj.priority === priorityFilter);
    if (sortKey === "NAME") result.sort((a, b) => a.projectName.localeCompare(b.projectName));
    else if (sortKey === "DEADLINE") result.sort((a, b) => new Date(a.endDate || "9999-12-31") - new Date(b.endDate || "9999-12-31"));
    else if (sortKey === "PRIORITY") {
      const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      result.sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));
    }
    return result;
  };

  const processedProjects = processProjectData();
  const totalItems = processedProjects.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = processedProjects.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, priorityFilter, sortKey]);

  const getStatusConfig = (status) => {
    const maps = {
      NOT_STARTED: { label: "Not Started", color: "bg-amber-500/10 text-amber-600 border border-amber-200/30 dark:bg-amber-500/20 dark:text-amber-400" },
      IN_PROGRESS: { label: "In Progress", color: "bg-indigo-500/10 text-indigo-600 border border-indigo-200/30 dark:bg-indigo-500/20 dark:text-indigo-400" },
      COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-600 border border-emerald-200/30 dark:bg-emerald-500/20 dark:text-emerald-400" },
    };
    return maps[status] || maps.NOT_STARTED;
  };

  const getPriorityConfig = (priority) => {
    const maps = {
      HIGH: { label: "High Priority", color: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" },
      MEDIUM: { label: "Medium Priority", color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" },
      LOW: { label: "Low Priority", color: "bg-slate-500/10 text-slate-600 dark:bg-slate-50/10 dark:text-slate-400" },
    };
    return maps[priority] || maps.MEDIUM;
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900/5 dark:bg-slate-50/5 border-slate-200/50 dark:border-slate-800/50">
              <Briefcase className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-50 dark:to-slate-300">
              Projects
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Manage portfolios, priorities, and project lifecycles.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            className="w-full rounded-xl border border-slate-200/80 bg-white/70 py-2.5 pl-11 pr-4 text-sm backdrop-blur-md focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 outline-none dark:border-slate-800/80 dark:bg-slate-950/40 dark:focus:border-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2.5 text-xs font-bold uppercase backdrop-blur-md outline-none dark:border-slate-800/80 dark:bg-slate-950/40 text-slate-600 dark:text-slate-300"
          >
            <option value="ALL">All Status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2.5 text-xs font-bold uppercase backdrop-blur-md outline-none dark:border-slate-800/80 dark:bg-slate-950/40 text-slate-600 dark:text-slate-300"
          >
            <option value="ALL">All Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2.5 text-xs font-bold uppercase backdrop-blur-md outline-none dark:border-slate-800/80 dark:bg-slate-950/40 text-slate-600 dark:text-slate-300"
          >
            <option value="NONE">Sort By</option>
            <option value="NAME">Name</option>
            <option value="DEADLINE">Deadline</option>
            <option value="PRIORITY">Priority</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border-red-200/50 bg-red-50/50 p-3 text-sm text-red-600 dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Styled Vertical Card Grid Area */}
      {loading? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading portfolios...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentRows.length === 0? (
              <div className="col-span-full rounded-2xl border-dashed border-slate-300/60 bg-white/30 p-12 text-center dark:border-slate-700/60 dark:bg-slate-950/20">
                <Briefcase className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                <p className="font-semibold text-slate-500 dark:text-slate-400">No portfolios discovered</p>
                <p className="text-sm text-slate-400">Try tweaking filtering configs or launch a new initiative.</p>
              </div>
            ) : (
              currentRows.map((proj) => {
                const status = getStatusConfig(proj.status);
                const priority = getPriorityConfig(proj.priority);
                return (
                  <div
                    key={proj.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white/50 p-6 shadow-xl shadow-slate-200/10 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 dark:border-slate-800/60 dark:bg-slate-950/20"
                  >
                    {/* Card Inner Vertical Flow */}
                    <div className="space-y-4">
                      {/* Section 1: Title block & Control Actions */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-50 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
                            {proj.projectName}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold tracking-wider font-mono">
                            <Tag className="h-3 w-3" />
                            <span>{proj.projectCode}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0 bg-slate-100/50 p-1 rounded-xl border border-slate-200/40 dark:bg-slate-900/40 dark:border-slate-800/40 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(proj)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete(proj.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Section 2: Isolated Scope Description */}
                      <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/30 dark:border-slate-800/30">
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                          {proj.description || "No project description provided."}
                        </p>
                      </div>

                      {/* Section 3: Progress & Badge Identifiers */}
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Layers className="h-3 w-3" /> Task Progress
                            </span>
                            <span className="text-indigo-600 dark:text-indigo-400">{proj.progress ?? 0}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                              style={{ width: `${proj.progress ?? 0}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-0.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide border ${status.color}`}>
                          <Activity className="h-3 w-3" />
                          {status.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ${priority.color}`}>
                          {priority.label}
                        </span>
                        </div>
                      </div>

                      {/* Section 4: Vertical Timeline stack */}
                      <div className="space-y-2.5 border-t border-slate-200/60 dark:border-slate-800/50 pt-4">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/[0.02] hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01] transition-colors border border-slate-200/20 text-xs">
                          <span className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" /> Start Date
                          </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{proj.startDate}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/[0.02] hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01] transition-colors border border-slate-200/20 text-xs">
                          <span className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                            <Clock className="h-3.5 w-3.5 text-slate-400" /> Deadline Target
                          </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{proj.endDate || "TBD"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Anchored Footer Action Button */}
                    <div className="mt-5 pt-1">
                      <button
                        onClick={() => setAssignmentTargetProject(proj)}
                        className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-55/10 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-indigo-950 dark:hover:text-indigo-400 transition-all duration-200"
                      >
                        <UserCheck className="h-4 w-4 stroke-[2]" />
                        <span>{proj.employeeCount || 0} Employees Allocated</span>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/60 bg-white/50 p-4 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/30">
              <p className="text-xs font-bold tracking-wide uppercase text-slate-400">
                Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, totalItems)} of {totalItems}
              </p>
              <div className="flex items-center justify-center gap-1 bg-slate-200/40 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-300/30 dark:border-slate-800/30 w-fit">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages || 1 }, (_, idx) => idx + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === num
                        ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 shadow-sm"
                        : "text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5 dark:border-slate-800/60">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {editingProject? "Edit Project Parameters" : "Provision New Identity"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={submitLoading}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors disabled:opacity-30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Code</label>
                  <input
                    type="text"
                    name="projectCode"
                    required
                    disabled={submitLoading}
                    placeholder="PRJ-001"
                    value={formData.projectCode}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    required
                    disabled={submitLoading}
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white disabled:opacity-50"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    disabled={submitLoading}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white resize-none disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    disabled={submitLoading}
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    disabled={submitLoading}
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
                  <select
                    name="status"
                    disabled={submitLoading}
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white disabled:opacity-50"
                  >
                    <option value="NOT_STARTED" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Not Started</option>
                    <option value="IN_PROGRESS" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">In Progress</option>
                    <option value="COMPLETED" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Completed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority</label>
                  <select
                    name="priority"
                    disabled={submitLoading}
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700 dark:text-white disabled:opacity-50"
                  >
                    <option value="LOW" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Low</option>
                    <option value="MEDIUM" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Medium</option>
                    <option value="HIGH" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">High</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitLoading}
                  className="rounded-xl border border-slate-300 px-4.5 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-all disabled:opacity-70 dark:bg-slate-50 dark:text-slate-950"
                >
                  {submitLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Commit Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 border border-red-200/20 dark:bg-red-500/20 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Purge Portfolio Track
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Are you absolutely certain you want to destroy this project tracking cluster? Operational actions cannot be reverted.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => { setIsDeleteOpen(false); setTargetDeleteId(null); }}
                disabled={deleteLoading}
                className="rounded-xl border-slate-300 px-4.5 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExecute}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-all shadow-sm disabled:opacity-70"
              >
                {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Purge Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal Connection */}
      {assignmentTargetProject && (
        <ProjectAssignmentModal
          project={assignmentTargetProject}
          onClose={() => setAssignmentTargetProject(null)}
          onRefreshProjectList={fetchProjects}
        />
      )}
    </div>
  );
}