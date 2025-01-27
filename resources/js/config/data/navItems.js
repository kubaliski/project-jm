// src/config/navItems.js
import {
    HomeIcon,
    DocumentTextIcon,
    ChatBubbleBottomCenterIcon,
    UserGroupIcon,
    DocumentCheckIcon,
    ArrowUpOnSquareIcon,
    IdentificationIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export const navItems = [
    {
        group: "General",
        items: [
            {
                path: "/admin",
                label: "Dashboard",
                icon: HomeIcon,
                permissions: [],
            },
            {
                path: "/admin/banners",
                label: "Banners",
                icon: ArrowUpOnSquareIcon,
                permissions: ["banner.index"],
            },
            {
                path: "/admin/posts",
                label: "Posts",
                icon: DocumentTextIcon,
                permissions: ["post.index"],
            },
            {
                path: "/admin/contacts",
                label: "Comunicaciones",
                icon: ChatBubbleBottomCenterIcon,
                permissions: ["contact.index"],
            },
        ],
    },
    {
        group: "Gestión",
        items: [
            {
                path: "/admin/app-info",
                label: "Información",
                icon: IdentificationIcon,
                permissions: ["appinfo.index"],
            },
            {
                path: "/admin/blacklist",
                label: "Seguridad",
                icon: ShieldCheckIcon,
                permissions: ["security.view-blocked"],
            },
            {
                path: "/admin/users",
                label: "Usuarios",
                icon: UserGroupIcon,
                permissions: ["user.index"],
            },
            {
                path: "/admin/roles",
                label: "Roles",
                icon: DocumentCheckIcon,
                permissions: ["role.index"],
            },
        ],
    },
];