import { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
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
import { AdminWashPackageRepositoryImplement } from "../../../infrastructure/repositories/admin-wash-package/admin-wash-package.repository.implement";
import type { WashPackageResponseData } from "../../../domain/models/admin-wash-package/admin-wash-package.model";

// Khởi tạo Repository
const washPackageRepo = new AdminWashPackageRepositoryImplement();

export function AdminPackages() {
  const [packages, setPackages] = useState<WashPackageResponseData[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null); // Đổi thành string vì id là UUID
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<WashPackageResponseData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Lấy dữ liệu từ API khi component mount
  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const data = await washPackageRepo.getAll();
      setPackages(data);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleEdit = (pkg: WashPackageResponseData) => {
    setIsEditing(pkg.id);
    setEditForm({ ...pkg });
  };

  const handleSave = async () => {
    if (editForm && isEditing) {
      try {
        await washPackageRepo.update(isEditing, {
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          durationMinutes: editForm.durationMinutes,
          features: editForm.features.filter((f) => f.trim() !== ""), // Lọc bỏ feature rỗng
          vehicleType: editForm.vehicleType,
          isActive: editForm.isActive,
        });
        await fetchPackages(); // Reload lại danh sách
        setIsEditing(null);
        setEditForm(null);
      } catch (error) {
        console.error("Failed to update package:", error);
        alert("Có lỗi xảy ra khi cập nhật gói rửa xe!");
      }
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
      vehicleType: "Small",
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  const handleCreate = async () => {
    if (editForm && editForm.name && editForm.price > 0) {
      try {
        await washPackageRepo.create({
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          durationMinutes: editForm.durationMinutes,
          features: editForm.features.filter((f) => f.trim() !== ""),
          vehicleType: editForm.vehicleType,
        });
        await fetchPackages();
        setIsAdding(false);
        setEditForm(null);
      } catch (error) {
        console.error("Failed to create package:", error);
        alert("Có lỗi xảy ra khi tạo gói mới!");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await washPackageRepo.delete(id);
        await fetchPackages();
      } catch (error) {
        console.error("Failed to delete package:", error);
        alert("Có lỗi xảy ra khi xóa gói!");
      }
    }
  };

  const handleToggleStatus = async (pkg: WashPackageResponseData) => {
    try {
      await washPackageRepo.update(pkg.id, {
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        durationMinutes: pkg.durationMinutes,
        features: pkg.features,
        vehicleType: pkg.vehicleType,
        isActive: !pkg.isActive, // Đảo trạng thái hiện tại
      });
      await fetchPackages();
    } catch (error) {
      console.error("Failed to toggle status:", error);
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

  return (
    <Layout title="Wash Package Management" userName="Admin" role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">
              Create and manage wash service packages
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Package
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500">Loading packages...</p>
          </div>
        ) : (
          /* Packages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages
              .filter((pkg) => pkg.isActive)
              .map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-xl border-2 p-6 transition-all ${
                    pkg.isActive
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
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {pkg.description}
                  </p>

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
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(pkg)}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      pkg.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {pkg.isActive ? (
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
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                {isAdding ? "Add New Package" : "Edit Package"}
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
                  Package Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Premium Wash"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Brief description"
                />
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (VND)
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (min)
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

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={editForm.vehicleType || "Small"}
                  onChange={(e) =>
                    setEditForm({ ...editForm, vehicleType: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  {editForm.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Feature description"
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
                    Add Feature
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
                  Active (available for booking)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={isAdding ? handleCreate : handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isAdding ? "Create Package" : "Save Changes"}
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
