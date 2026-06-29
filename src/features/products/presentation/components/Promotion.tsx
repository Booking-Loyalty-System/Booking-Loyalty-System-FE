import React, { useState } from "react";
import { Tag, Sparkles, Calendar, Copy, Check } from "lucide-react";
import { usePromotion } from "@/features/products/application/usePromotion.ts";

export const Promotions: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { promotions, isLoading } = usePromotion();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center font-medium text-slate-500">
        Loading promotions...
      </div>
    );
  }

  // Đảm bảo promotions là một mảng để tránh lỗi .filter is not a function nếu api trả về undefined lúc đầu
  const safePromotions = Array.isArray(promotions) ? promotions : [];

  // Lọc data an toàn với Optional Chaining (?.) cho targetTiers vì API không có trường này
  const featuredPromos = safePromotions.filter(
    (p) => p.discountValue >= 30 || p.targetTiers?.includes("Gold"),
  );
  const activePromos = safePromotions.filter(
    (p) => !featuredPromos.find((f) => f.id === p.id),
  );

  return (
    <div className="w-full space-y-8 font-sans antialiased text-slate-800">
      {/* Banner Khuyến Mãi */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Limited Time</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Special Promotions Just for You!
          </h1>
          <p className="text-sm md:text-base text-orange-50 opacity-90 leading-relaxed">
            Save big with our exclusive member promotions and tier-based
            rewards. Check back regularly for new offers!
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <p className="text-xs text-orange-100 font-medium">Your Tier</p>
              <p className="text-sm font-bold mt-0.5">Gold Member</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <p className="text-xs text-orange-100 font-medium">
                Active Promotions
              </p>
              <p className="text-sm font-bold mt-0.5">
                {activePromos.length + featuredPromos.length} Available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Promotions Section */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">
          Featured Promotions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredPromos.map((promo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative flex flex-col justify-between group"
            >
              <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    {/* Fallback sang .title nếu mock data dùng title, còn api thật dùng name */}
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {promo.name || promo.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {promo.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {/* Render an toàn: Chỉ hiển thị thẻ targetTiers khi mảng này có tồn tại */}
                      {promo.targetTiers && promo.targetTiers.length > 0 && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                          {promo.targetTiers.join(", ")}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Until{" "}
                          {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo Code Box */}
                <div className="mt-5 bg-slate-50/80 rounded-xl p-4 flex items-center justify-between gap-4 border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      Promo Code
                    </p>
                    <p className="text-base font-mono font-bold text-blue-600 tracking-wide">
                      {promo.code}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Điều khoản sử dụng */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Terms & Conditions:
                </h4>
                <ul className="text-xs text-slate-500 font-medium space-y-1 list-disc pl-4 leading-relaxed">
                  {/* Dùng Optional Chaining để tránh crash nếu conditions là undefined */}
                  {promo.conditions?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                  {(!promo.conditions || promo.conditions.length === 0) && (
                    <li>
                      Áp dụng cho các hóa đơn thỏa mãn điều kiện tối thiểu.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Active Promotions Grid */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">
          All Active Promotions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePromos.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  {/* Sử dụng item.name (cho API) hoặc item.title (cho mock) */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {item.name || item.title}
                  </h3>

                  {item.targetTiers && item.targetTiers.length > 0 && (
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-md mt-1">
                      {item.targetTiers.join(", ")}
                    </span>
                  )}

                  <p className="text-sm text-slate-500 font-medium pt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Code
                  </p>
                  <p className="text-sm font-mono font-bold text-blue-600 mt-0.5">
                    {item.code}
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Until {new Date(item.endDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold">
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
