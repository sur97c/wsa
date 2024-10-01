// components/navigation/Navigation.tsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { RootState, useAppSelector } from "@lib/redux/store";
import { Roles } from '@models/Roles';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
    const userRoles = user?.customClaims?.roles ? 
        ((user.customClaims.roles as unknown) as string).split(',') : 
        [];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const filteredRoles = Roles.filter(role => 
        isAuthenticated && (
            userRoles.includes(role.key) || role.key === 'home'
        )
    );

    return (
        <nav className="bg-lightsecondary bg-opacity-80 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-dark text-lg font-bold hover:text-primaryhover">
                    <Link href="/">WSA Broker</Link>
                </div>
                <div className="hidden md:flex space-x-4">
                    {filteredRoles.map((role) => (
                        <Link
                            key={role.key}
                            href={`/${role.key}`}
                            className={`text-dark hover:text-primaryhover ${
                                pathname === `/${role.key}` ? 'text-primary font-extrabold' : ''
                            }`}
                        >
                            {role.menuLabel}
                        </Link>
                    ))}
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-dark w-6 h-6" />
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden mt-2">
                    {filteredRoles.map((role) => (
                        <Link
                            key={role.key}
                            href={`/${role.key}`}
                            className={`block py-2 text-dark hover:text-primaryhover ${
                                pathname === `/${role.key}` ? 'text-primary font-extrabold' : ''
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {role.menuLabel}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}