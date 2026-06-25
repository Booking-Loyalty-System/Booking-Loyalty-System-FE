import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";
import {
  useBranch,
  type BranchResponseData,
} from "../../../application/useAdminBranch";

export function AdminBranches() {
  const {
    branches,
    isLoading,
    createBranch,
    updateBranch,
    deleteBranch,
    toggleStatus,
  } = useBranch();

  // State chỉ còn dùng để quản lý Form (UI)
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Partial<BranchResponseData> | null>(
    null,
  );

  const handleEdit = (branch: BranchResponseData) => {
    setIsEditing(branch.id);
    setEditForm({ ...branch });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      branchName: "",
      address: "",
      hotline: "",
      operatingHours: "8am-8pm",
      status: "Active",
    });
  };

  const handleSave = async () => {
    if (editForm && isEditing) {
      await updateBranch({
        id: isEditing,
        data: {
          branchName: editForm.branchName!,
          address: editForm.address!,
          hotline: editForm.hotline!,
          operatingHours: editForm.operatingHours!,
          status: editForm.status as "Active" | "Inactive",
        },
      });
      handleCancel();
    }
  };

  const handleCreate = async () => {
    if (editForm && editForm.branchName && editForm.address) {
      await createBranch({
        branchName: editForm.branchName,
        address: editForm.address,
        hotline: editForm.hotline || "",
        operatingHours: editForm.operatingHours || "8am-8pm",
      });
      handleCancel();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      await deleteBranch(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setEditForm(null);
  };

  return (
    <Layout title="Branch Management" userName="Admin" role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">
              Manage all car wash branches locations
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Branch
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading branches...</p>
          </div>
        ) : (
          /* Branches Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className={`bg-white rounded-xl border-2 p-6 transition-all ${
                  branch.status === "Active"
                    ? "border-blue-200 shadow-sm"
                    : "border-gray-200 opacity-60"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(branch)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(branch.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {branch.branchName}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 line-clamp-2">
                      {branch.address}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {branch.hotline}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Hours: {branch.operatingHours}
                    </span>
                  </div>
                </div>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleStatus(branch)}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    branch.status === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {branch.status === "Active" ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {(isEditing || isAdding) && editForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                {isAdding ? "Add New Branch" : "Edit Branch"}
              </h4>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={editForm.branchName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, branchName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Quận 9 Branch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotline
                  </label>
                  <input
                    type="text"
                    value={editForm.hotline}
                    onChange={(e) =>
                      setEditForm({ ...editForm, hotline: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={editForm.operatingHours}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        operatingHours: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 8am-8pm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={isAdding ? handleCreate : handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isAdding ? "Create Branch" : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
