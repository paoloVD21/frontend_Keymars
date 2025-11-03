import React, { type ReactNode } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    isLoading?: boolean;
    trend?: {
        value: string;
        label: string;
        isPositive?: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, isLoading = false }) => {
    return (
        <div className={`${styles.card} ${isLoading ? styles.loading : ''}`}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.title}>{title}</span>
                    <div className={styles.iconContainer}>
                        {icon}
                    </div>
                </div>
                {isLoading ? (
                    <div className={styles.skeleton}>
                        <div className={styles.skeletonValue}></div>
                        <div className={styles.skeletonTrend}></div>
                    </div>
                ) : (
                    <div className={styles.valueContainer}>
                        <span className={styles.value}>{value}</span>
                        {trend && (
                            <div className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
                                <span>{trend.value}</span>
                                <span className={styles.trendLabel}>{trend.label}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};