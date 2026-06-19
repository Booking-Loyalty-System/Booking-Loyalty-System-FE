import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
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
} from "lucide-react";

const initialTiers = [
  {
    id: 1,
    name: "Member",
    points: "0 - 299",
    multiplier: 1,
    color: "blue",
    icon: Award,
  },
  {
    id: 2,
    name: "Silver",
    points: "300 - 599",
    multiplier: 1.5,
    color: "gray",
    icon: Star,
  },
  {
    id: 3,
    name: "Gold",
    points: "600 - 999",
    multiplier: 2,
    color: "yellow",
    icon: Crown,
  },
  {
    id: 4,
    name: "Platinum",
    points: "1000+",
    multiplier: 3,
    color: "purple",
    icon: Gem,
  },
];

const initialRewards = [
  { id: 1, name: "Free Basic Wash", points: 200, category: "Service" },
  { id: 2, name: "10% Discount Voucher", points: 150, category: "Voucher" },
  { id: 3, name: "Free Interior Vacuum", points: 100, category: "Add-on" },
  { id: 4, name: "Ceramic Coating Upgrade", points: 500, category: "Service" },
];

export function AdminLoyalty() {
  const [tiers] = useState(initialTiers);
  const [rewards, setRewards] = useState(initialRewards);
  const [isAddingReward, setIsAddingReward] = useState(false);
  const [newReward, setNewReward] = useState({
    name: "",
    points: 0,
    category: "Service",
  });

  const handleAddReward = () => {
    if (newReward.name && newReward.points > 0) {
      setRewards([...rewards, { ...newReward, id: Date.now() }]);
      setNewReward({ name: "", points: 0, category: "Service" });
      setIsAddingReward(false);
    }
  };

  const handleDeleteReward = (id: number) => {
    setRewards(rewards.filter((r) => r.id !== id));
  };

  return (
    <Layout title="Loyalty Management" userName="Admin" role="admin">
      <div className="space-y-8">
        {/* Tier Configuration */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Membership Tiers
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              Save Tier Rules
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.id}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${tier.color}-100`}
                  >
                    <Icon className={`w-6 h-6 text-${tier.color}-600`} />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    {tier.name}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                        Points Range
                      </label>
                      <input
                        type="text"
                        defaultValue={tier.points}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                        Multiplier
                      </label>
                      <input
                        type="number"
                        defaultValue={tier.multiplier}
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Rewards Management */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Redeemable Rewards
            </h3>
            <button
              onClick={() => setIsAddingReward(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Reward
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Reward Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Points Cost
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Gift className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {reward.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {reward.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                        {reward.points} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReward(reward.id)}
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
        </section>
      </div>

      {/* Add Reward Modal */}
      {isAddingReward && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                Add New Reward
              </h4>
              <button
                onClick={() => setIsAddingReward(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reward Name
                </label>
                <input
                  type="text"
                  value={newReward.name}
                  onChange={(e) =>
                    setNewReward({ ...newReward, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Free Exterior Polish"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newReward.category}
                  onChange={(e) =>
                    setNewReward({ ...newReward, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Service</option>
                  <option>Voucher</option>
                  <option>Add-on</option>
                  <option>Merchandise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Cost
                </label>
                <input
                  type="number"
                  value={newReward.points}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      points: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={handleAddReward}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Create Reward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
