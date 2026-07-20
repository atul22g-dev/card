import React, { useEffect, useState } from 'react'
import CardData from './content/CardData'
import { useDispatch, useSelector } from 'react-redux';
import { storeSingleData } from '../../data/slices/databaseSlice';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { dbService } from '../../appwrite/auth';

const CardPrev = () => {
    const id = useSelector(state => state.database.singleDataId);
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const deleteBtnFunc = (id) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            dbService.deleteOneData(id);
        }
    }
    const EditBtnFunc = (id) => {
        navigate("/card?"+id)
    }
    useEffect(() => {
        const addOneData = async () => {
            setLoading(true);
            const headers = location.search;
            let data = await dbService.fetchOnedata(headers);
            dispatch(storeSingleData(data))
            setLoading(false);
        }
        addOneData()
    }, [location ,dispatch])

    if (loading) {
        return (
            <div className="w-full rounded-xl mb-5 shadow-card overflow-hidden">
                <div className="w-full min-h-[14vh] shimmer"></div>
                <div className="p-6 space-y-4">
                    <div className="h-6 w-3/4 shimmer rounded-md"></div>
                    <div className="h-4 w-1/2 shimmer rounded-md"></div>
                    <div className="h-10 w-full shimmer rounded-md"></div>
                    <div className="h-10 w-full shimmer rounded-md"></div>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* card */}
            <div className="w-full rounded-xl mb-5 shadow-card overflow-hidden scale-in">
                {/* Card Header */}
                <div className='w-full min-h-[16vh] rounded-t-xl themeBg cardHeader cardHeaderbtnCon relative overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent'></div>
                    <button onClick={() => EditBtnFunc(id)} className='cardHeaderbtn editBtn' title="Edit Card">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => deleteBtnFunc(id)} className='cardHeaderbtn deleteBtn' title="Delete Card">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
                {/* Card Body */}
                <div className='w-full min-h-[3.1vh] rounded-b-xl flex flex-col gap-2 bg-[var(--bg-primary)] px-5 py-4 pt-7 pb-5'>
                    <CardData />
                </div>
            </div>
        </>
    )
}

export default CardPrev