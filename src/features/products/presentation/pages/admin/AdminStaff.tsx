// src/features/products/presentation/pages/admin/AdminStaff.tsx
import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  Users,
  Shield,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  MapPin,
  Loader2,
} from "lucide-react";
import { useAdminUser } from "../../../application/useAdminUser"; // Cập nhật đường dẫn đúng của bạn
import type { UserResponseData } from "../../../domain/models/admin-user/admin-user.model";

// Giữ lại cấu trúc các Chi nhánh (Branch) tĩnh phục vụ cho UI filter nếu Backend chưa trả về Branch kèm User
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

type BranchFilter = "all" | "D1" | "D7" | "TD" | "TB";

export function AdminStaff() {
  // Gọi Hook lấy data thật từ API (Lọc sẵn role Staff hoặc truyền trống tùy theo thiết kế API)
  const { users, isLoading, updateStatus } = useAdminUser("Staff");
  const [selectedBranch, setSelectedBranch] = useState<BranchFilter>("all");

  // Giả lập map branch tạm thời nếu Backend chưa hỗ trợ lưu thực tế trường branchId trên User
  const mockStaffWithBranch = users.map(
    (user: UserResponseData, index: number) => {
      const branchIds: BranchFilter[] = ["D1", "D7", "TD", "TB"];
      return {
        ...user,
        branch: user.branchId || branchIds[index % branchIds.length],
        joined: "2026-01-15", // Mock ngày tham gia tạm thời
      };
    },
  );

  // Lọc theo chi nhánh được chọn
  const filtered =
    selectedBranch === "all"
      ? mockStaffWithBranch
      : mockStaffWithBranch.filter((s) => s.branch === selectedBranch);

  // Tính toán số lượng cho các tóm tắt thẻ (Summary Cards)
  const branchCounts = BRANCHES.filter((b) => b.id !== "all").map((b) => ({
    ...b,
    total: mockStaffWithBranch.filter((s) => s.branch === b.id).length,
    active: mockStaffWithBranch.filter(
      (s) => s.branch === b.id && s.status === "Active",
    ).length,
  }));

  const handleToggleStatus = async (
    id: string,
    currentStatus: "Active" | "Inactive",
  ) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    if (
      confirm(
        `Bạn có chắc chắn muốn chuyển trạng thái nhân viên sang ${nextStatus}?`,
      )
    ) {
      await updateStatus({ id, status: nextStatus });
    }
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
                    · {b.total - b.active} inactive
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
                  ? mockStaffWithBranch.length
                  : mockStaffWithBranch.filter((s) => s.branch === b.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
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
                            {member.fullName ? member.fullName.charAt(0) : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {member.fullName}
                            </p>
                            <div className="flex flex-col text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {member.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />{" "}
                                {member.phoneNumber || "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${BRANCH_COLORS[member.branch] || "bg-gray-100"}`}
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
                        <button
                          onClick={() =>
                            handleToggleStatus(member.id, member.status)
                          }
                          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                        >
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
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {member.joined}
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-gray-400">
                        {/* Hành động tùy chỉnh thêm nếu cần */}—
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
          )}
        </div>
      </div>
    </Layout>
  );
}
