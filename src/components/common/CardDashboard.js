import React, { useEffect, useState } from 'react';
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

const CardDashboard = () => {


    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const headers = location.search;
    const user_ID = useSelector(state => state.auth.userData.$id);
    const dispatch = useDispatch();

    useEffect(() => {
        const addData = async () => {
            setLoading(true);
            let data = await dbService.fetchdata();
            setData(data)
            dispatch(storeData(data))
            setLoading(false);
        }
        addData();
    }, [dispatch])

    const filteredCards = data ? data.filter(item => item.UserID === user_ID) : [];

    // Skeleton card item for sidebar
    const SidebarSkeletonItem = ({ delay }) => (
        <div className="flex items-center gap-2.5 px-3 py-2.5 my-1 rounded-lg" style={{ animationDelay: `${delay}s` }}>
            <div className="w-5 h-5 rounded-md shimmer flex-shrink-0"></div>
            <div className="h-3.5 w-24 shimmer rounded-md"></div>
        </div>
    );

    return (
        <>
            <div className="card-MainContainer fade-in">
                <div className="card-sideContainer">
                    <div className="header">
                        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">My Cards</span>
                    </div>
                    <Link to={'/card'} >
                        <button type="button" className="w-[calc(100%-16px)] mx-2 themeBg text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-all duration-200 hover:brightness-90 hover:shadow-lg hover:shadow-[var(--theme-color)]/20">
                            <i className="fa-solid fa-plus mr-1.5"></i> New Card
                        </button>
                    </Link>
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
                                    filteredCards.map((item, index) => {
                                        return (
                                            <li key={index} className={`rounded-md my-2 ${headers === `?${item.$id}` ? 'active' : ''
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
                {
                    headers ?
                        <>
                            <div className='flex-1 card-view-con p-6  overflow-y-scroll h-[calc(100vh-61px)]'>
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
                            <div className='flex-1 flex items-center justify-center text-[var(--text-muted)]'>
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl themeLgbg mb-5">
                                        <i className="fa-regular fa-credit-card text-3xl textTheme"></i>
                                    </div>
                                    <p className="text-lg font-semibold text-[var(--text-primary)]">Select a card to preview</p>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">Choose a card from the sidebar or create a new one</p>
                                    <Link to={'/card'}>
                                        <button className="mt-5 themeBg text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:brightness-90 hover:shadow-lg hover:shadow-[var(--theme-color)]/30 inline-flex items-center gap-2">
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