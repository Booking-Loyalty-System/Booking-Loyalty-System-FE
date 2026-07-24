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
            className={`group flex items-center gap-3.5 px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                    ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm'
                    : 'text-sky-100/70 hover:bg-white/10 hover:text-white'
            }`}
        >
            {icon(isActive)}
            {label}
        </Link>
    );
};