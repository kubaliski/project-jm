import React from 'react';
import { useSelector } from 'react-redux';
import { ContactInfoCard } from './ContactInfoCard';
import { CONTACT_INFO } from './contactData';
import { selectPublicAppInfo } from '@/store/landing/selectors/publicAppInfoSelectors';


export function ContactInfo() {
    const appInfo = useSelector(selectPublicAppInfo);
    const defaultEmail = CONTACT_INFO.emails[0].address;
    const defaultAddressStreet = CONTACT_INFO.address.street;
    const defaultAddressCity = CONTACT_INFO.address.city;
    const defaultPhone = CONTACT_INFO.phone.number;
    const address = appInfo?.address || `${defaultAddressStreet}, ${defaultAddressCity}`;
    const email = appInfo?.contact || defaultEmail;
    const phone = appInfo?.phone_1 || defaultPhone;




    const renderAddressContent = () => {
        const firstCommaIndex = address.indexOf(',');
        const street = address.slice(0, firstCommaIndex);
        const restOfAddress = address.slice(firstCommaIndex + 1).trim();
        return (
            <address className="text-gray-600 not-italic">
                <p>{street}</p>
                <p>{restOfAddress}</p>
            </address>
        );
    };
    const renderEmailContent = () => (
        <div className="text-gray-600">
            <a
                href={`mailto:${email}`}
                className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
                {email}
            </a>
        </div>
    );
    const renderPhoneContent = () => (
        <div className="text-gray-600">
            <a
                href={`tel:${phone}`}
                className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
                {phone}
            </a>
            <p>
                <span className="sr-only">Horario de atención: </span>
                {CONTACT_INFO.phone.hours}
            </p>
        </div>
    );

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            role="list"
        >
            <ContactInfoCard
                type="location"
                title="Ubicación"
                content={renderAddressContent()}
            />
            <ContactInfoCard
                type="email"
                title="Email"
                content={renderEmailContent()}
            />
            <ContactInfoCard
                type="phone"
                title="Teléfono"
                content={renderPhoneContent()}
            />
        </div>
    );
}