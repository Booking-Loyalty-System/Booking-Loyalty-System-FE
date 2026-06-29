import { useState } from "react";
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Gift,
  Star,
  Crown,
  Gem,
  Calendar,
  TrendingUp,
  Shield,
} from "lucide-react";
import {
  useAdminLoyalty,
  type AdminTierResponseData,
  type CreateAdminTierInput,
} from "../../../application/useAdminLoyalty";
import {
  useAdminReward,
  type AdminRewardResponseData,
  type CreateAdminRewardInput,
} from "../../../application/useAdminReward";

const tierIcons: Record<string, typeof Award> = {
  Bronze: Award,
  Silver: Star,
  Gold: Crown,
  Diamond: Gem,
};

const tierStyles: Record<string, { bg: string; icon: string; border: string; text: string; badge: string }> = {
  Bronze: { bg: "bg-amber-50/60", icon: "text-amber-600", border: "border-amber-100", text: "text-amber-900", badge: "bg-amber-100 text-amber-800" },
  Silver: { bg: "bg-slate-50", icon: "text-slate-500", border: "border-slate-200", text: "text-slate-900", badge: "bg-slate-100 text-slate-800" },
  Gold: { bg: "bg-yellow-50/60", icon: "text-yellow-600", border: "border-yellow-200/80", text: "text-yellow-900", badge: "bg-yellow-100 text-yellow-800" },
  Diamond: { bg: "bg-purple-50/60", icon: "text-purple-600", border: "border-purple-200/60", text: "text-purple-900", badge: "bg-purple-100 text-purple-800" },
};

const emptyTierForm: CreateAdminTierInput = {
  tierName: "",
  level: "",
  pointRate: 1,
  bookingWindow: 7,
  minPointsRequired: 0,
  maintenancePoints: 0,
};

const emptyRewardForm: CreateAdminRewardInput = {
  name: "",
  description: "",
  pointsCost: 0,
  discountAmount: 0,
};

function getTierStyle(level: string) {
  return tierStyles[level] ?? {
    bg: "bg-blue-50/60",
    icon: "text-blue-600",
    border: "border-blue-100",
    text: "text-blue-900",
    badge: "bg-blue-100 text-blue-800",
  };
}

function getTierIcon(level: string) {
  return tierIcons[level] ?? Award;
}

export function AdminLoyalty() {
  const {
    tiers,
    isLoading,
    createTier,
    updateTier,
    deleteTier,
    isUpdating,
    isCreating,
  } = useAdminLoyalty();

  const {
    rewards,
    isLoading: isLoadingRewards,
    createReward,
    updateReward,
    deleteReward,
    toggleStatus,
    isCreating: isCreatingReward,
    isUpdating: isUpdatingReward,
  } = useAdminReward();

  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CreateAdminTierInput | null>(null);
  const [isAddingTier, setIsAddingTier] = useState(false);

  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [rewardForm, setRewardForm] = useState<
    (CreateAdminRewardInput & { isActive?: boolean }) | null
  >(null);
  const [isAddingReward, setIsAddingReward] = useState(false);

  const handleEditTier = (tier: AdminTierResponseData) => {
    setEditingTierId(tier.id);
    setEditForm({
      tierName: tier.tierName,
      level: tier.level,
      pointRate: tier.pointRate,
      bookingWindow: tier.bookingWindow,
      minPointsRequired: tier.minPointsRequired,
      maintenancePoints: tier.maintenancePoints,
    });
  };

  const handleSaveTier = async () => {
    if (editForm && editingTierId) {
      await updateTier({ id: editingTierId, data: editForm });
      handleCancelTier();
    }
  };

  const handleCreateTier = async () => {
    if (editForm && editForm.tierName && editForm.level) {
      await createTier(editForm);
      handleCancelTier();
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa hạng thành viên này?")) {
      await deleteTier(id);
    }
  };

  const handleCancelTier = () => {
    setEditingTierId(null);
    setIsAddingTier(false);
    setEditForm(null);
  };

  const handleAddTier = () => {
    setIsAddingTier(true);
    setEditForm({ ...emptyTierForm });
  };

  const handleEditReward = (reward: AdminRewardResponseData) => {
    setEditingRewardId(reward.id);
    setRewardForm({
      name: reward.name,
      description: reward.description,
      pointsCost: reward.pointsCost,
      discountAmount: reward.discountAmount,
      isActive: reward.isActive,
    });
  };

  const handleCreateReward = async () => {
    if (rewardForm && rewardForm.name) {
      await createReward({
        name: rewardForm.name,
        description: rewardForm.description,
        pointsCost: rewardForm.pointsCost,
        discountAmount: rewardForm.discountAmount,
      });
      handleCancelReward();
    }
  };

  const handleSaveReward = async () => {
    if (rewardForm && editingRewardId) {
      await updateReward({
        id: editingRewardId,
        data: {
          name: rewardForm.name,
          description: rewardForm.description,
          pointsCost: rewardForm.pointsCost,
          discountAmount: rewardForm.discountAmount,
          isActive: rewardForm.isActive ?? true,
        },
      });
      handleCancelReward();
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa phần thưởng này?")) {
      await deleteReward(id);
    }
  };

  const handleCancelReward = () => {
    setEditingRewardId(null);
    setIsAddingReward(false);
    setRewardForm(null);
  };

  const handleAddReward = () => {
    setIsAddingReward(true);
    setRewardForm({ ...emptyRewardForm });
  };

  const updateRewardField = <
    K extends keyof (CreateAdminRewardInput & { isActive?: boolean }),
  >(
    field: K,
    value: (CreateAdminRewardInput & { isActive?: boolean })[K],
  ) => {
    if (rewardForm) {
      setRewardForm({ ...rewardForm, [field]: value });
    }
  };

  const updateEditField = <K extends keyof CreateAdminTierInput>(
    field: K,
    value: CreateAdminTierInput[K],
  ) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  return (
    <div className="p-8 space-y-12 bg-slate-50/50 min-h-screen font-sans antialiased">
      <div className="max-w-[1600px] mx-auto space-y-12">
        
        {/* ========================================================================= */}
        {/* Tier Configuration Section */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" /> Hạng thành viên
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Quản lý quy tắc tích điểm, đặt trước và điều kiện duy trì thứ hạng khách hàng
              </p>
            </div>
            <button
              onClick={handleAddTier}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm shadow-indigo-100 hover:shadow-md transition-all duration-200 group self-start sm:self-center"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Thêm hạng mới
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">Đang tải cấu hình hạng thành viên...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => {
                const Icon = getTierIcon(tier.level);
                const style = getTierStyle(tier.level);
                const isEditing = editingTierId === tier.id;

                return (
                  <div
                    key={tier.id}
                    className={`bg-white rounded-2xl border p-6 transition-all duration-300 hover:shadow-md relative flex flex-col justify-between overflow-hidden group ${style.border}`}
                  >
                    {/* Decorative subtle background node */}
                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-125 ${style.bg}`} />

                    <div>
                      <div className="flex items-center justify-between mb-5 relative z-10">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner ${style.bg}`}>
                          <Icon className={`w-5 h-5 ${style.icon}`} />
                        </div>
                        <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                          {!isEditing ? (
                            <>
                              <button
                                onClick={() => handleEditTier(tier)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-white transition-all"
                                title="Chỉnh sửa"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTier(tier.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-white transition-all"
                                title="Xóa hạng"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={handleSaveTier}
                                disabled={isUpdating}
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-md hover:bg-white transition-all disabled:opacity-50"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleCancelTier}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-white transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {isEditing && editForm ? (
                        <div className="space-y-3.5 mt-2">
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tên hạng</label>
                            <input
                              type="text"
                              value={editForm.tierName}
                              onChange={(e) => updateEditField("tierName", e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Level định danh</label>
                            <input
                              type="text"
                              value={editForm.level}
                              onChange={(e) => updateEditField("level", e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Hệ số điểm</label>
                              <input
                                type="number"
                                value={editForm.pointRate}
                                onChange={(e) => updateEditField("pointRate", parseFloat(e.target.value) || 0)}
                                step="0.1"
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Đặt trước (ngày)</label>
                              <input
                                type="number"
                                value={editForm.bookingWindow}
                                onChange={(e) => updateEditField("bookingWindow", parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative z-10">
                          <div className="flex items-baseline gap-2 mb-1">
                            <h4 className="text-xl font-bold text-slate-800 tracking-tight">
                              {tier.tierName}
                            </h4>
                            <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full uppercase tracking-wider ${style.badge}`}>
                              {tier.level}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mb-5">ID định danh hệ thống</p>
                          
                          <div className="space-y-3.5 text-sm border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <TrendingUp className="w-4 h-4 text-indigo-500" /> Hệ số điểm
                              </span>
                              <span className="font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-xs">
                                {tier.pointRate}x / 1kđ
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <Calendar className="w-4 h-4 text-emerald-500" /> Hạn đặt trước
                              </span>
                              <span className="font-semibold text-slate-800 text-xs">
                                {tier.bookingWindow} ngày
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <Award className="w-4 h-4 text-amber-500" /> Điểm tối thiểu
                              </span>
                              <span className="font-bold text-indigo-600 text-xs">
                                {tier.minPointsRequired.toLocaleString()} pts
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                <Shield className="w-4 h-4 text-purple-500" /> Điểm duy trì
                              </span>
                              <span className="font-semibold text-slate-700 text-xs">
                                {tier.maintenancePoints.toLocaleString()} pts / 90n
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isEditing && tier.benefits?.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Đặc quyền kèm theo</p>
                        <ul className="space-y-1.5">
                          {tier.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                              <span className="line-clamp-2">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* Rewards Management Section */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" /> Phần thưởng đổi điểm
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Thiết lập hệ thống quà tặng và giá trị quy đổi voucher khi thành viên đạt đủ số điểm tích lũy
              </p>
            </div>
            <button
              onClick={handleAddReward}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-sm shadow-emerald-100 hover:shadow-md transition-all duration-200 group self-start sm:self-center"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Thêm phần thưởng
            </button>
          </div>

          {isLoadingRewards ? (
            <div className="flex flex-col justify-center items-center py-16 space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">Đang tải danh sách phần thưởng công khai...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Tên phần thưởng</th>
                    <th className="px-6 py-4 font-semibold">Mô tả hiển thị</th>
                    <th className="px-6 py-4 font-semibold text-center">Chi phí quy đổi</th>
                    <th className="px-6 py-4 font-semibold">Giá trị giảm giá</th>
                    <th className="px-6 py-4 font-semibold text-center">Trạng thái áp dụng</th>
                    <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {rewards.map((reward) => (
                    <tr key={reward.id} className="hover:bg-slate-50/60 transition-colors duration-150 group">
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100/50 shadow-inner">
                            <Gift className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-semibold text-slate-900 tracking-tight">
                            {reward.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-slate-500 max-w-xs truncate">
                        {reward.description || <span className="text-slate-300 italic">Chưa có mô tả</span>}
                      </td>
                      <td className="px-6 py-4.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200/50 shadow-sm">
                          {reward.pointsCost.toLocaleString()} pts
                        </span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap font-medium text-slate-800">
                        {reward.discountAmount > 0 ? (
                          <span className="text-slate-900 font-semibold bg-slate-100 px-2 py-1 rounded border border-slate-200/40">
                            {reward.discountAmount.toLocaleString("vi-VN")}đ
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(reward)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 border shadow-sm ${
                            reward.isActive
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          {reward.isActive ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Hoạt động
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Tạm dừng
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditReward(reward)}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReward(reward.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors"
                            title="Xóa phần thưởng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ========================================================================= */}
      {/* Add Tier Modal Component */}
      {/* ========================================================================= */}
      {isAddingTier && editForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                Thêm hạng thành viên mới
              </h4>
              <button
                onClick={handleCancelTier}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tên hiển thị hạng</label>
                <input
                  type="text"
                  value={editForm.tierName}
                  onChange={(e) => updateEditField("tierName", e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder-slate-400"
                  placeholder="VD: Khách hàng Bạch Kim"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mã định danh Level (Enum/String)</label>
                <input
                  type="text"
                  value={editForm.level}
                  onChange={(e) => updateEditField("level", e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder-slate-400"
                  placeholder="VD: Platinum"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hệ số tích điểm</label>
                  <input
                    type="number"
                    value={editForm.pointRate}
                    onChange={(e) => updateEditField("pointRate", parseFloat(e.target.value) || 0)}
                    step="0.1"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Đặt trước (ngày)</label>
                  <input
                    type="number"
                    value={editForm.bookingWindow}
                    onChange={(e) => updateEditField("bookingWindow", parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Điểm tối thiểu</label>
                  <input
                    type="number"
                    value={editForm.minPointsRequired}
                    onChange={(e) => updateEditField("minPointsRequired", parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Điểm giữ hạng / 90n</label>
                  <input
                    type="number"
                    value={editForm.maintenancePoints}
                    onChange={(e) => updateEditField("maintenancePoints", parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelTier}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCreateTier}
                  disabled={isCreating}
                  className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isCreating ? "Đang xử lý..." : "Khởi tạo hạng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Add / Edit Reward Modal Component */}
      {/* ========================================================================= */}
      {(isAddingReward || editingRewardId) && rewardForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                {isAddingReward ? "Tạo phần thưởng đổi điểm mới" : "Cập nhật thông số phần thưởng"}
              </h4>
              <button
                onClick={handleCancelReward}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tên quà tặng/voucher</label>
                <input
                  type="text"
                  value={rewardForm.name}
                  onChange={(e) => updateRewardField("name", e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder-slate-400"
                  placeholder="VD: Voucher giảm giá dịch vụ 100k"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mô tả ngắn</label>
                <textarea
                  value={rewardForm.description}
                  onChange={(e) => updateRewardField("description", e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none resize-none transition-all placeholder-slate-400"
                  placeholder="VD: Áp dụng cho mọi hóa đơn thanh toán trực tuyến..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Giá quy đổi (Points)</label>
                  <input
                    type="number"
                    value={rewardForm.pointsCost}
                    onChange={(e) => updateRewardField("pointsCost", parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mệnh giá giảm (VNĐ)</label>
                  <input
                    type="number"
                    value={rewardForm.discountAmount}
                    onChange={(e) => updateRewardField("discountAmount", parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              {editingRewardId && (
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="reward-active-modal"
                    checked={rewardForm.isActive ?? true}
                    onChange={(e) => updateRewardField("isActive", e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 accent-emerald-600"
                  />
                  <label
                    htmlFor="reward-active-modal"
                    className="text-sm font-semibold text-slate-700 select-none cursor-pointer"
                  >
                    Cho phép người dùng nhìn thấy công khai và đổi quà
                  </label>
                </div>
              )}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelReward}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={isAddingReward ? handleCreateReward : handleSaveReward}
                  disabled={isCreatingReward || isUpdatingReward}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isCreatingReward || isUpdatingReward
                    ? "Đang ghi nhận..."
                    : isAddingReward
                      ? "Phát hành ngay"
                      : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}