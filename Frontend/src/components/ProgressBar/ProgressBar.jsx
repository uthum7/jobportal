// src/components/ProgressBar/ProgressBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProgressBar.module.css';

// Define the steps and their corresponding paths from your App.jsx
const steps = [
    { id: 1, path: '/cv-builder/personal-info', key: 'personalinfo' },
    { id: 2, path: '/cv-builder/education', key: 'education' },
    { id: 3, path: '/cv-builder/experience', key: 'experience' },
    { id: 4, path: '/cv-builder/skills', key: 'skills' },
    { id: 5, path: '/cv-builder/summary', key: 'summary' },
    { id: 6, path: '/cv-builder/references', key: 'references' },
    // { id: 7, path: '/cv-builder/preview', key: 'preview' },
];

const ProgressBar = ({ currentPath, completionStatus }) => {
    const navigate = useNavigate();
    const activeIndex = steps.findIndex(step => step.path === currentPath);
    const totalSteps = steps.length;

    // Calculate the width of the blue progress line
    const progressPercentage = activeIndex > 0 ? ((activeIndex) / (totalSteps - 1)) * 100 : 0;

    const handleStepClick = (path, index) => {
        // Allow navigation only to completed steps or the current active step
        const stepKey = steps[index].key;
        if (completionStatus[stepKey] || index <= activeIndex) {
            navigate(path);
        }
    };

    return (
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
                {/* --- THIS IS THE FIXED LINE --- */}
                <div className={styles.progressLine} style={{ inlineSize: `${progressPercentage}%` }}></div>
                {steps.map((step, index) => {
                    const isCompleted = completionStatus[step.key] && index < activeIndex;
                    const isActive = index === activeIndex;
                    
                    let statusClass = styles.step;
                    if (isCompleted) {
                        statusClass += ` ${styles.completed}`;
                    }
                    if (isActive) {
                        statusClass += ` ${styles.active}`;
                    }

                    return (
                        <div key={step.id} className={statusClass} onClick={() => handleStepClick(step.path, index)}>
                            <div className={styles.stepCircle}>
                                {isCompleted ? '✓' : step.id}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;