// components/notification/Notification.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NotificationProps {
    icon: IconDefinition;
    iconColor?: string;
    title: string;
    message: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
    icon,
    iconColor = 'text-primary',
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryButtonClick,
    onSecondaryButtonClick
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:shrink-0 p-4 flex justify-center items-center md:items-start">
                        <FontAwesomeIcon icon={icon} className={`h-12 w-12 ${iconColor}`} />
                    </div>
                    <div className="p-4 md:p-6">
                        <div className="uppercase tracking-wide text-sm text-primary font-semibold">{title}</div>
                        <p className="mt-2 text-slate-500">{message}</p>
                        {(primaryButtonText || secondaryButtonText) && (
                            <div className='mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2'>
                                {secondaryButtonText && (
                                    <button
                                        onClick={onSecondaryButtonClick}
                                        className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 w-full sm:w-auto'
                                    >
                                        {secondaryButtonText}
                                    </button>
                                )}
                                {primaryButtonText && (
                                    <button
                                        onClick={onPrimaryButtonClick}
                                        className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover w-full sm:w-auto'
                                    >
                                        {primaryButtonText}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;