import React, { useState, useEffect } from "react";
import { employeeService } from "../api/employee";
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
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Users
} from "lucide-react";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination State[cite: 1]
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Configured row limit per view index page[cite: 1]

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    phone: "",
    joiningDate: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError("Failed to fetch employee list.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      department: "",
      designation: "",
      phone: "",
      joiningDate: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      password: "",
      department: employee.department,
      designation: employee.designation,
      phone: employee.phone,
      joiningDate: employee.joiningDate ? employee.joiningDate.split("T")[0] : "",
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
      if (editingEmployee) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await employeeService.update(editingEmployee.id, payload);
      } else {
        await employeeService.create(formData);
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Error executing action.");
    }
  };

  const confirmDelete = (id) => {
    setTargetDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!targetDeleteId) return;
    try {
      await employeeService.delete(targetDeleteId);
      setIsDeleteOpen(false);
      setTargetDeleteId(null);
      fetchEmployees();
    } catch (err) {
      setError("Failed to delete user account.");
      setIsDeleteOpen(false);
    }
  };

  // Dynamic filter for search handling[cite: 1]
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Calculus Engine[cite: 1]
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-8 p-1">
      {/* Premium Header Architecture */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900/5 dark:bg-slate-50/5 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
              <Users className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-slate-50 dark:via-slate-300 dark:to-slate-50">
              Employees
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Manage corporate directory assets, access credentials, and department placements.[cite: 1]
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4.5 py-2.5 text-sm font-semibold text-slate-50 shadow-md transition-all duration-200 hover:bg-slate-800 hover:shadow-lg active:scale-95 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" /> Add Employee
        </button>
      </div>

      {/* Sleek Glassmorphic Search Container */}
      <div className="flex items-center max-w-md relative group">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-slate-50" />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-2.5 pl-11 pr-4 text-sm outline-none backdrop-blur-md transition-all placeholder:text-slate-400/80 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800/80 dark:bg-slate-950/40 dark:focus:border-slate-700 dark:focus:bg-slate-950 dark:focus:ring-slate-50/5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Designation</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Joining Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center font-medium text-slate-400 bg-white/[0.02]">
                      No organizational records discovered.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((emp) => (
                    <tr
                      key={emp.id}
                      className="group transition-colors duration-150 hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01]"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {emp.name}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400 font-medium">
                          <Mail className="h-3 w-3" /> {emp.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/30 dark:border-slate-700/30">
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                          {emp.designation}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs tracking-tight">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {emp.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {emp.joiningDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(emp)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-900/5 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-50 transition-all"
                          >
                            <Edit2 className="h-4 w-4 stroke-[2]" />
                          </button>
                          <button
                            onClick={() => confirmDelete(emp.id)}
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

          {/* Premium Pagination Architecture */}
          {filteredEmployees.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/60 bg-slate-900/[0.01] px-6 py-4 dark:border-slate-800/60 dark:bg-white/[0.01]">
              <div className="text-xs font-semibold tracking-wide uppercase text-slate-400/90 text-center sm:text-left">
                Records: <span className="font-bold text-slate-700 dark:text-slate-300">{indexOfFirstRow + 1}</span> to{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {Math.min(indexOfLastRow, totalItems)}
                </span>{" "}
                — Total Employees: <span className="font-bold text-slate-700 dark:text-slate-300">{totalItems}</span>
              </div>
              
              <div className="flex items-center justify-center gap-1 bg-slate-200/40 dark:bg-slate-900/60 p-1 rounded-xl w-fit mx-auto sm:mx-0 border border-slate-300/30 dark:border-slate-800/30">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg text-xs font-bold text-slate-600 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:pointer-events-none disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1 stroke-[2.5]" /> Prev
                </button>
                
                {Array.from({ length: totalPages || 1 }, (_, idx) => idx + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === pageNumber
                        ? "bg-slate-900 text-slate-50 shadow-sm dark:bg-slate-50 dark:text-slate-900"
                        : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }`}
                  >
                    {pageNumber}
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
                {editingEmployee ? "Modify Staff Parameters" : "Provision New Identity Profile"}
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
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Password {editingEmployee && "(Static)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    required={!editingEmployee}
                    placeholder={editingEmployee ? "••••••••" : ""}
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Department</label>
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="e.g. IT"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    required
                    placeholder="e.g. Software Engineer"
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white/50 px-3.5 py-2 text-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:focus:border-slate-700"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                  />
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
                  Commit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Shadcn style Confirm Delete Glassmorphic Dialog Component */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 border border-red-200/20 dark:bg-red-500/20 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Deprovision Profile
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you absolutely certain you want to purge this structural identity index from the server core[cite: 1]? This operational destruction is completely irreversible.
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
                Abort
              </button>
              <button
                type="button"
                onClick={handleDeleteExecute}
                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}