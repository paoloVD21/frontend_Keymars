import React from 'react';
import styles from './StatsWidget.module.css';

interface StatsWidgetProps {
    title: string;
    value: string;
    icon: string;
    highlight?: boolean;
    isLoading?: boolean;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
    title,
    value,
    icon,
    highlight = false,
    isLoading = false
}) => {
    return (
        <div className={`${styles.statsWidget} ${highlight ? styles.highlight : ''}`}>
            <div className={styles.iconContainer}>
                <span className="material-icons">{icon}</span>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                {isLoading ? (
                    <div className={styles.skeleton}></div>
                ) : (
                    <p className={styles.value}>{value}</p>
                )}
            </div>
        </div>
    );
};

export default StatsWidget;