import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import healthService from '../appwrite/health';
import conf from '../appwrite/config';

/**
 * Status severity colors matching the app's theme system
 */
const STATUS_STYLES = {
    up: {
        icon: 'fa-circle-check',
        color: '#22c55e',
        bg: 'rgba(34, 197, 94, 0.1)',
        label: 'Operational',
        gradient: 'from-emerald-500 to-green-600',
    },
    degraded: {
        icon: 'fa-triangle-exclamation',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        label: 'Degraded',
        gradient: 'from-amber-500 to-yellow-600',
    },
    down: {
        icon: 'fa-circle-xmark',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.1)',
        label: 'Offline',
        gradient: 'from-red-500 to-rose-600',
    },
    checking: {
        icon: 'fa-spinner',
        color: 'var(--theme-color)',
        bg: 'var(--light-theme-color)',
        label: 'Checking...',
        gradient: 'from-[var(--theme-color)] to-[var(--theme-color)]',
    },
};

/**
 * Individual service status chip component
 * @param {{ name: string, status: string, icon: string, detail?: string }} props
 */
const ServiceChip = ({ name, status, icon, detail }) => {
    const isOk = status === 'pass' || status === 'up';
    return (
        <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-300"
            style={{
                backgroundColor: isOk ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${isOk ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}
        >
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                style={{
                    backgroundColor: isOk ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: isOk ? '#22c55e' : '#ef4444',
                }}
            >
                <i className={`fa-solid ${icon || (isOk ? 'fa-check' : 'fa-xmark')}`}></i>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
                <p
                    className="text-xs font-medium mt-0.5"
                    style={{ color: isOk ? '#22c55e' : '#ef4444' }}
                >
                    {isOk ? 'Healthy' : 'Unhealthy'}
                </p>
                {!isOk && detail && (
                    <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed break-words">
                        {detail}
                    </p>
                )}
            </div>
            <div
                className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 animate-pulse"
                style={{
                    backgroundColor: isOk ? '#22c55e' : '#ef4444',
                    boxShadow: isOk
                        ? '0 0 8px rgba(34, 197, 94, 0.5)'
                        : '0 0 8px rgba(239, 68, 68, 0.5)',
                }}
            />
        </div>
    );
};

/**
 * Shimmer skeleton loader for initial loading state
 */
const HealthSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)]" />
            <div className="space-y-2">
                <div className="h-4 w-32 rounded-lg bg-[var(--bg-tertiary)]" />
                <div className="h-3 w-24 rounded-lg bg-[var(--bg-tertiary)]" />
            </div>
        </div>
        {[...Array(4)].map((_, i) => (
            <div
                key={i}
                className="h-14 rounded-xl bg-[var(--bg-tertiary)]"
            />
        ))}
    </div>
);

const AppwriteHealth = () => {
    const navigate = useNavigate();
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [lastChecked, setLastChecked] = useState(null);

    const runCheck = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const result = await healthService.check();
            setHealthData(result);
            setLastChecked(new Date().toLocaleTimeString());
        } catch (err) {
            setError(err.message || 'Health check failed');
            setHealthData({ status: 'down', error: err.message });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        runCheck();
    }, [runCheck]);

    const status = loading ? 'checking' : (healthData?.status || 'down');
    const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.down;

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Back link */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 mb-6 group"
                >
                    <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform duration-200"></i>
                    <span>Go back</span>
                </button>

                {/* Main card */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-xl)',
                    }}
                >
                    {/* Header with status gradient */}
                    <div
                        className={`bg-gradient-to-r ${statusStyle.gradient} px-6 py-8 text-center relative overflow-hidden`}
                    >
                        {/* Decorative circles */}
                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />

                        <div className="relative">
                            {/* Status icon */}
                            <div
                                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg"
                            >
                                <i className={`fa-solid ${statusStyle.icon} text-3xl text-white ${loading ? 'animate-spin' : ''}`}></i>
                            </div>

                            {/* Status label */}
                            <h1 className="text-2xl font-bold text-white mb-1">
                                Appwrite {statusStyle.label}
                            </h1>

                            {lastChecked && (
                                <p className="text-sm text-white/70">
                                    Last checked: {lastChecked}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        {loading ? (
                            <HealthSkeleton />
                        ) : healthData?.scopeRestricted ? (
                            /* Scope restriction warning */
                            <div className="space-y-5">
                                {/* Warning banner */}
                                <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                                    <div className="bg-gradient-to-r from-amber-500 to-yellow-600 px-5 py-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                            <i className="fa-solid fa-shield-halved text-white"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Health API Scope Restricted</p>
                                            <p className="text-xs text-white/80">Server is reachable but health data is limited</p>
                                        </div>
                                    </div>
                                    <div className="px-5 py-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                            {healthData.scopeMessage}
                                        </p>
                                        <div
                                            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                                            style={{
                                                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                                                color: '#d97706',
                                            }}
                                        >
                                            <i className="fa-solid fa-lightbulb"></i>
                                            <span>
                                                <strong>Suggestion:</strong> Go to Appwrite Console → Auth → Settings →
                                                {' '}Allowed Scopes and add <code className="font-mono bg-amber-500/10 px-1 rounded">health.read</code>
                                                {' '}for guest users, or create an API key with that scope.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Fallback service status */}
                                <div className="space-y-3">
                                    <ServiceChip
                                        name="Server (reachable)"
                                        status="pass"
                                        icon="fa-server"
                                    />
                                    <ServiceChip
                                        name="Database"
                                        status="fail"
                                        icon="fa-database"
                                    />
                                    <ServiceChip
                                        name="Cache"
                                        status="fail"
                                        icon="fa-gauge-high"
                                    />
                                    <ServiceChip
                                        name="Server Time Sync"
                                        status="fail"
                                        icon="fa-clock"
                                    />
                                </div>
                            </div>
                        ) : error ? (
                            /* Error state */
                            <div className="text-center py-6">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444',
                                    }}
                                >
                                    <i className="fa-solid fa-bolt text-2xl"></i>
                                </div>
                                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Connection Error
                                </p>
                                <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                                    {error}
                                </p>
                            </div>
                        ) : (
                            /* Services grid */
                            <div className="space-y-3">
                                {healthData?.server && (
                                    <ServiceChip
                                        name="Server"
                                        status={healthData.status === 'up' ? 'pass' : 'fail'}
                                        icon="fa-server"
                                    />
                                )}
                                {healthData?.database && (
                                    <ServiceChip
                                        name="Database"
                                        status={healthData.database.status}
                                        detail={healthData.database.message || healthData.database.description || healthData.database.error}
                                        icon="fa-database"
                                    />
                                )}
                                {healthData?.cache && (
                                    <ServiceChip
                                        name="Cache"
                                        status={healthData.cache.status}
                                        detail={healthData.cache.message || healthData.cache.description || healthData.cache.error}
                                        icon="fa-gauge-high"
                                    />
                                )}
                                {healthData?.time && (
                                    <ServiceChip
                                        name="Server Time Sync"
                                        status={healthData.time.remoteTime ? 'pass' : (healthData.time.status || 'fail')}
                                        detail={healthData.time.message || healthData.time.description || healthData.time.error}
                                        icon="fa-clock"
                                    />
                                )}

                                {/* Time offset info */}
                                {healthData?.time?.offset !== undefined && healthData.time.remoteTime && (
                                    <div
                                        className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs"
                                        style={{
                                            backgroundColor: 'var(--bg-tertiary)',
                                            color: 'var(--text-muted)',
                                        }}
                                    >
                                        <span>Time offset</span>
                                        <span className="font-mono font-medium text-[var(--text-secondary)]">
                                            {healthData.time.offset >= 0 ? '+' : ''}
                                            {healthData.time.offset}ms
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 pt-1">
                            <button
                                onClick={() => runCheck(true)}
                                disabled={refreshing}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
                                style={{
                                    backgroundColor: 'var(--light-theme-color)',
                                    color: 'var(--theme-color)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--light-theme-color-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--light-theme-color)';
                                }}
                            >
                                <i className={`fa-solid fa-rotate ${refreshing ? 'animate-spin' : ''}`}></i>
                                {refreshing ? 'Refreshing...' : 'Refresh Status'}
                            </button>
                            <a
                                href={conf.appwriteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                                style={{
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid var(--border-color)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--dark-box-color)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                                }}
                            >
                                <i className="fa-solid fa-external-link"></i>
                                Open Console
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer hint */}
                <p className="text-center text-xs text-[var(--text-muted)] mt-6">
                    <i className="fa-solid fa-shield-halved mr-1.5"></i>
                    This page checks the connectivity to your Appwrite instance.
                    {!loading && healthData?.server?.version && (
                        <span className="ml-1">
                            Server v{healthData.server.version}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AppwriteHealth;
