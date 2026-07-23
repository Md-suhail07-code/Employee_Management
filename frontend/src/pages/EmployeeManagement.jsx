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
} from "lucide-react";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination State
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
      joiningDate: employee.joiningDate
        ? employee.joiningDate.split("T")[0]
        : "",
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

  // Trigger Shadcn style Confirmation Dialog Modal
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
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination Calculus Engine[cite: 1]
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);

  // Reset page position to index 1 if search criteria mutates indices scope
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* View Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Employees
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage directory records, permissions, and roles.[cite: 1]
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-50 transition hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      {/* Action Utilities Filtering Bar */}
      <div className="flex items-center max-w-md relative">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Data Views Scaffolding */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Designation</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Joining Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {currentRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-slate-50">
                          {emp.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {emp.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {emp.department}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {emp.designation}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {emp.phone}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {emp.joiningDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEditModal(emp)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(emp.id)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
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

          {/* Pagination Footer Controls Component */}
          {filteredEmployees.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {indexOfFirstRow + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {Math.min(indexOfLastRow, totalItems)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {totalItems}
                </span>{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages || 1),
                    )
                  }
                  disabled={currentPage === totalPages || totalPages <= 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Unified Action Create/Edit Overlay Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {editingEmployee
                  ? "Edit Employee Details"
                  : "Create New Employee Account"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-slate-800 dark:text-white"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-slate-800 dark:text-white"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Password {editingEmployee && "(Optional)"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    required={!editingEmployee}
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-slate-800 dark:text-white"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="e.g. IT"
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-slate-800 dark:text-white"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    required
                    placeholder="e.g. Software Engineer"
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-slate-800 dark:text-white"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-slate-800 dark:text-white"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-slate-800 dark:text-white"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Shadcn style Confirm Delete Dialog Alternative to window.confirm */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md scale-100 rounded-xl border border-slate-200 bg-white p-6 shadow-xl transition-transform dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Delete Employee Account
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Are you sure you want to completely erase this user profile
                  from the database[cite: 1]? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setTargetDeleteId(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExecute}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
