import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, HomeIcon, DocumentTextIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ onExpandChange }) {
    const location = useLocation();
    const [isPinned, setIsPinned] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const navItems = [
        {
            path: '/admin',
            label: 'Dashboard',
            icon: HomeIcon
        },
        {
            path: '/admin/posts',
            label: 'Posts',
            icon: DocumentTextIcon
        },
        {
            path: '/admin/contacts',
            label: 'Comunicaciones',
            icon: ChatBubbleBottomCenterIcon
        },
    ];

    const isExpanded = isPinned || isHovered;

    useEffect(() => {
        onExpandChange?.(isExpanded);
    }, [isExpanded, onExpandChange]);

    return (
        <div
            onMouseEnter={() => !isPinned && setIsHovered(true)}
            onMouseLeave={() => !isPinned && setIsHovered(false)}
            className={`fixed inset-y-0 left-0 bg-gray-900 transition-all duration-300 z-10 ${
                isExpanded ? 'w-64' : 'w-20'
            }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center h-16 px-4 bg-gray-800 overflow-hidden">
                    <div className={`transition-all duration-300 overflow-hidden ${
                        isExpanded ? 'w-40 opacity-100' : 'w-0 opacity-0'
                    }`}>
                        <h1 className="text-xl font-bold text-white whitespace-nowrap">Panel Admin</h1>
                    </div>
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className={`p-1 text-gray-300 hover:text-white transition-colors ${
                            !isExpanded ? 'mx-auto' : 'ml-auto'
                        }`}
                    >
                        {isPinned ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path === '/admin'
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <Icon className="w-6 h-6" />
                                <span className={`transition-all duration-300 overflow-hidden ${
                                    isExpanded ? 'ml-3 w-32 opacity-100' : 'w-0 opacity-0'
                                }`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}