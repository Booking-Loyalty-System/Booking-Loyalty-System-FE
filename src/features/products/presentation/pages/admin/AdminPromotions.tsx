import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  Megaphone,
  Plus,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const initialPromotions = [
  {
    id: 1,
    title: "Weekend Special - 30% Off",
    type: "Discount",
    status: "Active",
    usage: "145/500",
    expiry: "2026-05-31",
  },
  {
    id: 2,
    title: "Gold Member Exclusive",
    type: "Exclusive",
    status: "Active",
    usage: "89/200",
    expiry: "2026-06-15",
  },
  {
    id: 3,
    title: "Referral Bonus",
    type: "Bonus",
    status: "Active",
    usage: "312",
    expiry: "Ongoing",
  },
  {
    id: 4,
    title: "Old Spring Sale",
    type: "Discount",
    status: "Inactive",
    usage: "500/500",
    expiry: "2026-04-30",
  },
];

export function AdminPromotions() {
  const [promotions] = useState(initialPromotions);
  const [isCreating, setIsCreating] = useState(false);

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
            onClick={() => setIsCreating(true)}
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
            <p className="text-3xl font-bold text-gray-900">3</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Redeemed (May)</p>
            <p className="text-3xl font-bold text-blue-600">546</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Revenue via Promos</p>
            <p className="text-3xl font-bold text-green-600">$4,280</p>
          </div>
        </div>

        {/* Promotions List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Promotion Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Type
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
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          promo.status === "Active"
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Megaphone
                          className={`w-5 h-5 ${
                            promo.status === "Active"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {promo.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {promo.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {promo.status === "Active" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          promo.status === "Active"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {promo.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {promo.usage}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {promo.expiry}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promotion Sidebar/Modal (simplified) */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-bold text-gray-900">New Campaign</h4>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Summer Sizzler 20% Off"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Promotion Type
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Percentage Discount</option>
                    <option>Fixed Amount Off</option>
                    <option>Bonus Points</option>
                    <option>Free Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Value
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="20% or $15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Tier
                </label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Member", "Silver", "Gold", "Platinum"].map(
                    (tier) => (
                      <button
                        key={tier}
                        type="button"
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
                      >
                        {tier}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
