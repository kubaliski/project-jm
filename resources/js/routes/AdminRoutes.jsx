// resources/js/routes/adminRoutes.jsx
import React from 'react';
import { AdminLayout } from '@layouts';
import ProtectedRoute from '@components/ProtectedRoute';
import { lazyWithRetry } from '@/utils/lazyLoad';

// Lazy loading de páginas administrativas
const AppInfoList = lazyWithRetry(() => import('@pages/admin/AppInfoList'));
const BannersList = lazyWithRetry(() => import('@pages/admin/BannersList'));
const Blacklist = lazyWithRetry(() => import('@pages/admin/Blacklist'));
const ContactsList = lazyWithRetry(() => import('@pages/admin/ContactsList'));
const Dashboard = lazyWithRetry(() => import('@pages/admin/Dashboard'));
const PostsList = lazyWithRetry(() => import('@pages/admin/PostsList'));
const Profile = lazyWithRetry(() => import('@pages/admin/Profile'));
const RolesList = lazyWithRetry(() => import('@pages/admin/RolesList'));
const UsersList = lazyWithRetry(() => import('@pages/admin/UsersList'));

export const adminRoutes = [
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminLayout>
                    <Dashboard />
                </AdminLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/banners",
        element: (
            <ProtectedRoute requiredPermissions={['banner.index']}>
                <AdminLayout>
                    <BannersList />
                </AdminLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/posts",
        element: (
            <ProtectedRoute requiredPermissions={['post.index']}>
                <AdminLayout>
                    <PostsList />
                </AdminLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/contacts",
        element: (
            <ProtectedRoute requiredPermissions={['contact.index']}>
                <AdminLayout>
                    <ContactsList />
                </AdminLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/users",
        element: (
            <ProtectedRoute requiredPermissions={['user.index']}>
                <AdminLayout>
                    <UsersList />
                </AdminLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/roles",
        element: (
            <ProtectedRoute requiredPermissions={['role.index']}>
                <AdminLayout>
                    <RolesList />
                </AdminLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/profile",
        element: (
            <ProtectedRoute>
                <AdminLayout>
                    <Profile />
                </AdminLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/app-info",
        element: (
            <ProtectedRoute requiredPermissions={['appinfo.index']}>
                <AdminLayout>
                    <AppInfoList />
                </AdminLayout>
            </ProtectedRoute>
        )
    },
    {
        path: "/admin/blacklist",
        element: (
            <ProtectedRoute requiredPermissions={['security.view-blocked']}>
                <AdminLayout>
                    <Blacklist />
                </AdminLayout>
            </ProtectedRoute>
        )
    }
];