import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Award,
  Gift,
  Megaphone,
  History,
  Droplets,
  BarChart3,
  Car,
  UserCog,
  Bell,
  CreditCard,
  Radio,
  Package,
  FileText,
  Monitor,
} from "lucide-react";

interface SidebarProps {
  role?: "customer" | "staff" | "admin";
}

export function Sidebar({ role = "customer" }: SidebarProps) {
  const location = useLocation();

  const customerLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/booking", icon: Calendar, label: "Book Wash" },
    { to: "/tracking", icon: Radio, label: "Live Tracking" },
    { to: "/loyalty", icon: Award, label: "Loyalty & Tier" },
    { to: "/rewards", icon: Gift, label: "Rewards" },
    { to: "/promotions", icon: Megaphone, label: "Promotions" },
    { to: "/history", icon: History, label: "Booking History" },
    { to: "/vehicles", icon: Car, label: "My Vehicles" },
    { to: "/payment", icon: CreditCard, label: "Payment" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
  ];

  const staffLinks = [
    { to: "/staff", icon: LayoutDashboard, label: "Staff Dashboard" },
    { to: "/staff/queue", icon: Car, label: "Today's Queue" },
    { to: "/staff/monitor", icon: Monitor, label: "Queue Monitor" },
  ];

  const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Overview" },
    { to: "/admin/packages", icon: Package, label: "Wash Packages" },
    { to: "/admin/loyalty", icon: Award, label: "Loyalty Tiers" },
    { to: "/admin/reports", icon: FileText, label: "Reports & Analytics" },
    { to: "/admin/analytics", icon: BarChart3, label: "Customer Analytics" },
    { to: "/admin/promotions", icon: Megaphone, label: "Promotions" },
    { to: "/admin/staff", icon: UserCog, label: "Staff Management" },
  ];

  const links =
    role === "staff"
      ? staffLinks
      : role === "admin"
        ? adminLinks
        : customerLinks;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              AutoWash Pro
            </h1>
            <p className="text-xs text-gray-500">Smart Car Wash</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            location.pathname === link.to ||
            (link.to !== "/dashboard" &&
              link.to !== "/" &&
              location.pathname.startsWith(link.to));
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2026 AutoWash Pro
        </div>
      </div>
    </div>
  );
}
