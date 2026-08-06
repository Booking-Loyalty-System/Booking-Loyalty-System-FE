import { useState } from "react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  useWashPackage,
  type WashPackageResponseData,
} from "../../../application/useAdminWashPackage";
import { useTranslation } from "react-i18next";
import { translateDynamic } from "@/shared/utils/dynamicTranslator";

export function AdminPackages() {
  const { t } = useTranslation('customer');
  const {
    packages,
    isLoading,
    createPackage,
    updatePackage,
    deletePackage,
    toggleStatus,
  } = useWashPackage();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editForm, setEditForm] = useState<WashPackageResponseData | null>(
    null,
  );

  const handleEdit = (pkg: WashPackageResponseData) => {
    setIsEditing(pkg.id);
    setEditForm({ ...pkg });
  };

  const handleSave = async () => {
    if (editForm && isEditing) {
      await updatePackage({
        id: isEditing,
        data: {
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          durationMinutes: editForm.durationMinutes,
          features: editForm.features.filter((f) => f.trim() !== ""),
          isActive: editForm.isActive,
        },
      });
      handleCancel();
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      id: "",
      name: "",
      price: 0,
      durationMinutes: 0,
      description: "",
      features: [""],
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  const handleCreate = async () => {
    if (editForm && editForm.name && editForm.price > 0) {
      await createPackage({
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        durationMinutes: editForm.durationMinutes,
        features: editForm.features.filter((f) => f.trim() !== ""),
      });
      handleCancel();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('adminWashPackages.deleteConfirm', { defaultValue: 'Are you sure you want to delete this package?' }))) {
      await deletePackage(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setEditForm(null);
  };

  const updateFeature = (index: number, value: string) => {
    if (editForm) {
      const newFeatures = [...editForm.features];
      newFeatures[index] = value;
      setEditForm({ ...editForm, features: newFeatures });
    }
  };

  const addFeature = () => {
    if (editForm) {
      setEditForm({ ...editForm, features: [...editForm.features, ""] });
    }
  };

  const removeFeature = (index: number) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        features: editForm.features.filter((_, i) => i !== index),
      });
    }
  };

  const getAutoFeaturesByPrice = (currentPrice: number): string[] => {
    if (packages.length === 0) return [""];

    // Lọc danh sách gói đang hoạt động và sắp xếp theo giá tăng dần
    const activePackages = [...packages]
      .filter((p) => p.isActive)
      .sort((a, b) => a.price - b.price);

    if (activePackages.length === 0) return [""];

    // Gói xịn nhất (giá cao nhất)
    const highestPackage = activePackages[activePackages.length - 1];

    // TRƯỜNG HỢP 1: Nếu giá nhập vào cao hơn gói xịn nhất => Lấy features gói xịn nhất
    if (currentPrice >= highestPackage.price) {
      return highestPackage.features.length > 0 ? highestPackage.features : [""];
    }

    // TRƯỜNG HỢP 2: Nếu giá thấp hơn => Tìm gói có giá cao hơn kế tiếp (gói thấp nhất mà vẫn lớn hơn currentPrice)
    const nextHigherPackage = activePackages.find((p) => p.price > currentPrice);

    if (nextHigherPackage) {
      return nextHigherPackage.features.length > 0 ? nextHigherPackage.features : [""];
    }

    return [""];
  };

  // Pagination logic
  const PACKAGES_PER_PAGE = 5;
  const totalPackages = packages?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalPackages / PACKAGES_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PACKAGES_PER_PAGE;
  const endIndex = startIndex + PACKAGES_PER_PAGE;
  const paginatedPackages = (packages || []).slice(startIndex, endIndex);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">
              {t('adminWashPackages.subtitle', { defaultValue: 'Create and manage wash service packages' })}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('adminWashPackages.addPackage', { defaultValue: 'Add Package' })}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">{t('adminWashPackages.loadingPackages', { defaultValue: 'Loading packages...' })}</p>
          </div>
        ) : (
          /* Packages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-xl border-2 p-6 transition-all ${pkg.isActive
                  ? "border-blue-200 shadow-sm"
                  : "border-gray-200 opacity-60"
                  }`}
              >
                {/* Package Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Package Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {translateDynamic(pkg.name, 'package', t)}
                </h3>


                <p className="text-sm text-gray-600 mb-4">{translateDynamic(pkg.name, 'packageDesc', t, pkg.description)}</p>

                {/* Price and Duration */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">
                      {pkg.price.toLocaleString()} VND
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">
                      {pkg.durationMinutes} min
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="text-sm text-gray-700">{translateDynamic(feature, 'feature', t, feature)}</span>
                    </div>
                  ))}
                </div>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleStatus(pkg)}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${pkg.isActive
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >
                  {pkg.isActive ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('adminWashPackages.active', { defaultValue: 'Active' })}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" />
                      {t('adminWashPackages.inactive', { defaultValue: 'Inactive' })}
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-white rounded-xl border border-gray-200/80 shadow-sm mt-4">
            <p className="text-sm font-medium text-gray-500">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, totalPackages)} của {totalPackages} gói dịch vụ
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      type="button"
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`min-w-9 h-9 px-3 rounded-lg text-sm font-bold transition-colors ${
                        safeCurrentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {(isEditing || isAdding) && editForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                {isAdding ? t('adminWashPackages.addNewPackage', { defaultValue: 'Add New Package' }) : t('adminWashPackages.editPackage', { defaultValue: 'Edit Package' })}
              </h4>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Package Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminWashPackages.packageName', { defaultValue: 'Package Name' })}
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={t('adminWashPackages.packageNamePlaceholder', { defaultValue: 'e.g. Premium Wash' })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminWashPackages.description', { defaultValue: 'Description' })}
                </label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={t('adminWashPackages.descriptionPlaceholder', { defaultValue: 'Brief description' })}
                />
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminWashPackages.price', { defaultValue: 'Price (VND)' })}
                  </label>
                  <input
                    type="number"
                    value={editForm.price || 0}
                    onChange={(e) => {
                      const newPrice = parseFloat(e.target.value) || 0;
                      const autoFeatures = getAutoFeaturesByPrice(newPrice);

                      setEditForm({
                        ...editForm,
                        price: newPrice,
                        features: autoFeatures,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminWashPackages.duration', { defaultValue: 'Duration (min)' })}
                  </label>
                  <input
                    type="number"
                    value={editForm.durationMinutes}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        durationMinutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>


              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('adminWashPackages.features', { defaultValue: 'Features' })}
                </label>
                <div className="space-y-2">
                  {editForm.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder={t('adminWashPackages.featurePlaceholder', { defaultValue: 'Feature description' })}
                      />
                      <button
                        onClick={() => removeFeature(idx)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t('adminWashPackages.addFeature', { defaultValue: 'Add Feature' })}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  {t('adminWashPackages.activeLabel', { defaultValue: 'Active (available for booking)' })}
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={isAdding ? handleCreate : handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isAdding ? t('adminWashPackages.createPackage', { defaultValue: 'Create Package' }) : t('adminWashPackages.saveChanges', { defaultValue: 'Save Changes' })}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  {t('adminWashPackages.cancel', { defaultValue: 'Cancel' })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
