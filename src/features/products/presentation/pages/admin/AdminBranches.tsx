import { useState, useEffect, useCallback } from "react";
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
  Search,
} from "lucide-react";
import { AdminBranchRepositoryImplement } from "../../../infrastructure/repositories/admin-branch/admin-branch.repository.implement";
import type { BranchResponseData } from "../../../domain/models/admin-branch/admin-branch.model";

import { useStaff } from "@/features/products/application/useStaff";
import { useAdminPromotion } from "@/features/products/application/useAdminPromotion";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const branchRepo = new AdminBranchRepositoryImplement();

// --- COMPONENT CHỌN VỊ TRÍ TRÊN BẢN ĐỒ ---
function LocationPicker({
  position,
  onPositionChange,
}: {
  position: L.LatLng | null;
  onPositionChange: (latlng: L.LatLng) => void;
}) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onPositionChange(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

interface BranchPayload {
  branchName: string;
  address: string;
  hotline: string;
  operatingHours: string;
  status?: "Active" | "Inactive";
  latitude?: number;
  longitude?: number;
}

export function AdminBranches() {
  const [branches, setBranches] = useState<BranchResponseData[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Partial<
    BranchResponseData & { latitude: number; longitude: number }
  > | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Tọa độ mặc định ở trung tâm TP.HCM
  const defaultCenter: [number, number] = [10.762622, 106.660172];

  const { createStaff, isCreatingStaff } = useStaff();
  const { promotions, updatePromotion, isUpdating, createPromotion, isCreating } = useAdminPromotion();

  // --- STATE MODALS THEO LUỒNG (WORKFLOW) ---
  const [selectedBranchForStaff, setSelectedBranchForStaff] = useState<{ id: string; name: string } | null>(null);
  const [staffForm, setStaffForm] = useState({ email: "", password: "", fullName: "", phoneNumber: "" });

  const [selectedBranchForPromo, setSelectedBranchForPromo] = useState<{ id: string; name: string } | null>(null);
  const [selectedPromoId, setSelectedPromoId] = useState<string>("");

  const [isCreatingNewPromo, setIsCreatingNewPromo] = useState(false);
  const [newPromoForm, setNewPromoForm] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    priorityLevel: 0,
    startDate: "",
    endDate: "",
    maxUses: 100,
    minSpend: 0,
    requiresBirthday: false,
    tierIds: [] as string[],
  });

  const fetchBranches = useCallback(async () => {
    try {
      const data = await branchRepo.getAll();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const getBranchPayload = (): BranchPayload => ({
    branchName: editForm?.branchName || "",
    address: editForm?.address || "",
    hotline: editForm?.hotline || "",
    operatingHours: editForm?.operatingHours || "8am-8pm",
    status: (editForm?.status as "Active" | "Inactive") || "Active",
    latitude: editForm?.latitude,
    longitude: editForm?.longitude,
  });

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
      latitude: defaultCenter[0],
      longitude: defaultCenter[1],
    });
  };

  const handleSave = async () => {
    if (editForm && isEditing) {
      try {
        setIsLoading(true);
        await branchRepo.update(isEditing, getBranchPayload());
        await fetchBranches();
        handleCancel();
      } catch (error) {
        console.error("Failed to update branch:", error);
        alert("Có lỗi xảy ra khi cập nhật chi nhánh!");
        setIsLoading(false);
      }
    }
  };

  // --- LUỒNG BƯỚC 1: TẠO BRANCH XONG CHUYỂN SANG STAFF ---
  const handleCreate = async () => {
    if (editForm && editForm.branchName && editForm.address) {
      try {
        setIsLoading(true);
        // Ép kiểu any để lấy response linh hoạt (tùy backend trả về dữ liệu ra sao)
        const response: any = await branchRepo.create(getBranchPayload());
        await fetchBranches();

        // Giả định backend trả về ID chi nhánh mới ở response.id hoặc response.data.id
        const newBranchId = response?.id || response?.data?.id || "NEW_BRANCH_ID";
        const newBranchName = editForm.branchName;

        // Đóng modal Add Branch
        handleCancel();

        // Ngay lập tức mở Modal Add Staff cho chi nhánh vừa tạo (LUỒNG BƯỚC 2)
        setSelectedBranchForStaff({ id: newBranchId, name: newBranchName });
        setStaffForm({ email: "", password: "", fullName: "", phoneNumber: "" });
      } catch (error) {
        console.error("Failed to create branch:", error);
        alert("Có lỗi xảy ra khi tạo chi nhánh mới!");
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      try {
        setIsLoading(true);
        await branchRepo.delete(id);
        await fetchBranches();
      } catch (error) {
        console.error("Failed to delete branch:", error);
        alert("Có lỗi xảy ra khi xóa chi nhánh!");
        setIsLoading(false);
      }
    }
  };

  const handleToggleStatus = async (branch: BranchResponseData) => {
    try {
      setIsLoading(true);
      const payload: BranchPayload = {
        branchName: branch.branchName,
        address: branch.address,
        hotline: branch.hotline,
        operatingHours: branch.operatingHours,
        status: branch.status === "Active" ? "Inactive" : "Active",
      };
      await branchRepo.update(branch.id, payload);
      await fetchBranches();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setEditForm(null);
  };

  // --- GOONG API ---
  const handleGeocodeAddress = async () => {
    if (!editForm?.address) return;

    setIsGeocoding(true);
    try {
      const GOONG_REST_API_KEY =
        import.meta.env.VITE_GOONG_REST_API_KEY || "YOUR_GOONG_REST_API_KEY";

      if (GOONG_REST_API_KEY === "YOUR_GOONG_REST_API_KEY") {
        alert("Vui lòng cấu hình Goong REST API Key trong file .env của bạn!");
        setIsGeocoding(false);
        return;
      }

      const url = `https://rsapi.goong.io/Geocode?address=${encodeURIComponent(
        editForm.address
      )}&api_key=${GOONG_REST_API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data && data.status === "OK" && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;

        setEditForm({
          ...editForm,
          latitude: location.lat,
          longitude: location.lng,
        });
      } else {
        alert(
          "Goong không tìm thấy tọa độ khớp với địa chỉ này.\nVui lòng kiểm tra lại chính tả hoặc tự chấm thủ công trên bản đồ!"
        );
      }
    } catch (error) {
      console.error("Goong Geocoding error:", error);
      alert("Đã xảy ra lỗi kết nối khi đồng bộ bản đồ với hệ thống Goong.");
    } finally {
      setIsGeocoding(false);
    }
  };

  // --- LUỒNG BƯỚC 2: TẠO STAFF XONG CHUYỂN SANG PROMOTION ---
  const handleSaveStaffData = async () => {
    if (!selectedBranchForStaff) return;
    if (!staffForm.email || !staffForm.password || !staffForm.fullName || !staffForm.phoneNumber) {
      alert("Vui lòng điền đầy đủ tất cả các trường dữ liệu!");
      return;
    }

    try {
      await createStaff({
        email: staffForm.email,
        password: staffForm.password,
        fullName: staffForm.fullName,
        phoneNumber: staffForm.phoneNumber,
        branchId: selectedBranchForStaff.id
      });

      // Lưu trữ tạm nhánh hiện tại trước khi đóng modal
      const currentBranch = selectedBranchForStaff;
      setSelectedBranchForStaff(null);

      // Chuyển sang Modal Add Promotion (LUỒNG BƯỚC 3)
      setSelectedBranchForPromo(currentBranch);
      setSelectedPromoId("");
    } catch (err) {
      console.error("Error dispatching staff registration:", err);
    }
  };

  // --- LUỒNG BƯỚC 3: XỬ LÝ BỎ QUA KHUYẾN MÃI ---
  const handleSkipPromotion = () => {
    if (window.confirm("Bạn có chắc không có chương trình khuyến mãi ở chi nhánh mới?")) {
      setSelectedBranchForPromo(null);
    }
  };

  const handleCreateNewPromotion = async () => {
    if (!selectedBranchForPromo) return;

    if (!newPromoForm.code || !newPromoForm.name || !newPromoForm.startDate || !newPromoForm.endDate) {
      alert("Vui lòng điền các trường bắt buộc (Mã, Tên, Ngày bắt đầu, Ngày kết thúc)!");
      return;
    }

    try {
      await createPromotion({
        ...newPromoForm,
        startDate: new Date(newPromoForm.startDate).toISOString(),
        endDate: new Date(newPromoForm.endDate).toISOString(),
        branchIds: [selectedBranchForPromo.id], // Tự động gắn branchId vừa tạo
      });

      alert(`Đã tạo và kích hoạt khuyến mãi mới cho chi nhánh: ${selectedBranchForPromo.name}`);

      // Reset và đóng modal
      setSelectedBranchForPromo(null);
      setIsCreatingNewPromo(false);
      setNewPromoForm({
        code: "", name: "", description: "", discountType: "PERCENTAGE", discountValue: 0, priorityLevel: 0,
        startDate: "", endDate: "", maxUses: 100, minSpend: 0, requiresBirthday: false, tierIds: [],
      });
    } catch (error) {
      console.error("Lỗi khi tạo khuyến mãi mới:", error);
      alert("Có lỗi xảy ra khi tạo khuyến mãi mới!");
    }
  };

  const handleLinkPromotion = async () => {
    if (!selectedBranchForPromo || !selectedPromoId) return;

    const promoToUpdate = promotions.find((p) => p.id === selectedPromoId);
    if (!promoToUpdate) return;

    try {
      const currentBranchIds = (promoToUpdate as any).branchIds || [];
      const updatedBranchIds = Array.from(new Set([...currentBranchIds, selectedBranchForPromo.id]));

      await updatePromotion({
        id: selectedPromoId,
        data: {
          description: promoToUpdate.description,
          discountType: promoToUpdate.discountType,
          discountValue: promoToUpdate.discountValue,
          startDate: promoToUpdate.startDate,
          endDate: promoToUpdate.endDate,
          maxUses: promoToUpdate.maxUses,
          minSpend: promoToUpdate.minSpend,
          isActive: promoToUpdate.isActive,
          branchIds: updatedBranchIds,
        },
      });

      alert(`Đã liên kết Khuyến mãi thành công với Chi nhánh: ${selectedBranchForPromo.name}`);
      setSelectedBranchForPromo(null);
      setSelectedPromoId("");
    } catch (error) {
      console.error("Lỗi khi liên kết khuyến mãi:", error);
      alert("Có lỗi xảy ra khi liên kết khuyến mãi!");
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Branches</h3>
            <p className="text-gray-500">Manage all car wash branches locations</p>
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
                className={`bg-white rounded-xl border-2 p-6 transition-all ${branch.status === "Active"
                  ? "border-blue-200 shadow-sm"
                  : "border-gray-200 opacity-60"
                  }`}
              >
                {/* Header Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(branch)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Sửa chi nhánh"
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

                {/* Info Card */}
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
                    <span className="text-sm text-gray-600">{branch.hotline}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Hours: {branch.operatingHours}
                    </span>
                  </div>
                </div>

                {/* Status Toggle Card */}
                <button
                  onClick={() => handleToggleStatus(branch)}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${branch.status === "Active"
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

      {/* Edit/Add Branch Modal */}
      {(isEditing || isAdding) && editForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
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
                  <div className="flex gap-2">
                    <textarea
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Nhập địa chỉ đầy đủ..."
                    />
                    <button
                      type="button"
                      onClick={handleGeocodeAddress}
                      disabled={isGeocoding || !editForm.address}
                      className="flex flex-col items-center justify-center px-4 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      title="Tìm tọa độ trên bản đồ"
                    >
                      <Search className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">
                        {isGeocoding ? "Đang tìm..." : "Tìm Map"}
                      </span>
                    </button>
                  </div>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={editForm.latitude || ""}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none text-gray-500"
                      placeholder="Chọn trên bản đồ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={editForm.longitude || ""}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none text-gray-500"
                      placeholder="Chọn trên bản đồ"
                    />
                  </div>
                </div>

              </div>

              {/* CỘT PHẢI: BẢN ĐỒ LEAFLET GIỮ NGUYÊN */}
              <div className="flex flex-col h-[400px] lg:h-auto border border-gray-300 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-300 text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Click vào bản đồ để ghim vị trí hoặc dùng nút "Tìm Map" bên cạnh địa chỉ
                </div>
                <div className="flex-1 w-full h-full relative z-0">
                  <MapContainer
                    center={
                      editForm.latitude && editForm.longitude
                        ? [editForm.latitude, editForm.longitude]
                        : defaultCenter
                    }
                    zoom={15}
                    style={{ height: "100%", width: "100%", minHeight: "350px" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationPicker
                      position={
                        editForm.latitude && editForm.longitude
                          ? new L.LatLng(editForm.latitude, editForm.longitude)
                          : null
                      }
                      onPositionChange={(latlng) => {
                        setEditForm({
                          ...editForm,
                          latitude: latlng.lat,
                          longitude: latlng.lng,
                        });
                      }}
                    />

                    {editForm.latitude && editForm.longitude && (
                      <ChangeMapView center={[editForm.latitude, editForm.longitude]} />
                    )}
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={isAdding ? handleCreate : handleSave}
                className="flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isAdding ? "Create Branch" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL ADD STAFF (WORKFLOW STEP 2) --- */}
      {selectedBranchForStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h4 className="text-lg font-bold text-gray-900">
                Bước 2: Tạo tài khoản Nhân viên
              </h4>
              {/* Nút X ở đây có thể cho phép người dùng dừng luồng (bỏ qua bước Staff) */}
              <button onClick={() => setSelectedBranchForStaff(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Chi nhánh: <span className="font-semibold text-indigo-600">{selectedBranchForStaff.name}</span></p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={staffForm.fullName}
                  onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="staff@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={staffForm.phoneNumber}
                  onChange={(e) => setStaffForm({ ...staffForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="09XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Mật khẩu tài khoản</label>
                <input
                  type="password"
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-100">
              {/* Cho phép bỏ qua bước tạo staff nếu họ muốn */}
              <button
                onClick={() => setSelectedBranchForStaff(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleSaveStaffData}
                disabled={isCreatingStaff}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                {isCreatingStaff ? "Đang tạo..." : "Xác nhận & Tiếp tục"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL ADD PROMOTION (WORKFLOW STEP 3) --- */}
      {selectedBranchForPromo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className={`bg-white rounded-xl p-6 w-full shadow-2xl transition-all ${isCreatingNewPromo ? 'max-w-2xl' : 'max-w-md'}`}>
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h4 className="text-lg font-bold text-gray-900">
                Bước 3: {isCreatingNewPromo ? "Tạo Khuyến Mãi Mới" : "Khởi tạo Khuyến Mãi"}
              </h4>
              {!isCreatingNewPromo && (
                <button onClick={() => setSelectedBranchForPromo(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Áp dụng cho chi nhánh: <span className="font-semibold text-amber-600">{selectedBranchForPromo.name}</span>
            </p>

            {isCreatingNewPromo ? (
              /* --- GIAO DIỆN TẠO MỚI --- */
              <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Mã KM (Code)</label>
                  <input type="text" value={newPromoForm.code} onChange={e => setNewPromoForm({ ...newPromoForm, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="VD: KHAI_TRUONG_Q9" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Tên KM (Name)</label>
                  <input type="text" value={newPromoForm.name} onChange={e => setNewPromoForm({ ...newPromoForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Giảm giá khai trương" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Mô tả</label>
                  <input type="text" value={newPromoForm.description} onChange={e => setNewPromoForm({ ...newPromoForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Loại giảm giá</label>
                  <select value={newPromoForm.discountType} onChange={e => setNewPromoForm({ ...newPromoForm, discountType: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="AMOUNT">Số tiền mặt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Mức giảm</label>
                  <input type="number" value={newPromoForm.discountValue} onChange={e => setNewPromoForm({ ...newPromoForm, discountValue: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Bắt đầu</label>
                  <input type="datetime-local" value={newPromoForm.startDate} onChange={e => setNewPromoForm({ ...newPromoForm, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Kết thúc</label>
                  <input type="datetime-local" value={newPromoForm.endDate} onChange={e => setNewPromoForm({ ...newPromoForm, endDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
            ) : (
              /* --- GIAO DIỆN CHỌN KHUYẾN MÃI ĐÃ CÓ --- */
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Chọn chương trình đã có</label>
                <select
                  value={selectedPromoId}
                  onChange={(e) => setSelectedPromoId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  disabled={isUpdating}
                >
                  <option value="">-- Chọn Khuyến Mãi --</option>
                  {promotions.filter(p => p.isActive).map((promo) => (
                    <option key={promo.id} value={promo.id}>
                      {(promo as any).name || promo.description} (Giảm: {promo.discountValue})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-100">
              {isCreatingNewPromo ? (
                <>
                  <button
                    onClick={() => setIsCreatingNewPromo(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleCreateNewPromotion}
                    disabled={isCreating}
                    className="px-5 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 disabled:opacity-50"
                  >
                    {isCreating ? "Đang tạo..." : "Lưu & Kích hoạt"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSkipPromotion}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 disabled:opacity-50"
                  >
                    Bỏ qua
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCreatingNewPromo(true)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100"
                    >
                      Tạo mới
                    </button>
                    <button
                      disabled={!selectedPromoId || isUpdating}
                      onClick={handleLinkPromotion}
                      className="px-5 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 disabled:opacity-50"
                    >
                      {isUpdating ? "Đang liên kết..." : "Kích hoạt ngay"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}