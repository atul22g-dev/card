import { useEffect, useRef, useState } from 'react'
import CardData from './content/CardData'
import { useDispatch, useSelector } from 'react-redux';
import { storeSingleData } from '../../data/slices/databaseSlice';
import { restoreThemeColor } from '../../data/slices/colors';
import { useLocation, useNavigate } from 'react-router-dom'
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
            window.location.reload();
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    }


    useEffect(() => {
        const headers = location.search;
        const currentId = headers.replace('?', '');
        if (!currentId) return;
        if (lastFetchedId.current === currentId) return;
        lastFetchedId.current = currentId;

        // AbortController cancels stale runs: when the effect re-runs (a
        // different card selected) or the component unmounts, the cleanup
        // aborts and the in-flight .then/.catch/.finally callbacks bail
        // before touching state.
        const controller = new AbortController();
        setLoading(true);
        dbService.fetchOnedata(headers)
            .then((data) => {
                if (controller.signal.aborted) return;
                dispatch(storeSingleData(data));
                if (data && data[0] && data[0].Data) {
                    try {
                        const savedData = JSON.parse(data[0].Data);
                        if (savedData.__themeColor) {
                            dispatch(restoreThemeColor(savedData.__themeColor));
                        }
                    } catch (e) { }
                }
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                console.error('Failed to load card:', error);
            })
            .finally(() => {
                // Clear loading on both success and failure, but only for the
                // current run — a stale fetch must not hide the newer card's
                // loading skeleton.
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [location, dispatch])

    if (loading) {
        return (
            <div className="modern-card">
                <div className="card-header-modern shimmer" style={{ minHeight: '140px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%' }}>
                </div>
                <div className="card-body-modern">
                    <div className="flex justify-center mb-4">
                        <div className="w-[72px] h-[72px] rounded-full shimmer border-[3px] border-[var(--bg-primary)] -mt-[60px]"></div>
                    </div>
                    <div className="space-y-2.5 text-center">
                        <div className="h-6 w-3/5 mx-auto shimmer rounded-md"></div>
                        <div className="h-4 w-2/5 mx-auto shimmer rounded-md"></div>
                    </div>
                    <div className="space-y-2.5 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-[42px] h-[42px] rounded-xl shimmer flex-shrink-0"></div>
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3.5 w-3/5 shimmer rounded-md"></div>
                                <div className="h-3 w-2/5 shimmer rounded-md"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-[42px] h-[42px] rounded-xl shimmer flex-shrink-0"></div>
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3.5 w-1/2 shimmer rounded-md"></div>
                                <div className="h-3 w-2/5 shimmer rounded-md"></div>
                            </div>
                        </div>
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
            <div className="modern-card scale-in">
                {/* Card Header */}
                <div className="card-header-modern">
                    <div className="card-header-deco card-header-deco-1"></div>
                    <div className="card-header-deco card-header-deco-2"></div>
                    <div className="card-header-deco card-header-deco-3"></div>

                    {/* Header Actions */}
                    <div className="card-header-actions">
                        <button onClick={() => navigate('/card?' + id)} className="card-header-btn edit-btn" title="Edit Card">
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onClick={() => setShowDeleteModal(true)} className="card-header-btn delete-btn" title="Delete Card">
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>

                {/* Card Body */}
                <div className="card-body-modern">
                    <CardData />
                </div>
            </div>
        </>
    )
}

export default CardPrev
