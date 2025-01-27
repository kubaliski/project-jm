import React from 'react';
import { useSelector } from 'react-redux';
import { SEOManager } from '@components/common';
import { selectPublicAppInfo } from '@store/landing/selectors/publicAppInfoSelectors';

export default function PrivacyPolicy() {
    const APP_NAME = window.APP_NAME;
    const appInfo = useSelector(selectPublicAppInfo);

    return (
        <>
            <SEOManager
                title={`${APP_NAME} | Política de Privacidad`}
                description="Nuestra política de privacidad describe cómo recopilamos, usamos y protegemos tu información personal."
            />
            <main className="min-h-screen">
                {/* Hero Section */}
                <section
                    className="relative h-72 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 mt-20"
                    aria-labelledby="privacy-policy-heading"
                >
                    <div className="text-center text-white">
                        <h1
                            id="privacy-policy-heading"
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            Política de Privacidad
                        </h1>
                        <p className="text-xl md:text-2xl">
                            Protegiendo tus datos personales
                        </p>
                    </div>
                </section>

                {/* Privacy Policy Content */}
                <section
                    className="py-20 bg-gray-50"
                    aria-labelledby="privacy-policy-content-heading"
                >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-12">
                            {/* Información General */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Información General</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">
                                        En cumplimiento del Reglamento (UE) 2016/679, del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (en adelante RGPD) y la Ley Orgánica de Protección de Datos 3/2018 de 5 de Diciembre, {appInfo?.company_name} pone de manifiesto la presente Política de Privacidad respecto al tratamiento y protección de datos personales.
                                    </p>
                                    <p className="mb-4">
                                        Para {appInfo?.company_name} es muy importante la privacidad de sus datos y queremos ofrecerle una información completamente transparente sobre lo que hacemos con sus datos personales, de forma que pueda entender los usos que le damos y los derechos que tiene en relación a ellos.
                                    </p>
                                </div>
                            </div>

                            {/* Responsable del Tratamiento */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Responsable del Tratamiento</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">
                                        De conformidad con lo previsto en la normativa vigente en materia de protección de datos, se informa al usuario que los datos personales que facilite, así como cualesquiera otros datos personales que pudiera facilitar en el futuro, serán objeto de tratamiento siendo la entidad responsable del mismo:
                                    </p>
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
                            </div>

                            {/* Finalidad del Tratamiento */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Finalidad del Tratamiento</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Registro de usuarios</h4>
                                            <p>La finalidad del tratamiento de tus datos será la de gestionar el alta como usuario, proporcionarte acceso a los recursos, posibilitar la inscripción en servicios ofertados y enviarte información sobre nuevos contenidos y servicios.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Datos de curriculum vitae</h4>
                                            <p>Los datos relativos al curriculum vitae serán utilizados para la elaboración de informes individualizados, mejora de empleabilidad y propuestas de desarrollo profesional.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Datos de menores</h4>
                                            <p>Es necesario tener al menos 16 años para registrarse como usuario. En caso de duda sobre la edad, podremos solicitar verificación.</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Comunicaciones</h4>
                                            <p>Trataremos tus datos para atender consultas, enviar newsletters y mantener comunicación relacionada con nuestros servicios.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legitimación */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Legitimación del Tratamiento</h3>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <ul className="space-y-3 text-gray-600">
                                        <li className="flex items-center space-x-2">
                                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Tu consentimiento explícito</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>La existencia de un contrato de prestación de servicios</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>El cumplimiento de obligaciones legales</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Conservación */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Conservación de los Datos</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p>Los datos se conservarán durante no más tiempo del necesario para mantener el fin del tratamiento o existan prescripciones legales que dictaminen su custodia. Cuando ya no sea necesario, se suprimirán con medidas de seguridad adecuadas.</p>
                                </div>
                            </div>

                            {/* Destinatarios */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Destinatarios de sus Datos</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">Sus datos personales podrán ser comunicados a:</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">Sociedades del grupo empresarial para la prestación de servicios.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">Organismos públicos competentes, Fuerzas y Cuerpos de Seguridad del Estado y Jueces y Tribunales.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">•</div>
                                            <span className="ml-3">Prestadores de servicios que actúen como encargados del tratamiento.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Derechos */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Ejercicio de Derechos y Reclamaciones</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p className="mb-4">Puedes ejercer tus derechos de:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        {[
                                            'Acceso a tus datos personales',
                                            'Rectificación de datos inexactos',
                                            'Supresión de datos',
                                            'Limitación del tratamiento',
                                            'Oposición al tratamiento',
                                            'Portabilidad de datos'
                                        ].map((right, i) => (
                                            <div key={i} className="flex items-center space-x-2">
                                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                                                </svg>
                                                <span>{right}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p>Para ejercer estos derechos, puedes contactar mediante correo postal a {appInfo?.address} o enviando un correo electrónico a {appInfo?.contact_email}, indicando tu nombre, apellidos y adjuntando copia de documento acreditativo de tu identidad.</p>
                                    <p className="mt-4">Sin perjuicio de lo anterior, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos.</p>
                                </div>
                            </div>

                            {/* Redes Sociales */}
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Política de Privacidad en Redes Sociales</h3>
                                <div className="prose max-w-none text-gray-600">
                                    <p>{appInfo?.company_name} cuenta con perfil en las principales redes sociales de Internet. El tratamiento de los datos que se lleve a cabo de las personas que se hagan seguidoras en las redes sociales se regirá por las condiciones de uso, políticas de privacidad y normativas de acceso que pertenezcan a la red social que proceda en cada caso.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}