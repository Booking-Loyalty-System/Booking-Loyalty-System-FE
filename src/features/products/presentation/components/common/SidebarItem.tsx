import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
    path: string;
    label: string;
    isActive: boolean;
    icon: (isActive: boolean) => React.ReactNode;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ path, label, isActive, icon }) => {
    return (
        <Link
            to={path}
            className={`group flex items-center gap-3.5 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                isActive
                    ? 'bg-[#e6f0fa] text-[#1e6ffd]'
                    : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
            }`}
        >
            {icon(isActive)}
            {label}
        </Link>
    );
};