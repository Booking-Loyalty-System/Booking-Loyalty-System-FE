import { useState, useMemo } from "react";
import {
  Megaphone,
  Plus,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import {
  useAdminPromotion,
  type AdminPromotionResponseData,
  type CreateAdminPromotionInput,
  type UpdateAdminPromotionInput,
} from "../../../application/useAdminPromotion";
import type { DiscountType } from "../../../domain/models/admin-promotion/admin-promotion.model";

const emptyPromotionForm: CreateAdminPromotionInput = {
  code: "",
  description: "",
  discountType: "Percentage",
  discountValue: 0,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10),
  maxUses: null,
  minSpend: null,
};

function toDateInputValue(isoDate: string) {
  return isoDate.slice(0, 10);
}

function toIsoDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00Z").toISOString();
}

function formatDiscount(promo: AdminPromotionResponseData) {
  if (promo.discountType === "Percentage") {
    return `${promo.discountValue}%`;
  }
  return `${promo.discountValue.toLocaleString("vi-VN")}đ`;
}

function formatDiscountType(type: DiscountType) {
  return type === "Percentage" ? "Phần trăm" : "Số tiền cố định";
}

function formatUsage(promo: AdminPromotionResponseData) {
  if (promo.maxUses == null) {
    return `${promo.usedCount} / Không giới hạn`;
  }
  return `${promo.usedCount}/${promo.maxUses}`;
}

export function AdminPromotions() {
  const {
    promotions,
    isLoading,
    createPromotion,
    updatePromotion,
    deletePromotion,
    toggleStatus,
    isCreating,
    isUpdating,
  } = useAdminPromotion();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<
    (CreateAdminPromotionInput & { isActive?: boolean }) | null
  >(null);

  const stats = useMemo(() => {
    const activeCount = promotions.filter((p) => p.isActive).length;
    const totalUsed = promotions.reduce((sum, p) => sum + p.usedCount, 0);
    return { activeCount, totalUsed, total: promotions.length };
  }, [promotions]);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setForm({ ...emptyPromotionForm });
  };

  const handleEdit = (promo: AdminPromotionResponseData) => {
    setEditingId(promo.id);
    setIsAdding(false);
    setForm({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      startDate: toDateInputValue(promo.startDate),
      endDate: toDateInputValue(promo.endDate),
      maxUses: promo.maxUses,
      minSpend: promo.minSpend,
      isActive: promo.isActive,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(null);
  };

  const handleCreate = async () => {
    if (form && form.code && form.description) {
      await createPromotion({
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: form.discountValue,
        startDate: toIsoDate(form.startDate),
        endDate: toIsoDate(form.endDate),
        maxUses: form.maxUses ?? null,
        minSpend: form.minSpend ?? null,
      });
      handleCancel();
    }
  };

  const handleSave = async () => {
    if (form && editingId) {
      const updateData: UpdateAdminPromotionInput = {
        description: form.description,
        discountType: form.discountType,
        discountValue: form.discountValue,
        startDate: toIsoDate(form.startDate),
        endDate: toIsoDate(form.endDate),
        maxUses: form.maxUses ?? null,
        minSpend: form.minSpend ?? null,
        isActive: form.isActive ?? true,
      };
      await updatePromotion({ id: editingId, data: updateData });
      handleCancel();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa khuyến mãi này?")) {
      await deletePromotion(id);
    }
  };

  const updateField = <
    K extends keyof (CreateAdminPromotionInput & { isActive?: boolean }),
  >(
    field: K,
    value: (CreateAdminPromotionInput & { isActive?: boolean })[K],
  ) => {
    if (form) {
      setForm({ ...form, [field]: value });
    }
  };

  const showModal = (isAdding || editingId) && form;

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Khuyến mãi</h3>
          <p className="text-gray-500">
            Tạo và quản lý mã giảm giá, chiến dịch marketing
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" /> Thêm khuyến mãi
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Đang hoạt động</p>
          <p className="text-3xl font-bold text-gray-900">{stats.activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Tổng lượt sử dụng</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsed}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Tổng khuyến mãi</p>
          <p className="text-3xl font-bold text-green-600">{stats.total}</p>
        </div>
      </div>

      {/* Promotions List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Đang tải khuyến mãi...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Mã / Mô tả
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Loại giảm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Giá trị
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Lượt dùng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Hết hạn
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          promo.isActive ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <Megaphone
                          className={`w-5 h-5 ${
                            promo.isActive ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">
                          {promo.code}
                        </span>
                        <span className="text-xs text-gray-500 line-clamp-1">
                          {promo.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {formatDiscountType(promo.discountType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatDiscount(promo)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(promo)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        promo.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {promo.isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Tắt
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatUsage(promo)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {toDateInputValue(promo.endDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(promo)}
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
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full p-8 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-bold text-gray-900">
                {isAdding ? "Thêm khuyến mãi" : "Chỉnh sửa khuyến mãi"}
              </h4>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {isAdding && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã khuyến mãi
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) =>
                      updateField("code", e.target.value.toUpperCase())
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    placeholder="VD: SUMMER-20"
                  />
                </div>
              )}

              {!isAdding && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã khuyến mãi
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 uppercase"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Mô tả chi tiết khuyến mãi..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại giảm giá
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      updateField("discountType", e.target.value as DiscountType)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Percentage">Phần trăm (%)</option>
                    <option value="FixedAmount">Số tiền cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá trị giảm
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) =>
                      updateField(
                        "discountValue",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={form.discountType === "Percentage" ? "20" : "50000"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày kết thúc
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => updateField("endDate", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giới hạn lượt dùng
                  </label>
                  <input
                    type="number"
                    value={form.maxUses ?? ""}
                    onChange={(e) =>
                      updateField(
                        "maxUses",
                        e.target.value === ""
                          ? null
                          : parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Để trống = không giới hạn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chi tiêu tối thiểu (đ)
                  </label>
                  <input
                    type="number"
                    value={form.minSpend ?? ""}
                    onChange={(e) =>
                      updateField(
                        "minSpend",
                        e.target.value === ""
                          ? null
                          : parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Để trống = không yêu cầu"
                  />
                </div>
              </div>

              {editingId && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="promo-active"
                    checked={form.isActive ?? true}
                    onChange={(e) => updateField("isActive", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="promo-active"
                    className="text-sm font-medium text-gray-700"
                  >
                    Đang hoạt động
                  </label>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={isAdding ? handleCreate : handleSave}
                  disabled={isCreating || isUpdating}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {isCreating || isUpdating
                    ? "Đang lưu..."
                    : isAdding
                      ? "Tạo khuyến mãi"
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
