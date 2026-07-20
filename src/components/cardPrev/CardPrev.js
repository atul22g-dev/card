import React, { useEffect, useRef, useState } from 'react'
import CardData from './content/CardData'
import { useDispatch, useSelector } from 'react-redux';
import { storeSingleData } from '../../data/slices/databaseSlice';
import { setCurrentColor } from '../../data/slices/colors';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { dbService } from '../../appwrite/auth';
import DeleteModal from '../common/DeleteModal';

const CardPrev = () => {
    const id = useSelector(state => state.database.singleDataId);
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch();
    const lastFetchedId = useRef(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await dbService.deleteOneData(id);
        } catch (error) {
            console.error('Delete failed:', error);
            setDeleting(false);
            setShowDeleteModal(false);
        }
    }

    const EditBtnFunc = (id) => navigate("/card?"+id)

    useEffect(() => {
        const headers = location.search;
        const currentId = headers.replace('?', '');
        if (!currentId) return;
        if (lastFetchedId.current === currentId) return;
        lastFetchedId.current = currentId;

        const addOneData = async () => {
            setLoading(true);
            let data = await dbService.fetchOnedata(headers);
            dispatch(storeSingleData(data));
            if (data && data[0] && data[0].Data) {
                try {
                    const savedData = JSON.parse(data[0].Data);
                    if (savedData.__themeColor) {
                        document.documentElement.style.setProperty('--theme-color', `rgb(${savedData.__themeColor})`);
                        document.documentElement.style.setProperty('--light-theme-color', `rgba(${savedData.__themeColor}, .25)`);
                        document.documentElement.style.setProperty('--theme-color-rgb', savedData.__themeColor);
                        dispatch(setCurrentColor(savedData.__themeColor));
                    }
                } catch (e) {}
            }
            setLoading(false);
        }
        addOneData()
    }, [location, dispatch])

    if (loading) {
        return (
            <div className="w-full rounded-xl mb-5 shadow-card overflow-hidden scale-in">
                <div className="w-full min-h-[16vh] rounded-t-xl shimmer">
                    <div className="flex items-end justify-end h-full p-3 opacity-20">
                        <div className="w-8 h-8 rounded-lg bg-white"></div>
                        <div className="w-8 h-8 rounded-lg bg-white ml-2"></div>
                    </div>
                </div>
                <div className="bg-[var(--bg-primary)] px-5 py-4 pt-10 pb-5 space-y-3">
                    <div className="flex justify-center -mt-14">
                        <div className="w-14 h-14 rounded-full shimmer border-[3px] border-[var(--bg-primary)]"></div>
                    </div>
                    <div className="space-y-2.5 pt-1">
                        <div className="h-6 w-3/5 mx-auto shimmer rounded-md"></div>
                        <div className="h-4 w-2/5 mx-auto shimmer rounded-md"></div>
                    </div>
                    <div className="space-y-2.5 pt-3">
                        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl shimmer flex-shrink-0"></div><div className="flex-1 space-y-1.5"><div className="h-3.5 w-3/5 shimmer rounded-md"></div><div className="h-3 w-2/5 shimmer rounded-md"></div></div></div>
                        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl shimmer flex-shrink-0"></div><div className="flex-1 space-y-1.5"><div className="h-3.5 w-1/2 shimmer rounded-md"></div><div className="h-3 w-2/5 shimmer rounded-md"></div></div></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <DeleteModal
                title="Delete this card?"
                description="This action cannot be undone. The card and all its data will be permanently removed."
                isOpen={showDeleteModal}
                isLoading={deleting}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                confirmText="Delete"
            />
            <div className="w-full rounded-xl mb-5 shadow-card overflow-hidden scale-in">
                <div className='w-full min-h-[16vh] rounded-t-xl themeBg cardHeader cardHeaderbtnCon relative overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent'></div>
                    <button onClick={() => EditBtnFunc(id)} className='cardHeaderbtn editBtn' title="Edit Card"><i className="fa-solid fa-pen-to-square"></i></button>
                    <button onClick={() => setShowDeleteModal(true)} className='cardHeaderbtn deleteBtn' title="Delete Card"><i className="fa-solid fa-trash"></i></button>
                </div>
                <div className='w-full min-h-[3.1vh] rounded-b-xl flex flex-col gap-2 bg-[var(--bg-primary)] px-5 py-4 pt-7 pb-5'>
                    <CardData />
                </div>
            </div>
        </>
    )
}

export default CardPrev
