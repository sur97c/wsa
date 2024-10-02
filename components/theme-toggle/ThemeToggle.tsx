// components/theme-toggle/ThemeToggle.tsx
"use client"
import React, { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.scss';

const themes = ['light', 'dark', 'nature', 'ocean'] as const;
type Theme = typeof themes[number];

const themeEmojis: Record<Theme, string> = {
  light: '☀️',
  dark: '🌙',
  nature: '🌿',
  ocean: '🌊'
};

const ThemeToggle: React.FC = () => {
    const [currentTheme, setCurrentTheme] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (themes.includes(savedTheme)) {
            setCurrentTheme(savedTheme);
            document.documentElement.className = `theme-${savedTheme}`;
        }
    }, []);

    const cycleTheme = () => {
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];
        
        setCurrentTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.className = `theme-${newTheme}`;
    };

    return (
        <button className={styles.themeToggle} onClick={cycleTheme}>
            {themeEmojis[currentTheme]}
        </button>
    );
};

export default ThemeToggle;