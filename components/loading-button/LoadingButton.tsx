import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface LoadingButtonProps {
    loading: boolean;
    faIcon: IconDefinition;
    label?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    ariaLabel?: string;
    className?: string;
    type?: 'button' | 'submit';
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    loading,
    faIcon,
    label,
    onClick,
    ariaLabel,
    className = '',
    type = 'button',
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            aria-label={ariaLabel || label}
            className={`bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover w-full md:w-auto flex items-center justify-center ${className}`}
            disabled={loading}
        >
            {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
                <FontAwesomeIcon icon={faIcon} />
            )}
        </button>
    );
};

export default LoadingButton;
