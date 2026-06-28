import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useAdminPromotion } from "../../../application/useAdminPromotion";
import type {
  PromotionResponseData,
  CreatePromotionInput,
} from "../../../application/useAdminPromotion";

const defaultFormState: CreatePromotionInput = {
  code: "",
  description: "",
  discountType: "Percentage",
  discountValue: 0,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  maxUses: null,
  minSpend: null,
  isActive: true,
};

export function AdminPromotions() {
  const {
    promotions,
    isLoading,
    createPromotion,
    updatePromotion,
    deletePromotion,
    toggleStatus,
  } = useAdminPromotion();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] =
    useState<CreatePromotionInput>(defaultFormState);

  // --- Xử lý tính toán thống kê (Dựa trên dữ liệu thật) ---
  const activePromosCount = promotions.filter((p) => p.isActive).length;
  const totalRedeemed = promotions.reduce(
    (acc, curr) => acc + curr.usedCount,
    0,
  );

  const handleOpenCreate = () => {
    setIsEditing(null);
    setEditForm(defaultFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo: PromotionResponseData) => {
    setIsEditing(promo.id);
    setEditForm({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      startDate: promo.startDate.split("T")[0],
      endDate: promo.endDate.split("T")[0],
      maxUses: promo.maxUses,
      minSpend: promo.minSpend,
      isActive: promo.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updatePromotion({ id: isEditing, data: editForm });
      } else {
        await createPromotion(editForm);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      await deletePromotion(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Layout title="Promotions Management" userName="Admin" role="admin">
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Campaigns</h3>
            <p className="text-gray-500">
              Create and manage marketing promotions
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            New Promotion
          </button>
        </div>

        {/* Promotion Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Active Promotions</p>
            <p className="text-3xl font-bold text-gray-900">
              {activePromosCount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Redeemed</p>
            <p className="text-3xl font-bold text-blue-600">{totalRedeemed}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Campaigns</p>
            <p className="text-3xl font-bold text-green-600">
              {promotions.length}
            </p>
          </div>
        </div>

        {/* Promotions List */}
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
                    Code & Info
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Type / Value
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Usage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Expiry
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {promotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${promo.isActive ? "bg-blue-100" : "bg-gray-100"}`}
                        >
                          <Megaphone
                            className={`w-5 h-5 ${promo.isActive ? "text-blue-600" : "text-gray-400"}`}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">
                            {promo.code}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1">
                            {promo.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium w-max mb-1">
                          {promo.discountType}
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {promo.discountType === "Percentage"
                            ? `${promo.discountValue}%`
                            : `${promo.discountValue.toLocaleString()}đ`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(promo)}
                        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        {promo.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${promo.isActive ? "text-green-600" : "text-gray-500"}`}
                        >
                          {promo.isActive ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {promo.usedCount} / {promo.maxUses ? promo.maxUses : "∞"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(promo.endDate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(promo)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Cập nhật Form Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Campaign" : "New Campaign"}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Promo Code
                </label>
                <input
                  required
                  type="text"
                  value={editForm.code}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  placeholder="e.g. SUMMER20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={2}
                  placeholder="Mô tả chiến dịch..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={editForm.discountType}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        discountType: e.target.value as
                          | "Percentage"
                          | "FixedAmount",
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="FixedAmount">Fixed Amount (VND)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Value
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={editForm.discountValue || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        discountValue: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="20 hoặc 50000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Spend (VND)
                  </label>
                  <input
                    type="number"
                    value={editForm.minSpend || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        minSpend: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Không bắt buộc"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    value={editForm.maxUses || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        maxUses: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Không giới hạn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    required
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  Kích hoạt chiến dịch ngay lập tức
                </label>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  {isEditing ? "Save Changes" : "Launch Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
