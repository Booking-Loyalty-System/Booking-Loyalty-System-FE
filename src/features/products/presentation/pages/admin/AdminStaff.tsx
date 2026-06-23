import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";

const BRANCHES = [
  { id: "all", name: "All Branches" },
  { id: "D1", name: "District 1" },
  { id: "D7", name: "District 7" },
  { id: "TD", name: "Thu Duc" },
  { id: "TB", name: "Tan Binh" },
];

const BRANCH_COLORS: Record<string, string> = {
  D1: "bg-indigo-100 text-indigo-700",
  D7: "bg-amber-100 text-amber-700",
  TD: "bg-emerald-100 text-emerald-700",
  TB: "bg-rose-100 text-rose-700",
};

const BRANCH_DOT: Record<string, string> = {
  D1: "bg-indigo-500",
  D7: "bg-amber-500",
  TD: "bg-emerald-500",
  TB: "bg-rose-500",
};

const initialStaff = [
  // District 1
  {
    id: 1,
    branch: "D1",
    name: "Alex Johnson",
    role: "Manager",
    email: "alex@autowash.com",
    phone: "+84 901-001-001",
    status: "Active",
    joined: "2025-10-15",
  },
  {
    id: 2,
    branch: "D1",
    name: "Sarah Miller",
    role: "Technician",
    email: "sarah@autowash.com",
    phone: "+84 901-001-002",
    status: "Active",
    joined: "2025-11-20",
  },
  {
    id: 3,
    branch: "D1",
    name: "Mike Ross",
    role: "Technician",
    email: "mike@autowash.com",
    phone: "+84 901-001-003",
    status: "On Leave",
    joined: "2026-01-05",
  },
  {
    id: 4,
    branch: "D1",
    name: "Emily Chen",
    role: "Staff",
    email: "emily@autowash.com",
    phone: "+84 901-001-004",
    status: "Active",
    joined: "2026-03-12",
  },
  // District 7
  {
    id: 5,
    branch: "D7",
    name: "James Nguyen",
    role: "Manager",
    email: "james@autowash.com",
    phone: "+84 901-007-001",
    status: "Active",
    joined: "2025-09-01",
  },
  {
    id: 6,
    branch: "D7",
    name: "Linda Pham",
    role: "Technician",
    email: "linda@autowash.com",
    phone: "+84 901-007-002",
    status: "Active",
    joined: "2025-12-10",
  },
  {
    id: 7,
    branch: "D7",
    name: "Kevin Tran",
    role: "Staff",
    email: "kevin@autowash.com",
    phone: "+84 901-007-003",
    status: "Active",
    joined: "2026-02-14",
  },
  // Thu Duc
  {
    id: 8,
    branch: "TD",
    name: "Hana Le",
    role: "Manager",
    email: "hana@autowash.com",
    phone: "+84 901-088-001",
    status: "Active",
    joined: "2025-11-05",
  },
  {
    id: 9,
    branch: "TD",
    name: "Tommy Vo",
    role: "Technician",
    email: "tommy@autowash.com",
    phone: "+84 901-088-002",
    status: "On Leave",
    joined: "2026-01-20",
  },
  {
    id: 10,
    branch: "TD",
    name: "Cindy Do",
    role: "Staff",
    email: "cindy@autowash.com",
    phone: "+84 901-088-003",
    status: "Active",
    joined: "2026-04-01",
  },
  // Tan Binh
  {
    id: 11,
    branch: "TB",
    name: "Robert Hoang",
    role: "Manager",
    email: "robert@autowash.com",
    phone: "+84 901-010-001",
    status: "Active",
    joined: "2025-10-30",
  },
  {
    id: 12,
    branch: "TB",
    name: "Sophia Dang",
    role: "Technician",
    email: "sophia@autowash.com",
    phone: "+84 901-010-002",
    status: "Active",
    joined: "2026-01-15",
  },
  {
    id: 13,
    branch: "TB",
    name: "Nathan Bui",
    role: "Staff",
    email: "nathan@autowash.com",
    phone: "+84 901-010-003",
    status: "Active",
    joined: "2026-03-25",
  },
];

type BranchFilter = "all" | "D1" | "D7" | "TD" | "TB";

export function AdminStaff() {
  const [staff, setStaff] = useState(initialStaff);
  const [selectedBranch, setSelectedBranch] = useState<BranchFilter>("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "Staff",
    email: "",
    phone: "",
    branch: "D1",
  });

  const filtered =
    selectedBranch === "all"
      ? staff
      : staff.filter((s) => s.branch === selectedBranch);

  const branchCounts = BRANCHES.filter((b) => b.id !== "all").map((b) => ({
    ...b,
    total: staff.filter((s) => s.branch === b.id).length,
    active: staff.filter((s) => s.branch === b.id && s.status === "Active")
      .length,
  }));

  const handleDelete = (id: number) =>
    setStaff((prev) => prev.filter((s) => s.id !== id));

  const handleAdd = () => {
    if (!newMember.name || !newMember.email) return;
    setStaff((prev) => [
      ...prev,
      {
        id: Date.now(),
        branch: newMember.branch,
        name: newMember.name,
        role: newMember.role,
        email: newMember.email,
        phone: newMember.phone || "—",
        status: "Active",
        joined: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewMember({
      name: "",
      role: "Staff",
      email: "",
      phone: "",
      branch: "D1",
    });
    setIsAdding(false);
  };

  return (
    <Layout title="Staff Management" userName="Admin" role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Employees</h3>
            <p className="text-gray-500">
              Manage team members across all branches
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" /> Add New Member
          </button>
        </div>

        {/* Branch Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {branchCounts.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id as BranchFilter)}
              className={`bg-white rounded-xl p-5 border-2 text-left transition-all hover:shadow-md ${
                selectedBranch === b.id
                  ? "border-blue-600 shadow-md"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${BRANCH_DOT[b.id]}`}
                ></span>
                <span className="font-semibold text-gray-800 text-sm">
                  {b.name}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{b.total}</p>
              <p className="text-sm text-gray-500">
                <span className="text-green-600 font-medium">
                  {b.active} active
                </span>
                {b.total - b.active > 0 && (
                  <span className="text-orange-500 font-medium">
                    {" "}
                    · {b.total - b.active} on leave
                  </span>
                )}
              </p>
            </button>
          ))}
        </div>

        {/* Branch Filter Tabs */}
        <div className="bg-white rounded-xl p-2 border border-gray-200 shadow-sm flex gap-1 flex-wrap">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id as BranchFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                selectedBranch === b.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {b.id !== "all" && <MapPin className="w-3.5 h-3.5" />}
              {b.name}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  selectedBranch === b.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {b.id === "all"
                  ? staff.length
                  : staff.filter((s) => s.branch === b.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Name & Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Branch
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((member) => {
                const branchName =
                  BRANCHES.find((b) => b.id === member.branch)?.name ??
                  member.branch;
                return (
                  <tr key={member.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {member.name}
                          </p>
                          <div className="flex flex-col text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {member.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {member.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${BRANCH_COLORS[member.branch]}`}
                      >
                        <MapPin className="w-3 h-3" /> {branchName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">
                          {member.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {member.status === "Active" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-orange-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${member.status === "Active" ? "text-green-600" : "text-orange-600"}`}
                        >
                          {member.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {member.joined}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p>No staff found for this branch.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">
              New Team Member
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    placeholder="e.g. John Smith"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) =>
                      setNewMember({ ...newMember, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Staff</option>
                    <option>Technician</option>
                    <option>Manager</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Branch
                </label>
                <select
                  value={newMember.branch}
                  onChange={(e) =>
                    setNewMember({ ...newMember, branch: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="D1">District 1</option>
                  <option value="D7">District 7</option>
                  <option value="TD">Thu Duc</option>
                  <option value="TB">Tan Binh</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  placeholder="john@autowash.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                  placeholder="+84 901-000-000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
