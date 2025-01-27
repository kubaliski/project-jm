import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPublicAppInfo } from "@/store/landing/selectors/publicAppInfoSelectors";
import { FacebookIcon, InstragramIcon, LinkedInIcon } from "@/assets/icons";

export default function Footer() {
    const appInfo = useSelector(selectPublicAppInfo);
    const defaultEmail = "info@example.com";
    const defaultPhone = "+34 166 666 666";
    const defaultAddress = "Calle Falsa 123, 28000 Madrid";
    const contactEmail = appInfo?.contact_email || defaultEmail;
    const phoneNumber = appInfo?.phone_1 || defaultPhone;
    const address = appInfo?.address || defaultAddress;
    return (
        <footer
            className="bg-blue-900 text-blue-200"
            role="contentinfo"
            aria-label="Pie de página"
        >
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Sobre Nosotros
                        </h3>
                        <p className="text-sm text-blue-200/90">
                            Descripción breve de tu empresa o proyecto.
                        </p>
                    </div>
                    <nav aria-label="Enlaces del pie de página">
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Enlaces
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/servicios"
                                    className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                >
                                    Servicios
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/nosotros"
                                    className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                >
                                    Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contacto"
                                    className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                >
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                >
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Contacto
                        </h3>
                        <address className="not-italic">
                            <ul className="space-y-2 text-sm text-blue-200/90">
                                <li>
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                    >
                                        {contactEmail}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`tel:${phoneNumber}`}
                                        className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                    >
                                        {phoneNumber}
                                    </a>
                                </li>
                                <li>{address}</li>
                            </ul>
                        </address>
                    </div>
                    <nav aria-label="Enlaces legales">
                        <h3 className="text-white text-lg font-semibold mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/privacidad"
                                    className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                >
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terminos"
                                    className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                >
                                    Términos de Uso
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin"
                                    className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900"
                                >
                                    Área de gestión
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div>
                        <h3
                            className="text-white text-lg font-semibold mb-4"
                            id="social-heading"
                        >
                            Síguenos
                        </h3>
                        <nav
                            aria-labelledby="social-heading"
                            className="flex space-x-4"
                        >
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 p-1"
                                aria-label="Síguenos en Facebook"
                            >
                                <FacebookIcon
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 p-1"
                                aria-label="Síguenos en Instagram"
                            >
                                <InstragramIcon
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-200/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 p-1"
                                aria-label="Síguenos en LinkedIn"
                            >
                                <LinkedInIcon
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </nav>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-blue-800/50 text-sm text-center text-blue-200/80">
                    <p>
                        © {new Date().getFullYear()} WedPlan. Todos los derechos
                        reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
