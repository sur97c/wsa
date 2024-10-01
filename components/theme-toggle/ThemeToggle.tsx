// components/theme-toggle/ThemeToggle.tsx
"use client"
import React, { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.scss';

const ThemeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark');
        document.documentElement.setAttribute('data-theme', savedTheme || 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <button className={styles.themeToggle} onClick={toggleTheme}>
            {isDarkMode ? '🌞' : '🌙'}
        </button>
    );
};

export default ThemeToggle;