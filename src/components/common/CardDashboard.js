import { useEffect, useState } from 'react';
import CardPrev from '../cardPrev/CardPrev'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { dbService } from '../../appwrite/auth';
import { storeData } from '../../data/slices/databaseSlice';
import { useLocation } from 'react-router-dom';

// Extract card title from the Data JSON string stored in Appwrite
const extractCardTitle = (dataStr) => {
    try {
        const parsed = JSON.parse(dataStr);
        return parsed.__cardTitle || null;
    } catch (e) {
        return null;
    }
};

// Skeleton card item for sidebar
const SidebarSkeletonItem = ({ delay }) => (
    <div className="flex items-center gap-2.5 px-3 py-2.5 my-1 rounded-lg" style={{ animationDelay: `${delay}s` }}>
        <div className="w-5 h-5 rounded-md shimmer flex-shrink-0"></div>
        <div className="h-3.5 w-24 shimmer rounded-md"></div>
    </div>
);

const CardDashboard = () => {

    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();
    const headers = location.search;
    const user_ID = useSelector(state => state.auth.userData?.$id);
    const dispatch = useDispatch();

    useEffect(() => {
        // AbortController cancels stale work: the cleanup aborts on re-run or
        // unmount, and the .then/.catch/.finally callbacks bail before
        // touching state.
        const controller = new AbortController();
        setLoading(true);
        dbService.fetchdata()
            .then((data) => {
                if (controller.signal.aborted) return;
                setData(data);
                dispatch(storeData(data));
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                console.error('Failed to load dashboard data:', error.message);
            })
            .finally(() => {
                // Clear loading on both success and failure, but only for the
                // current run, so a stale run can't write loading=false over
                // newer work.
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [dispatch])

    const filteredCards = data ? data.filter(item => item.UserID === user_ID) : [];

    // Close mobile sidebar when a card is selected
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [headers]);

    return (
        <>
            <div className="card-MainContainer fade-in">
                {/* Desktop sidebar */}
                <div className="card-sideContainer hidden md:flex">
                    <div className="header">
                        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">My Cards</span>
                        <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">{filteredCards.length}</span>
                    </div>
                    <div className="px-3 pb-2">
                        <Link to={'/card'}>
                            <button type="button" className="w-full bg-gradient-to-r from-[var(--theme-color)] to-[color-mix(in_srgb,var(--theme-color)_80%,#6366f1)] text-white font-medium rounded-xl text-sm px-4 py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--theme-color)]/30 hover:-translate-y-0.5 active:translate-y-0">
                                <i className="fa-solid fa-plus mr-1.5"></i> New Card
                            </button>
                        </Link>
                    </div>
                    <div className="mt-2 px-3">
                        {loading ? (
                            <div className="mt-3 space-y-1">
                                <SidebarSkeletonItem delay={0} />
                                <SidebarSkeletonItem delay={0.06} />
                                <SidebarSkeletonItem delay={0.12} />
                                <SidebarSkeletonItem delay={0.18} />
                            </div>
                        ) : (
                            <ul>
                                {filteredCards.length > 0 ? (
                                    filteredCards.map((item) => {
                                        return (
                                            <li key={item.$id} className={`rounded-md my-2 ${headers === `?${item.$id}` ? 'active' : ''
                                                }`}>
                                                <Link to={`/dashboard?${item.$id}`}>
                                                    <i className="fa-regular fa-credit-card mr-2 text-[var(--text-muted)]"></i>
                                                    <span className="truncate">{(item.Data ? extractCardTitle(item.Data) : null) || 'Untitled Card'}</span>
                                                </Link>
                                            </li>
                                        )
                                    })
                                ) : (
                                    <li className="!cursor-default !hover:bg-transparent !border-transparent justify-center text-sm text-[var(--text-muted)] py-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="fa-regular fa-credit-card text-2xl"></i>
                                            <span>No cards yet</span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Mobile sidebar — collapsible top bar */}
                <div className="md:hidden w-full border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                    <div className="flex items-center justify-between px-4 h-12">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">My Cards</span>
                            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded-full">{filteredCards.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to={'/card'}>
                                <button type="button" className="text-xs bg-gradient-to-r from-[var(--theme-color)] to-[color-mix(in_srgb,var(--theme-color)_80%,#6366f1)] text-white font-medium rounded-lg px-3 py-1.5 transition-all duration-300 hover:shadow-md hover:shadow-[var(--theme-color)]/25">
                                    <i className="fa-solid fa-plus mr-1"></i> New
                                </button>
                            </Link>
                            <button
                                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] transition-colors"
                                aria-label="Toggle card list"
                            >
                                <svg className={`w-4 h-4 transition-transform duration-200 ${mobileSidebarOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {mobileSidebarOpen && (
                        <div className="px-4 pb-3 slide-up">
                            {loading ? (
                                <div className="space-y-1">
                                    <SidebarSkeletonItem delay={0} />
                                    <SidebarSkeletonItem delay={0.06} />
                                </div>
                            ) : filteredCards.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                    {filteredCards.map((item) => (
                                        <Link
                                            key={item.$id}
                                            to={`/dashboard?${item.$id}`}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                headers === `?${item.$id}`
                                                    ? 'bg-[var(--light-theme-color)] text-[var(--theme-color)] font-medium'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                                            }`}
                                        >
                                            <i className="fa-regular fa-credit-card text-xs text-[var(--text-muted)]"></i>
                                            <span className="truncate">{(item.Data ? extractCardTitle(item.Data) : null) || 'Untitled Card'}</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-[var(--text-muted)] text-xs">
                                    <i className="fa-regular fa-credit-card mr-1.5"></i>
                                    No cards yet
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {
                    headers ?
                        <>
                            <div className='flex-1 card-view-con p-4 sm:p-6 overflow-y-scroll h-[calc(100vh-56px)]'>
                                {loading ? (
                                    <div className="max-w-md mx-auto scale-in">
                                        {/* Card preview skeleton */}
                                        <div className="w-full rounded-xl mb-5 shadow-card overflow-hidden">
                                            <div className="w-full min-h-[16vh] shimmer"></div>
                                            <div className="bg-[var(--bg-primary)] p-6 space-y-4">
                                                <div className="flex justify-center -mt-10">
                                                    <div className="w-16 h-16 rounded-full shimmer border-2 border-[var(--bg-primary)]"></div>
                                                </div>
                                                <div className="space-y-3 pt-4">
                                                    <div className="h-6 w-3/4 mx-auto shimmer rounded-md"></div>
                                                    <div className="h-4 w-1/2 mx-auto shimmer rounded-md"></div>
                                                </div>
                                                <div className="space-y-2.5 pt-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl shimmer flex-shrink-0"></div>
                                                        <div className="flex-1 space-y-1.5">
                                                            <div className="h-3.5 w-3/5 shimmer rounded-md"></div>
                                                            <div className="h-3 w-2/5 shimmer rounded-md"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl shimmer flex-shrink-0"></div>
                                                        <div className="flex-1 space-y-1.5">
                                                            <div className="h-3.5 w-1/2 shimmer rounded-md"></div>
                                                            <div className="h-3 w-2/5 shimmer rounded-md"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-md mx-auto">
                                        <CardPrev />
                                    </div>
                                )}
                            </div>
                        </> : (
                            <div className='flex-1 flex items-center justify-center text-[var(--text-muted)] px-4'>
                                <div className="text-center scale-in">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--theme-color)] to-[color-mix(in_srgb,var(--theme-color)_70%,#6366f1)] mb-5 shadow-xl shadow-[var(--theme-color)]/20">
                                        <i className="fa-regular fa-credit-card text-3xl text-white"></i>
                                    </div>
                                    <p className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Select a card to preview</p>
                                    <p className="text-sm text-[var(--text-muted)] mt-2 max-w-[280px] mx-auto">Choose a card from the sidebar or create a new one to get started</p>
                                    <Link to={'/card'}>
                                        <button className="mt-6 bg-gradient-to-r from-[var(--theme-color)] to-[color-mix(in_srgb,var(--theme-color)_80%,#6366f1)] text-white rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[var(--theme-color)]/30 hover:-translate-y-0.5 inline-flex items-center gap-2">
                                            <i className="fa-solid fa-plus"></i>
                                            Create Card
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )
                }
            </div>
        </>
    )
}

export default CardDashboard