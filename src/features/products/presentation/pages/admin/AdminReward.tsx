import { useState } from "react";
import {
  Gift,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Loader2,
  Coins,
} from "lucide-react";
import { useAdminReward } from "../../../application/useAdminReward";
import type {
  RewardResponseData,
  CreateRewardInput,
} from "../../../application/useAdminReward";

const defaultFormState: CreateRewardInput = {
  name: "",
  description: "",
  pointsCost: 0,
  discountAmount: 0,
  isActive: true,
};

export function AdminReward() {
  const {
    rewards,
    isLoading,
    createReward,
    updateReward,
    deleteReward,
    toggleStatus,
  } = useAdminReward();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CreateRewardInput>(defaultFormState);

  // --- Thống kê ---
  const activeRewardsCount = rewards.filter((r) => r.isActive).length;

  const handleOpenCreate = () => {
    setIsEditing(null);
    setEditForm(defaultFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reward: RewardResponseData) => {
    setIsEditing(reward.id);
    setEditForm({
      name: reward.name,
      description: reward.description,
      pointsCost: reward.pointsCost,
      discountAmount: reward.discountAmount,
      isActive: reward.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateReward({ id: isEditing, data: editForm });
      } else {
        await createReward(editForm);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phần thưởng này?")) {
      await deleteReward(id);
    }
  };

  return (
  <div>
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Loyalty Rewards
            </h3>
            <p className="text-gray-500">
              Quản lý các phần thưởng đổi điểm của khách hàng
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Thêm Phần Thưởng
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-lg text-green-600">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Rewards</p>
              <p className="text-3xl font-bold text-gray-900">
                {activeRewardsCount}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-lg text-blue-600">
              <Coins className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Total Rewards Catalog
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {rewards.length}
              </p>
            </div>
          </div>
        </div>

        {/* Rewards List */}
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
                    Thông tin phần thưởng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Điểm đổi (Points)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Giá trị (VND)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${reward.isActive ? "bg-amber-100" : "bg-gray-100"}`}
                        >
                          <Gift
                            className={`w-5 h-5 ${reward.isActive ? "text-amber-600" : "text-gray-400"}`}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">
                            {reward.name}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1">
                            {reward.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Coins className="w-4 h-4" />
                        {reward.pointsCost.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-blue-600">
                        {reward.discountAmount > 0
                          ? `${reward.discountAmount.toLocaleString()}đ`
                          : "Miễn phí dịch vụ"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(reward)}
                        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        {reward.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${reward.isActive ? "text-green-600" : "text-gray-500"}`}
                        >
                          {reward.isActive ? "Kích hoạt" : "Vô hiệu"}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(reward)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reward.id)}
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

      {/* Form Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Chỉnh sửa phần thưởng" : "Thêm phần thưởng mới"}
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
                  Tên phần thưởng
                </label>
                <input
                  required
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="VD: Voucher 50k"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  required
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                  placeholder="Mô tả chi tiết phần thưởng..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Điểm cần đổi (Points)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={editForm.pointsCost || 0}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        pointsCost: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá trị quy đổi (VND)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={editForm.discountAmount || 0}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        discountAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nhập 0 nếu quy đổi dịch vụ"
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
                  Kích hoạt phần thưởng ngay lập tức
                </label>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  {isEditing ? "Lưu thay đổi" : "Tạo phần thưởng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  </div>
  );
}
