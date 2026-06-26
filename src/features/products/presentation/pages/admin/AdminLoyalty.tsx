import { useState, useEffect } from "react";
import { Layout } from "../../components/layout/Layout";
import { Award, Save, Star, Crown, Gem, Loader2 } from "lucide-react";
import { useAdminTier } from "../../../application/useAdminTier";
import { toast } from "sonner";

export function AdminLoyalty() {
  const { tiers, isLoading, updateTier } = useAdminTier();
  const [localTiers, setLocalTiers] = useState(tiers);

  useEffect(() => {
    setLocalTiers(tiers);
  }, [tiers]);

  const handleUpdate = (id: string, field: string, value: any) => {
    setLocalTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all(
        localTiers.map((tier) => updateTier({ id: tier.id, data: tier })),
      );
      toast.success("Đã lưu tất cả thay đổi!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu.");
    }
  };

  const getTierIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "gold":
        return Crown;
      case "diamond":
        return Gem;
      case "silver":
        return Star;
      default:
        return Award;
    }
  };

  return (
    <Layout title="Loyalty Management" userName="Admin" role="admin">
      <div className="space-y-8">
        {/* Membership Tiers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Membership Tiers
            </h3>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <Save className="w-4 h-4" /> Save Tier Rules
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {localTiers.map((tier) => {
                const Icon = getTierIcon(tier.tierName);
                return (
                  <div
                    key={tier.id}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-blue-50 text-blue-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      {tier.tierName}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                          Min Points
                        </label>
                        <input
                          type="number"
                          value={tier.minPointsRequired}
                          onChange={(e) =>
                            handleUpdate(
                              tier.id,
                              "minPointsRequired",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                          Multiplier
                        </label>
                        <input
                          type="number"
                          value={tier.pointRate}
                          step="0.1"
                          onChange={(e) =>
                            handleUpdate(
                              tier.id,
                              "pointRate",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Note Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm text-blue-800">
          <strong>Lưu ý:</strong> Mọi thay đổi về Multiplier sẽ ảnh hưởng trực
          tiếp đến việc tích điểm của khách hàng hạng đó.
        </div>
      </div>
    </Layout>
  );
}
