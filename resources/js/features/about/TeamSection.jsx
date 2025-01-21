import React from 'react';
import { TeamMemberCard } from './TeamMemberCard';
import { TEAM_MEMBERS } from './aboutData';

export function TeamSection() {
    return (
        <section
            className="py-20 bg-white"
            aria-labelledby="equipo-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="equipo-heading"
                    className="text-3xl font-bold text-center mb-12"
                >
                    Nuestro Equipo
                </h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    role="list"
                >
                    {TEAM_MEMBERS.map((member) => (
                        <TeamMemberCard
                            key={member.id}
                            name={member.name}
                            position={member.position}
                            description={member.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}