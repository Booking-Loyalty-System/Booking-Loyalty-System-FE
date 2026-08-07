import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Save, X, Layers, Search, AlertCircle, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translateDynamic } from "@/shared/utils/translateDynamic";
import { useWashBay } from "@/features/products/application/useWashBay";
import { AdminBranchRepositoryImplement } from "../../../infrastructure/repositories/admin-branch/admin-branch.repository.implement";
import type { BranchResponseData } from "../../../domain/models/admin-branch/admin-branch.model";

const branchRepo = new AdminBranchRepositoryImplement();

interface WashBay {
    id: string;
    name: string;
    branchId: string;
    status?: string;
}

export function AdminWashBay() {
    const { t, i18n } = useTranslation();
    const [branches, setBranches] = useState<BranchResponseData[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Thêm state để lưu trữ giá trị bộ lọc Chi nhánh hiện tại
    const [filterBranchId, setFilterBranchId] = useState<string>("");

    // Truyền filterBranchId vào hook. Nếu rỗng ("") thì hook sẽ lấy tất cả
    const {
        washBays = [],
        createWashBay,
        isCreatingWashBay,
        updateWashBay,
        deleteWashBay,
        isLoading: isWashBayLoading
    } = useWashBay(filterBranchId || undefined) as any;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<{ id?: string; name: string; branchId: string }>({
        name: "",
        branchId: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

    const [isLoadingBranches, setIsLoadingBranches] = useState(true);

    const fetchBranches = useCallback(async () => {
        try {
            const data = await branchRepo.getAll();
            setBranches(data);
        } catch (error) {
            console.error("Failed to fetch branches:", error);
        } finally {
            setIsLoadingBranches(false);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const handleAdd = () => {
        setIsEditing(false);
        setEditForm({ name: "", branchId: branches.length > 0 ? branches[0].id : "" });
        setIsModalOpen(true);
    };

    const handleEdit = (washBay: WashBay) => {
        setIsEditing(true);
        setEditForm({ id: washBay.id, name: washBay.name, branchId: washBay.branchId });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditForm({ name: "", branchId: "" });
    };

    const handleSave = async () => {
        if (!editForm.name.trim() || !editForm.branchId) {
            alert(t('adminWashBay.alertEnterNameAndBranch'));
            return;
        }

        try {
            if (isEditing && editForm.id) {
                if (updateWashBay) {
                    await updateWashBay(editForm.id, { name: editForm.name, branchId: editForm.branchId });
                }
            } else {
                await createWashBay({ name: editForm.name, branchId: editForm.branchId });
            }
            handleCloseModal();
        } catch (error) {
            console.error("Lỗi khi lưu khoang rửa:", error);
            alert(t('adminWashBay.errorSavingAlert'));
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t('adminWashBay.confirmDelete'))) {
            try {
                if (deleteWashBay) {
                    await deleteWashBay(id);
                }
            } catch (error) {
                console.error("Lỗi khi xóa khoang rửa:", error);
                alert(t('adminWashBay.errorDeletingAlert'));
            }
        }
    };

    // Chỉ cần lọc theo search query vì việc lọc theo branchId đã được React Query (API) xử lý
    const filteredWashBays = washBays.filter((wb: WashBay) =>
        translateDynamic(wb.name, i18n.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
        branches.find(b => b.id === wb.branchId)?.branchName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const WASH_BAYS_PER_PAGE = 5;
    const totalWashBays = filteredWashBays?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalWashBays / WASH_BAYS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * WASH_BAYS_PER_PAGE;
    const endIndex = startIndex + WASH_BAYS_PER_PAGE;
    const paginatedWashBays = (filteredWashBays || []).slice(startIndex, endIndex);

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{t('adminWashBay.title')}</h3>
                    <p className="text-gray-500">{t('adminWashBay.subtitle')}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* BỘ LỌC CHI NHÁNH */}
                    <div className="relative flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                        <div className="pl-3 pr-2 text-gray-400">
                            <Filter className="w-4 h-4" />
                        </div>
                        <select
                            value={filterBranchId}
                            onChange={(e) => {
                                setFilterBranchId(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="py-2 pr-4 bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
                        >
                            <option value="">{t('adminWashBay.allBranches')}</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.branchName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ô TÌM KIẾM */}
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t("adminWashBay.searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 text-sm"
                        />
                    </div>

                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0 text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />{t('adminWashBay.addWashBay')}</button>
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold">{t('adminWashBay.washBayName')}</th>
                                <th className="px-6 py-4 font-semibold">{t('adminWashBay.belongsToBranch')}</th>
                                <th className="px-6 py-4 font-semibold">{t('adminWashBay.status')}</th>
                                <th className="px-6 py-4 font-semibold text-right">{t('adminWashBay.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isWashBayLoading || isLoadingBranches ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />{t('adminWashBay.loadingData')}</div>
                                    </td>
                                </tr>
                            ) : filteredWashBays.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <AlertCircle className="w-8 h-8 text-gray-400" />
                                            <p>{t('adminWashBay.noWashBayFound')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedWashBays.map((wb: WashBay) => {
                                    const branchName = branches.find(b => b.id === wb.branchId)?.branchName || "Chi nhánh không xác định";
                                    return (
                                        <tr key={wb.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                                {translateDynamic(wb.name, i18n.language)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {branchName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>{t('adminWashBay.active')}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(wb)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title={t("adminWashBay.edit")}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(wb.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title={t("adminWashBay.delete")}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 mt-2 bg-white rounded-xl border border-gray-200/80 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        {t('adminWashBay.showingWashBays', { start: startIndex + 1, end: Math.min(endIndex, totalWashBays), total: totalWashBays })}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            disabled={safeCurrentPage === 1}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >{t('adminWashBay.previous')}</button>
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
                        >{t('adminWashBay.next')}</button>
                    </div>
                </div>
            )}

            {/* Modal Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-bold text-gray-900">
                                {isEditing ? t('adminWashBay.editWashBayTitle') : t('adminWashBay.addWashBayTitle')}
                            </h4>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('adminWashBay.belongsToBranch')}<span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={editForm.branchId}
                                    onChange={(e) => setEditForm({ ...editForm, branchId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    disabled={isLoadingBranches}
                                >
                                    <option value="" disabled>{t('adminWashBay.selectBranch')}</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.branchName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('adminWashBay.washBayName')}<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder={t("adminWashBay.washBayNamePlaceholder")}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >{t('adminWashBay.cancel')}</button>
                            <button
                                onClick={handleSave}
                                disabled={isCreatingWashBay}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                {isCreatingWashBay ? t('adminWashBay.saving') : t('adminWashBay.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}