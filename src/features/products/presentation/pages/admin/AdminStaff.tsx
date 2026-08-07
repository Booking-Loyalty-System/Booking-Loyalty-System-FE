import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Building2,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useAdminStaff } from "../../../application/useAdminStaff";

import type {
  AdminStaffResponseData,
  CreateAdminStaffInput,
  UpdateAdminStaffInput,
} from "../../../domain/models/admin-staff/admin-staff.model";

interface StaffFormState {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  branchId: string;
  isAvailable: boolean;
}

const initialForm: StaffFormState = {
  email: "",
  password: "",
  fullName: "",
  phoneNumber: "",
  branchId: "",
  isAvailable: true,
};

export const AdminStaff: React.FC = () => {
  const { t, i18n } = useTranslation("customer");

  const removeVietnameseTones = (str: string) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };
  const {
    staffs,
    branches,

    isLoading,
    isLoadingBranches,

    createStaff,
    updateStaff,

    isCreating,
    isUpdating,
  } = useAdminStaff();

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingStaff, setEditingStaff] =
    useState<AdminStaffResponseData | null>(null);

  const [form, setForm] = useState<StaffFormState>(initialForm);
  const [currentPage, setCurrentPage] = useState(1);

  // =============================
  // SEARCH
  // =============================

  const filteredStaffs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return staffs;
    }

    return staffs.filter((staff) => {
      const branchName = staff.branch?.branchName?.toLowerCase() ?? "";

      return (
        staff.fullName.toLowerCase().includes(keyword) ||
        staff.email.toLowerCase().includes(keyword) ||
        staff.phoneNumber.includes(keyword) ||
        branchName.includes(keyword)
      );
    });
  }, [staffs, search]);

  // =============================
  // RESET
  // =============================

  const resetForm = () => {
    setForm(initialForm);

    setEditingStaff(null);
  };

  // =============================
  // OPEN CREATE
  // =============================

  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // =============================
  // OPEN EDIT
  // =============================

  const handleEdit = (staff: AdminStaffResponseData) => {
    setEditingStaff(staff);

    setForm({
      email: staff.email,

      password: "",

      fullName: staff.fullName,

      phoneNumber: staff.phoneNumber,

      branchId: staff.branch?.id ?? "",

      isAvailable: staff.isAvailable,
    });

    setShowModal(true);
  };

  // =============================
  // CLOSE MODAL
  // =============================

  const handleCloseModal = () => {
    setShowModal(false);

    resetForm();
  };

  // =============================
  // SUBMIT
  // =============================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (editingStaff) {
        const data: UpdateAdminStaffInput = {
          fullName: form.fullName.trim(),

          phoneNumber: form.phoneNumber.trim(),

          branchId: form.branchId,

          isAvailable: form.isAvailable,
        };

        await updateStaff({
          id: editingStaff.id,
          data,
        });
      } else {
        const data: CreateAdminStaffInput = {
          email: form.email.trim(),

          password: form.password,

          fullName: form.fullName.trim(),

          phoneNumber: form.phoneNumber.trim(),

          branchId: form.branchId,
        };

        await createStaff(data);
      }

      handleCloseModal();
    } catch {
      // Toast đã được xử lý
      // trong mutation.
    }
  };

  // =============================
  // TOGGLE STATUS
  // =============================

  const handleToggleStatus = async (staff: AdminStaffResponseData) => {
    if (!staff.branch?.id || isUpdating) {
      return;
    }

    try {
      const data: UpdateAdminStaffInput = {
        fullName: staff.fullName,
        phoneNumber: staff.phoneNumber,
        branchId: staff.branch.id,
        isAvailable: !staff.isAvailable,
      };

      await updateStaff({
        id: staff.id,
        data,
      });
    } catch {
      // Toast đã được xử lý trong mutation.
    }
  };

  // =============================
  // DELETE
  // =============================

  // Pagination logic
  const STAFF_PER_PAGE = 5;
  const totalStaffs = filteredStaffs?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalStaffs / STAFF_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * STAFF_PER_PAGE;
  const endIndex = startIndex + STAFF_PER_PAGE;
  const paginatedStaffs = (filteredStaffs || []).slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div
        className="
                    flex flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
      >
        <div>
          <h1
            className="
                            text-3xl
                            font-black
                            tracking-tight
                            text-slate-900
                            dark:text-white
                        "
          >
            {t("adminStaff.title", { defaultValue: "Staff Management" })}
          </h1>

          <p
            className="
                            mt-1
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
          >
            {t("adminStaff.subtitle", {
              defaultValue: "Manage staff members and branch assignments.",
            })}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-white
                        shadow-lg
                        shadow-blue-500/20
                        transition
                        hover:scale-[1.02]
                    "
        >
          <Plus className="h-4 w-4" />
          {t("adminStaff.addStaff", { defaultValue: "Add Staff" })}
        </button>
      </div>

      {/* SUMMARY + SEARCH */}
      <div
        className="
                    rounded-3xl
                    border
                    border-slate-200/70
                    bg-white
                    p-5
                    shadow-sm
                    dark:border-white/5
                    dark:bg-[#0a0a0a]
                "
      >
        <div
          className="
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
        >
          <div
            className="
                            flex
                            items-center
                            gap-3
                        "
          >
            <div
              className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-50
                                text-blue-600
                                dark:bg-blue-500/10
                            "
            >
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p
                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                "
              >
                {t("adminStaff.totalStaff", { defaultValue: "Total Staff" })}
              </p>

              <p
                className="
                                    text-xl
                                    font-black
                                    text-slate-900
                                    dark:text-white
                                "
              >
                {staffs.length}
              </p>
            </div>
          </div>

          <div
            className="
                            relative
                            w-full
                            md:max-w-md
                        "
          >
            <Search
              className="
                                absolute
                                left-4
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-slate-400
                            "
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("adminStaff.searchStaff", {
                defaultValue: "Search staff...",
              })}
              className="
                                w-full
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                py-3
                                pl-11
                                pr-4
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-500/10
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-white
                            "
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div
        className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200/70
                    bg-white
                    shadow-sm
                    dark:border-white/5
                    dark:bg-[#0a0a0a]
                "
      >
        {isLoading ? (
          <div
            className="
                            flex
                            min-h-[300px]
                            items-center
                            justify-center
                            text-sm
                            font-medium
                            text-slate-500
                        "
          >
            Loading staff...
          </div>
        ) : filteredStaffs.length === 0 ? (
          <div
            className="
                            flex
                            min-h-[300px]
                            flex-col
                            items-center
                            justify-center
                            text-slate-400
                        "
          >
            <Users
              className="
                                mb-3
                                h-10
                                w-10
                            "
            />

            <p className="font-bold">No staff found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="
                                w-full
                                min-w-[900px]
                                text-sm
                            "
            >
              <thead
                className="
                                    bg-slate-50
                                    dark:bg-white/5
                                "
              >
                <tr
                  className="
                                        text-left
                                        text-[11px]
                                        font-black
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                >
                  <th className="px-6 py-4">
                    {t("adminStaff.staffTh", { defaultValue: "Staff" })}
                  </th>

                  <th className="px-6 py-4">
                    {t("adminStaff.phoneTh", { defaultValue: "Phone" })}
                  </th>

                  <th className="px-6 py-4">
                    {t("adminStaff.branch", { defaultValue: "Branch" })}
                  </th>

                  <th className="px-6 py-4">
                    {t("adminStaff.roleTh", { defaultValue: "Role" })}
                  </th>

                  <th className="px-6 py-4">
                    {t("adminStaff.status", { defaultValue: "Status" })}
                  </th>

                  <th
                    className="
                                            px-6
                                            py-4
                                            text-right
                                        "
                  >
                    {t("adminStaff.actions", { defaultValue: "Actions" })}
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedStaffs.map((staff) => (
                  <tr
                    key={staff.id}
                    className="
                                                border-t
                                                border-slate-100
                                                transition
                                                hover:bg-slate-50/70
                                                dark:border-white/5
                                                dark:hover:bg-white/[0.03]
                                            "
                  >
                    {/* STAFF */}
                    <td className="px-6 py-4">
                      <div
                        className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                      >
                        <div
                          className="
                                                            flex
                                                            h-10
                                                            w-10
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            bg-blue-50
                                                            text-blue-600
                                                            dark:bg-blue-500/10
                                                        "
                        >
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                          <p
                            className="
                                                                font-bold
                                                                text-slate-900
                                                                dark:text-white
                                                            "
                          >
                            {staff.fullName}
                          </p>

                          <div
                            className="
                                                                mt-0.5
                                                                flex
                                                                items-center
                                                                gap-1.5
                                                                text-xs
                                                                text-slate-500
                                                            "
                          >
                            <Mail className="h-3 w-3" />

                            {staff.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* PHONE */}
                    <td
                      className="
                                                    px-6
                                                    py-4
                                                    text-slate-600
                                                    dark:text-slate-300
                                                "
                    >
                      <div
                        className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                      >
                        <Phone className="h-4 w-4 text-slate-400" />

                        {staff.phoneNumber}
                      </div>
                    </td>

                    {/* BRANCH */}
                    <td
                      className="
                                                    px-6
                                                    py-4
                                                    text-slate-600
                                                    dark:text-slate-300
                                                "
                    >
                      <div
                        className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    "
                      >
                        <Building2 className="h-4 w-4 text-slate-400" />

                        {staff.branch?.branchName
                          ? t("adminBranches.branchNameFormat", {
                              name: i18n.language.startsWith("en")
                                ? removeVietnameseTones(
                                    staff.branch.branchName
                                      .replace(/ Branch/i, "")
                                      .replace(/Chi nhánh /i, "")
                                      .replace(
                                        /Quận/g,
                                        t("adminBranches.districtWord", {
                                          defaultValue: "District",
                                        }),
                                      ),
                                  )
                                : staff.branch.branchName
                                    .replace(/ Branch/i, "")
                                    .replace(/Chi nhánh /i, "")
                                    .replace(
                                      /Quận/g,
                                      t("adminBranches.districtWord", {
                                        defaultValue: "District",
                                      }),
                                    ),
                              defaultValue: staff.branch.branchName,
                            })
                          : t("adminStaff.noBranch", {
                              defaultValue: "No branch",
                            })}
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <span
                        className="
                                                        inline-flex
                                                        rounded-full
                                                        bg-indigo-50
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-bold
                                                        text-indigo-600
                                                        dark:bg-indigo-500/10
                                                        dark:text-indigo-400
                                                    "
                      >
                        {staff.role}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(staff)}
                        disabled={isUpdating}
                        title={
                          staff.isAvailable
                            ? t("adminStaff.setUnavailable", {
                                defaultValue: "Click to set Unavailable",
                              })
                            : t("adminStaff.setAvailable", {
                                defaultValue: "Click to set Available",
                              })
                        }
                        className={`
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-bold
                                                        transition-all
                                                        duration-200
                                                        hover:scale-105
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50

                                                        ${
                                                          staff.isAvailable
                                                            ? `
                                                                    bg-emerald-50
                                                                    text-emerald-600
                                                                    hover:bg-emerald-100
                                                                    dark:bg-emerald-500/10
                                                                    dark:text-emerald-400
                                                                    dark:hover:bg-emerald-500/20
                                                                `
                                                            : `
                                                                   bg-slate-100
                                                                  text-slate-500
                                                                  hover:bg-slate-200
                                                                  dark:bg-white/10
                                                                  dark:text-slate-400
                                                                  dark:hover:bg-white/15
                                                                `
                                                        }
                                                    `}
                      >
                        <span
                          className={`
                                                            h-2
                                                            w-2
                                                            rounded-full

                                                            ${
                                                              staff.isAvailable
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-400"
                                                            }
                                                        `}
                        />

                        {staff.isAvailable
                          ? t("adminStaff.available", {
                              defaultValue: "Available",
                            })
                          : t("adminStaff.unavailable", {
                              defaultValue: "Unavailable",
                            })}
                      </button>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">
                      <div
                        className="
                                                        flex
                                                        items-center
                                                        justify-end
                                                        gap-2
                                                    "
                      >
                        <button
                          type="button"
                          onClick={() => handleEdit(staff)}
                          className="
                                                            rounded-xl
                                                            p-2.5
                                                            text-blue-600
                                                            transition
                                                            hover:bg-blue-50
                                                            dark:hover:bg-blue-500/10
                                                        "
                          title="Edit staff"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 mt-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-white/10 shadow-xs">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t("bookingHistory.pagination.showing", {
                defaultValue: "Hiển thị",
              })}{" "}
              {startIndex + 1}-{Math.min(endIndex, totalStaffs)}{" "}
              {t("bookingHistory.pagination.of", { defaultValue: "của" })}{" "}
              {totalStaffs}{" "}
              {t("adminStaff.title", { defaultValue: "Nhân viên" })}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safeCurrentPage === 1}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t("bookingHistory.pagination.previous", {
                  defaultValue: "Trước",
                })}
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
                          ? "bg-blue-600 text-white shadow-sm border-blue-600"
                          : "border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t("bookingHistory.pagination.next", { defaultValue: "Tiếp" })}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        p-4
                        backdrop-blur-sm
                    "
        >
          <div
            className="
                            max-h-[90vh]
                            w-full
                            max-w-xl
                            overflow-y-auto
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-2xl
                            dark:border-white/10
                            dark:bg-[#101010]
                        "
          >
            {/* MODAL HEADER */}
            <div
              className="
                                mb-6
                                flex
                                items-center
                                justify-between
                            "
            >
              <div>
                <h2
                  className="
                                        text-xl
                                        font-black
                                        text-slate-900
                                        dark:text-white
                                    "
                >
                  {editingStaff
                    ? t("adminStaff.editStaff", { defaultValue: "Edit Staff" })
                    : t("adminStaff.addStaff", { defaultValue: "Add Staff" })}
                </h2>

                <p
                  className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    "
                >
                  {editingStaff
                    ? t("adminStaff.updateDesc", {
                        defaultValue: "Update staff information.",
                      })
                    : t("adminStaff.createDesc", {
                        defaultValue: "Create a new staff account.",
                      })}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="
                                    rounded-xl
                                    p-2
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                    dark:hover:bg-white/10
                                    dark:hover:text-white
                                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div>
                <label
                  className="
                                        mb-2
                                        block
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                >
                  {t("adminStaff.email", { defaultValue: "Email" })}
                </label>

                <input
                  type="email"
                  required
                  disabled={!!editingStaff}
                  value={form.email}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,

                      email: event.target.value,
                    }))
                  }
                  placeholder="staff@example.com"
                  className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                        dark:border-white/10
                                        dark:bg-white/5
                                        dark:text-white
                                    "
                />
              </div>

              {/* PASSWORD */}
              {!editingStaff && (
                <div>
                  <label
                    className="
                                            mb-2
                                            block
                                            text-sm
                                            font-bold
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                  >
                    {t("adminStaff.password", { defaultValue: "Password" })}
                  </label>

                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,

                        password: event.target.value,
                      }))
                    }
                    placeholder={t("adminStaff.enterPassword", {
                      defaultValue: "Enter password",
                    })}
                    className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            px-4
                                            py-3
                                            text-sm
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:ring-4
                                            focus:ring-blue-500/10
                                            dark:border-white/10
                                            dark:bg-white/5
                                            dark:text-white
                                        "
                  />
                </div>
              )}

              {/* FULL NAME */}
              <div>
                <label
                  className="
                                        mb-2
                                        block
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                >
                  {t("adminStaff.fullName", { defaultValue: "Full Name" })}
                </label>

                <input
                  required
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,

                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Nguyen Van A"
                  className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                        dark:border-white/10
                                        dark:bg-white/5
                                        dark:text-white
                                    "
                />
              </div>

              {/* PHONE */}
              <div>
                <label
                  className="
                                        mb-2
                                        block
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                >
                  {t("adminStaff.phoneNumber", {
                    defaultValue: "Phone Number",
                  })}
                </label>

                <input
                  required
                  value={form.phoneNumber}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,

                      phoneNumber: event.target.value,
                    }))
                  }
                  placeholder="0912345678"
                  className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                        dark:border-white/10
                                        dark:bg-white/5
                                        dark:text-white
                                    "
                />
              </div>

              {/* BRANCH */}
              <div>
                <label
                  className="
                                        mb-2
                                        block
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        dark:text-slate-300
                                    "
                >
                  {t("adminStaff.branch", { defaultValue: "Branch" })}
                </label>

                <select
                  required
                  disabled={isLoadingBranches}
                  value={form.branchId}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,

                      branchId: event.target.value,
                    }))
                  }
                  className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-500/10
                                        dark:border-white/10
                                        dark:bg-[#181818]
                                        dark:text-white
                                    "
                >
                  <option value="">
                    {t("adminStaff.selectBranch", {
                      defaultValue: "Select branch",
                    })}
                  </option>

                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {t("adminBranches.branchNameFormat", {
                        name: i18n.language.startsWith("en")
                          ? removeVietnameseTones(
                              branch.branchName
                                .replace(/ Branch/i, "")
                                .replace(/Chi nhánh /i, "")
                                .replace(
                                  /Quận/g,
                                  t("adminBranches.districtWord", {
                                    defaultValue: "District",
                                  }),
                                ),
                            )
                          : branch.branchName
                              .replace(/ Branch/i, "")
                              .replace(/Chi nhánh /i, "")
                              .replace(
                                /Quận/g,
                                t("adminBranches.districtWord", {
                                  defaultValue: "District",
                                }),
                              ),
                        defaultValue: branch.branchName,
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* AVAILABLE */}
              {editingStaff && (
                <div
                  className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-4
                                        dark:border-white/10
                                        dark:bg-white/5
                                    "
                >
                  <div>
                    <p
                      className="
                                                text-sm
                                                font-bold
                                                text-slate-800
                                                dark:text-white
                                            "
                    >
                      Available
                    </p>

                    <p
                      className="
                                                mt-1
                                                text-xs
                                                text-slate-500
                                            "
                    >
                      {t("adminStaff.allowAvailable", {
                        defaultValue:
                          "Allow this staff member to be available for work.",
                      })}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,

                        isAvailable: event.target.checked,
                      }))
                    }
                    className="
                                            h-5
                                            w-5
                                            accent-blue-600
                                        "
                  />
                </div>
              )}

              {/* ACTIONS */}
              <div
                className="
                                    flex
                                    justify-end
                                    gap-3
                                    pt-3
                                "
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="
                                        rounded-2xl
                                        bg-slate-100
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-200
                                        dark:bg-white/10
                                        dark:text-slate-200
                                        dark:hover:bg-white/15
                                    "
                >
                  {t("adminStaff.cancel", { defaultValue: "Cancel" })}
                </button>

                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="
                                        rounded-2xl
                                        bg-gradient-to-r
                                        from-blue-600
                                        to-indigo-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        text-white
                                        shadow-lg
                                        shadow-blue-500/20
                                        transition
                                        hover:scale-[1.02]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                >
                  {isCreating || isUpdating
                    ? t("adminStaff.saving", { defaultValue: "Saving..." })
                    : editingStaff
                      ? t("adminStaff.saveChanges", {
                          defaultValue: "Save Changes",
                        })
                      : t("adminStaff.createStaff", {
                          defaultValue: "Create Staff",
                        })}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
