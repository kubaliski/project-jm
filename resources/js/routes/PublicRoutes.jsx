// resources/js/routes/publicRoutes.jsx
import React from 'react';
import { PublicLayout } from '@layouts';
import { lazyWithRetry } from '@/utils/lazyLoad';

// Lazy loading de páginas públicas
const Home = lazyWithRetry(() => import('@pages/public/Home'));
const About = lazyWithRetry(() => import('@pages/public/About'));
const BlogList = lazyWithRetry(() => import('@pages/public/BlogList'));
const BlogPost = lazyWithRetry(() => import('@pages/public/BlogPost'));
const Contact = lazyWithRetry(() => import('@pages/public/Contact'));
const Services = lazyWithRetry(() => import('@pages/public/Services'));
const Login = lazyWithRetry(() => import('@pages/auth/Login'));
const ResetPassword = lazyWithRetry(() => import('@pages/auth/ResetPassword'));
const NotFound = lazyWithRetry(() => import('@pages/public/NotFound'));
const PrivacyPolicy = lazyWithRetry(() => import('@pages/public/PrivacyPolicy'));
const LegalNotice = lazyWithRetry(() => import('@pages/public/LegalNotice'));

export const publicRoutes = [
    {
        path: "/",
        element: (
            <PublicLayout isHomePage ={true}>
                <Home />
            </PublicLayout>
        )
    },
    {
        path: "/nosotros",
        element: (
            <PublicLayout>
                <About />
            </PublicLayout>
        )
    },
    {
        path: "/blog",
        element: (
            <PublicLayout>
                <BlogList />
            </PublicLayout>
        )
    },
    {
        path: "/blog/:slug",
        element: (
            <PublicLayout>
                <BlogPost />
            </PublicLayout>
        )
    },
    {
        path: "/contacto",
        element: (
            <PublicLayout>
                <Contact />
            </PublicLayout>
        )
    },
    {
        path: "/servicios",
        element: (
            <PublicLayout>
                <Services />
            </PublicLayout>
        )
    },
    {
        path: "/privacidad",
        element: (
            <PublicLayout>
                <PrivacyPolicy />
            </PublicLayout>
        )
    },
    {
        path: "/aviso-legal",
        element: (
            <PublicLayout>
                <LegalNotice />
            </PublicLayout>
        )
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        path: "*",
        element: (
            <PublicLayout>
                <NotFound />
            </PublicLayout>
        )
    }
];