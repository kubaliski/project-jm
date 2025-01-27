import React from 'react';
import { useSelector } from 'react-redux';
import { SEOManager } from '@components/common';
import { selectPublicAppInfo } from '@store/landing/selectors/publicAppInfoSelectors';

export default function LegalNotice() {
    const APP_NAME = window.APP_NAME;
    const appInfo = useSelector(selectPublicAppInfo);

    return (
        <>
            <SEOManager
                title={`${APP_NAME} | Aviso Legal`}
                description="Información legal sobre las condiciones de uso de nuestro sitio web."
            />
            <main className="min-h-screen">
                {/* Hero Section */}
                <section
                    className="relative h-72 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 mt-20"
                    aria-labelledby="legal-notice-heading"
                >
                    <div className="text-center text-white">
                        <h1
                            id="legal-notice-heading"
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            Aviso Legal
                        </h1>
                        <p className="text-xl md:text-2xl">
                            Condiciones generales de uso
                        </p>
                    </div>
                </section>

                {/* Legal Notice Content */}
                <section
                    className="py-20 bg-gray-50"
                    aria-labelledby="legal-notice-content-heading"
                >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-12">
                            {/* Introducción LSSI */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Ley 34/2002 (LSSI)</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">
                                        {appInfo?.company_name}, responsable del sitio web, pone a disposición de los usuarios el presente documento, con el que pretende dar cumplimiento a las obligaciones dispuestas en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), así como informar a todos los usuarios del sitio web respecto a cuáles son las condiciones de uso.
                                    </p>
                                    <p>
                                        Toda persona que acceda a este sitio web asume el papel de usuario, comprometiéndose a la observancia y cumplimiento riguroso de las disposiciones aquí dispuestas, así como a cualquier otra disposición legal que fuera de aplicación.
                                    </p>
                                </div>
                            </div>

                            {/* Datos Identificativos */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Datos Identificativos</h3>
                                <div className="bg-gray-50 p-6 rounded-lg mb-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-blue-600 font-medium">Empresa:</span>
                                            <span className="text-gray-700">{appInfo?.company_name}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-blue-600 font-medium">Dirección:</span>
                                            <span className="text-gray-700">{appInfo?.address}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-blue-600 font-medium">Email:</span>
                                            <span className="text-gray-700">{appInfo?.contact_email}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-blue-600 font-medium">Teléfono:</span>
                                            <span className="text-gray-700">{appInfo?.phone_1}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Condiciones de Uso */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Condiciones Generales de Uso</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">
                                        El usuario que acceda a nuestra web, acepta las siguientes condiciones:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">Aportar información veraz y lícita en los formularios de la web.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">Hacer un uso adecuado de los contenidos y servicios ofrecidos.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">No incurrir en actividades ilícitas o contrarias a la buena fe y al orden público.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Propiedad Intelectual */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Propiedad Intelectual e Industrial</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">
                                        Todos los derechos de propiedad industrial e intelectual sobre esta página web, así como de los elementos contenidos en la misma (imágenes, software, textos, marcas, logotipos, diseño, etc.), están legalmente reservados.
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-3">Restricciones de uso:</h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-center space-x-2">
                                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                                                </svg>
                                                <span>Uso exclusivamente personal y privado</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                                                </svg>
                                                <span>Prohibida la reproducción sin autorización</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                                                </svg>
                                                <span>Respeto a los derechos de propiedad intelectual</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Exclusión de Garantías */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Exclusión de Garantías y Responsabilidad</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">
                                        {appInfo?.company_name} no se hace responsable de:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">La falta de disponibilidad y continuidad del funcionamiento del sitio web.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">La existencia de malware o programas maliciosos.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">El uso ilícito, negligente o fraudulento del sitio web.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Legislación y Jurisdicción */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Legislación Aplicable y Jurisdicción</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">
                                        El presente Aviso Legal se rige por la legislación española. Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web, serán competentes los Juzgados y Tribunales más cercanos a {appInfo?.city || 'nuestra sede'}.
                                    </p>
                                </div>
                            </div>

                            {/* Contacto */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contacto</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p>
                                        Para cualquier duda acerca de estas condiciones legales o cualquier comentario sobre el portal, por favor diríjase a {appInfo?.contact_email}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}