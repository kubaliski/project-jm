import React from 'react';
import { ContactInfoCard } from './ContactInfoCard';
import { CONTACT_INFO } from './contactData';

export function ContactInfo() {
    const renderAddressContent = () => (
        <address className="text-gray-600 not-italic">
            <p>{CONTACT_INFO.address.street}</p>
            <p>{CONTACT_INFO.address.city}</p>
        </address>
    );

    const renderEmailContent = () => (
        <div className="text-gray-600">
            {CONTACT_INFO.emails.map((email, index) => (
                <React.Fragment key={email.address}>
                    <a
                        href={`mailto:${email.address}`}
                        className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    >
                        {email.address}
                    </a>
                    {index < CONTACT_INFO.emails.length - 1 && <br />}
                </React.Fragment>
            ))}
        </div>
    );

    const renderPhoneContent = () => (
        <div className="text-gray-600">
            <a
                href={`tel:${CONTACT_INFO.phone.number}`}
                className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
                {CONTACT_INFO.phone.displayNumber}
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