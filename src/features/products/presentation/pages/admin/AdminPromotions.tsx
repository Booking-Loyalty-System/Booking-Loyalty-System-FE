import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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

type LocalPromoForm = Omit<CreateAdminPromotionInput, "discountValue"> & {
  discountValue: number | string;
  isActive?: boolean;
  name?: string;
};

const emptyPromotionForm: LocalPromoForm = {
  code: "",
  name: "",
  description: "",
  discountType: "PERCENTAGE" as any,
  discountValue: "", // Khởi tạo bằng chuỗi rỗng
  priorityLevel: 0,
  startDate: "",
  endDate: "",
  maxUses: null,
  minSpend: null,
  requiresBirthday: false,
  tierIds: [],
  branchIds: []
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

function formatDiscountType(type: DiscountType, t: any) {
  return type === "Percentage" ? t("adminPromotions.percentage") : t("adminPromotions.fixedAmount");
}

function formatUsage(promo: AdminPromotionResponseData) {
  if (promo.maxUses == null) {
    return `${promo.usedCount} / `;
  }
  return `${promo.usedCount}/${promo.maxUses}`;
}

export function AdminPromotions() {
  const { t } = useTranslation("customer");
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
  const [form, setForm] = useState<LocalPromoForm | null>(null);

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
      name: (promo as any).name || "",
      description: promo.description,
      discountType: promo.discountType as any,
      discountValue: promo.discountValue,
      priorityLevel: (promo as any).priorityLevel || 0,
      startDate: promo.startDate,
      endDate: promo.endDate,
      maxUses: promo.maxUses,
      minSpend: promo.minSpend,
      requiresBirthday: (promo as any).requiresBirthday || false,
      tierIds: (promo as any).tierIds || [],
      branchIds: (promo as any).branchIds || [],
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
        ...form,
        discountType: "PERCENTAGE" as any,
        discountValue: Number(form.discountValue) || 0,
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
        discountType: "PERCENTAGE" as DiscountType,
        discountValue: Number(form.discountValue) || 0,
        startDate: toIsoDate(form.startDate),
        endDate: toIsoDate(form.endDate),
        maxUses: form.maxUses ?? null,
        minSpend: form.minSpend ?? null,
        isActive: form.isActive ?? true,
        branchIds: form.branchIds,
      };
      await updatePromotion({ id: editingId, data: updateData });
      handleCancel();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('adminPromotions.deleteConfirm'))) {
      await deletePromotion(id);
    }
  };

  const updateField = <
    K extends keyof LocalPromoForm,
  >(
    field: K,
    value: LocalPromoForm[K],
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
          <h3 className="text-2xl font-bold text-gray-900">{t('adminPromotions.title')}</h3>
          <p className="text-gray-500">
            {t('adminPromotions.subtitle')}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" /> {t('adminPromotions.addPromotion')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t('adminPromotions.activeCount')}</p>
          <p className="text-3xl font-bold text-gray-900">{stats.activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t('adminPromotions.totalUsed')}</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsed}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{t('adminPromotions.totalPromotions')}</p>
          <p className="text-3xl font-bold text-green-600">{stats.total}</p>
        </div>
      </div>

      {/* Promotions List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">{t('adminPromotions.loading')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('adminPromotions.codeDesc')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('adminPromotions.discountType')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('adminPromotions.value')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('adminPromotions.status')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('adminPromotions.uses')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('adminPromotions.expires')}</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{t('adminPromotions.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${promo.isActive ? "bg-blue-100" : "bg-gray-100"
                          }`}
                      >
                        <Megaphone
                          className={`w-5 h-5 ${promo.isActive ? "text-blue-600" : "text-gray-400"
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
                      {formatDiscountType(promo.discountType, t)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatDiscount(promo)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(promo)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${promo.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                      {promo.isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />{t('adminPromotions.active')}</>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />{t('adminPromotions.inactive')}</>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl p-8 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-bold text-gray-900">
                {isAdding ? t('adminPromotions.addPromotion') : t('adminPromotions.editPromotion')}
              </h4>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {isAdding ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('adminPromotions.promoCode', { defaultValue: 'Promo Code' })}</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) =>
                      updateField("code", e.target.value.toUpperCase())
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase transition-all"
                    placeholder="VD: SUMMER-20"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('adminPromotions.promoCode', { defaultValue: 'Promo Code' })}</label>
                  <input
                    type="text"
                    value={form.code}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 uppercase cursor-not-allowed"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('adminPromotions.description', { defaultValue: 'Description' })}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                  placeholder={t('adminPromotions.descPlaceholder', { defaultValue: 'Detailed promotion description...' })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Khóa cứng loại giảm giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('adminPromotions.discountType', { defaultValue: 'Type' })}
                  </label>
                  <select
                    disabled
                    value="PERCENTAGE"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none appearance-none"
                  >
                    <option value="PERCENTAGE">{t('adminPromotions.percentageSuffix', { defaultValue: 'Percentage (%)' })}</option>
                  </select>
                </div>

                {/* Sửa input số */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('adminPromotions.discountValue', { defaultValue: 'Discount Value' })}
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) =>
                      updateField(
                        "discountValue",
                        e.target.value === "" ? "" : parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('adminPromotions.startDate', { defaultValue: 'Start Date' })}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('adminPromotions.endDate', { defaultValue: 'End Date' })}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => updateField("endDate", e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('adminPromotions.maxUses', { defaultValue: 'Max Uses' })}</label>
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder={t('adminPromotions.leaveEmptyUnlimited', { defaultValue: 'Leave empty for unlimited' })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('adminPromotions.minSpend', { defaultValue: 'Min Spend (đ)' })}</label>
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder={t('adminPromotions.leaveEmptyNoRequirement', { defaultValue: 'Leave empty if no requirement' })}
                  />
                </div>
              </div>

              {editingId && (
                <div className="flex items-center gap-2 pt-2">
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
                  >{t('adminPromotions.activeCount', { defaultValue: 'Active Status' })}</label>
                </div>
              )}

              <div className="pt-6">
                <button
                  onClick={isAdding ? handleCreate : handleSave}
                  disabled={isCreating || isUpdating}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {isCreating || isUpdating
                    ? t('adminPromotions.saving', { defaultValue: 'Saving...' })
                    : isAdding
                      ? t('adminPromotions.createPromotion', { defaultValue: 'Create Promotion' })
                      : t('adminPromotions.saveChanges', { defaultValue: 'Save Changes' })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}