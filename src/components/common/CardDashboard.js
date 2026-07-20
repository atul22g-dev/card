import React, { useEffect, useState } from 'react';
import CardPrev from '../cardPrev/CardPrev'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { dbService } from '../../appwrite/auth';
import { storeData } from '../../data/slices/databaseSlice';
import { useLocation } from 'react-router-dom';

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
                            <div className="space-y-2 mt-4">
                                <div className="h-8 shimmer rounded-lg"></div>
                                <div className="h-8 shimmer rounded-lg"></div>
                                <div className="h-8 shimmer rounded-lg"></div>
                            </div>
                        ) : (
                            <ul>
                                {filteredCards.length > 0 ? (
                                    filteredCards.map((item, index) => {
                                        return (
                                            <li key={index} className={headers === `?${item.$id}` ? 'active' : ''}>
                                                <Link to={`/dashboard?${item.$id}`}>
                                                    <i className="fa-regular fa-credit-card mr-2 text-[var(--text-muted)]"></i>
                                                    {item.Time}
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
                            <div className='flex-1 card-view-con p-6'>
                                <div className="max-w-md mx-auto">
                                    <CardPrev />
                                </div>
                            </div>
                        </> : (
                            <div className='flex-1 flex items-center justify-center text-[var(--text-muted)]'>
                                <div className="text-center animate-pulse">
                                    <i className="fa-regular fa-credit-card text-6xl mb-4 block"></i>
                                    <p className="text-lg font-medium">Select a card to preview</p>
                                    <p className="text-sm mt-1">Choose a card from the sidebar or create a new one</p>
                                </div>
                            </div>
                        )
                }
            </div>
        </>
    )
}

export default CardDashboard