// components/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store';
import { SEOProvider, ToastProvider } from '@providers';
import ProtectedRoute from './ProtectedRoute';
import { AdminLayout, PublicLayout } from '@layouts';
import { SkeletonLoader } from '@/components/ui/Skeletons/SkeletonLoader';

// Lazy loading de páginas públicas
const Home = React.lazy(() => import('@pages/public/Home'));
const About = React.lazy(() => import('@pages/public/About'));
const BlogList = React.lazy(() => import('@pages/public/BlogList'));
const BlogPost = React.lazy(() => import('@pages/public/BlogPost'));
const Contact = React.lazy(() => import('@pages/public/Contact'));
const Services = React.lazy(() => import('@pages/public/Services'));
const Login = React.lazy(() => import('@pages/auth/Login'));
const ResetPassword = React.lazy(() => import('@pages/auth/ResetPassword'));
const NotFound = React.lazy(() => import('@pages/public/NotFound'));

// Lazy loading de páginas administrativas
const BannersList = React.lazy(() => import('@pages/admin/BannersList'));
const ContactsList = React.lazy(() => import('@pages/admin/ContactsList'));
const Dashboard = React.lazy(() => import('@pages/admin/Dashboard'));
const PostsList = React.lazy(() => import('@pages/admin/PostsList'));
const Profile = React.lazy(() => import('@pages/admin/Profile'));
const RolesList = React.lazy(() => import('@pages/admin/RolesList'));
const UsersList = React.lazy(() => import('@pages/admin/UsersList'));

// Componente para manejar el scroll al cambiar de ruta
function ScrollToTop() {
    const { pathname } = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

// Componente para anunciar cambios de ruta a lectores de pantalla
function RouteAnnouncer() {
    const location = useLocation();
    const [announcement, setAnnouncement] = React.useState('');

    React.useEffect(() => {
        // Crear mensaje descriptivo basado en la ruta actual
        const pageName = location.pathname === '/'
            ? 'Página de inicio'
            : `Página ${location.pathname.replace('/', '')}`;

        setAnnouncement(`Navegando a ${pageName}`);
    }, [location]);

    return (
        <div
            role="status"
            aria-live="polite"
            className="sr-only"
        >
            {announcement}
        </div>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <ScrollToTop />
                <RouteAnnouncer />
                <ToastProvider>
                    <SEOProvider>
                        <Suspense fallback={<SkeletonLoader />}>
                            <Routes>
                                {/* Rutas públicas */}
                                <Route path="/" element={
                                    <PublicLayout>
                                        <Home />
                                    </PublicLayout>
                                } />
                                <Route path="/nosotros" element={
                                    <PublicLayout>
                                        <About />
                                    </PublicLayout>
                                } />
                                <Route path="/blog" element={
                                    <PublicLayout>
                                        <BlogList />
                                    </PublicLayout>
                                } />
                                <Route path="/blog/:slug" element={
                                    <PublicLayout>
                                        <BlogPost />
                                    </PublicLayout>
                                } />
                                <Route path="/contacto" element={
                                    <PublicLayout>
                                        <Contact />
                                    </PublicLayout>
                                } />
                                <Route path="/servicios" element={
                                    <PublicLayout>
                                        <Services />
                                    </PublicLayout>
                                } />
                                <Route path="/login" element={<Login />} />
                                <Route path="/reset-password" element={<ResetPassword />} />

                                {/* Rutas protegidas */}
                                <Route path="/admin" element={
                                    <ProtectedRoute>
                                        <AdminLayout>
                                            <Dashboard />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/banners" element={
                                    <ProtectedRoute requiredPermissions={['banner.index']}>
                                        <AdminLayout>
                                            <BannersList />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/posts" element={
                                    <ProtectedRoute requiredPermissions={['post.index']}>
                                        <AdminLayout>
                                            <PostsList />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/contacts" element={
                                    <ProtectedRoute requiredPermissions={['contact.index']}>
                                        <AdminLayout>
                                            <ContactsList />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/users" element={
                                    <ProtectedRoute requiredPermissions={['user.index']}>
                                        <AdminLayout>
                                            <UsersList />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/roles" element={
                                    <ProtectedRoute requiredPermissions={['role.index']}>
                                        <AdminLayout>
                                            <RolesList />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/profile" element={
                                    <ProtectedRoute>
                                        <AdminLayout>
                                            <Profile />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />

                                {/* Ruta 404 */}
                                <Route path="*" element={
                                    <PublicLayout>
                                        <NotFound />
                                    </PublicLayout>
                                } />
                            </Routes>
                        </Suspense>
                    </SEOProvider>
                </ToastProvider>
            </BrowserRouter>
        </Provider>
    );
}