import { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchDetails } from '../../data/slices/detailSlice';
import { openModal, setCardData, setCardTitle, resetCardData } from '../../data/slices/dataSlice';
import { restoreThemeColor, setCurrentColor } from '../../data/slices/colors';
import { isEmpty } from '../func/AllFunc';
import { dbService } from "../../appwrite/auth";
import { useLocation } from 'react-router-dom';
import { storeSingleData } from '../../data/slices/databaseSlice';


const Details = ({ details, loader, openModal, data, user }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    const [fetchedId, setFetchedId] = useState(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const headers = location.search;
    const reduxSingleData = useSelector(state => state.database.singleData);

    useEffect(() => {
        let ignore = false;
        if (headers) {
            const currentId = headers.replace('?', '');
            // Only fetch when the card ID actually changes (handles navigating between cards on same route)
            if (fetchedId === currentId) return;

            const loadData = async () => {
                try {
                    const reduxId = reduxSingleData && reduxSingleData[0] && reduxSingleData[0].$id;

                    // Use Redux data if it already matches this card, otherwise fetch
                    let result;
                    if (reduxId === currentId) {
                        result = reduxSingleData;
                    } else {
                        result = await dbService.fetchOnedata(headers);
                    }

                    if (ignore) return;
                    if (result && result[0]) {
                        dispatch(storeSingleData(result));
                        dispatch(setCardData(result));
                        // Restore the saved theme color via Redux action (sets CSS + state)
                        try {
                            const savedData = JSON.parse(result[0].Data);
                            if (savedData.__themeColor) {
                                dispatch(restoreThemeColor(savedData.__themeColor));
                            }
                        } catch (e) {
                            // Data parsing failed, ignore
                        }
                    }
                    setFetchedId(currentId);
                } catch (error) {
                    if (!ignore) console.error(error);
                    // Don't set fetchedId on error so it can retry on next relevant re-render
                }
            };
            loadData();
        } else {
            // No headers = creating a new card -> reset stale data from any previously viewed card
            dispatch(resetCardData());
            dispatch(setCurrentColor('244, 90, 87'));
            setFetchedId(null);
        }
        dispatch(fetchDetails());
        return () => { ignore = true; };
    }, [dispatch, headers, fetchedId, reduxSingleData]);

    // Sync local title input with Redux cardTitle
    useEffect(() => {
        setTitleInput(data.cardTitle || '');
    }, [data.cardTitle]);

    return (
        <div className='w-full md:w-auto md:flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-7 card_con_right scrool-hidden'>
            {/* Heading */}
            <div className="mb-6 md:mb-8 fade-in">
                <h1 className='text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight'>Design Your Card</h1>
                <p className='text-[var(--text-muted)] mt-1 text-sm'>Choose a field below to add information to your card</p>
            </div>

            {/* Card Title */}
            <div className="mb-4 md:mb-6 fade-in">
                <label htmlFor="card-title-input" className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    <i className="fa-regular fa-heading mr-1.5"></i>
                    Card Title
                </label>
                {isEditingTitle ? (
                    <div className="flex items-center gap-2">
                        <input
                            id="card-title-input"
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    dispatch(setCardTitle(titleInput));
                                    setIsEditingTitle(false);
                                }
                                if (e.key === 'Escape') {
                                    setTitleInput(data.cardTitle || '');
                                    setIsEditingTitle(false);
                                }
                            }}
                            placeholder="My Business Card"
                            className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--theme-color)] focus:ring-2 focus:ring-[var(--light-theme-color)] focus:bg-[var(--bg-primary)] transition-all duration-200"
                            autoFocus
                        />
                        <button
                            onClick={() => {
                                dispatch(setCardTitle(titleInput));
                                setIsEditingTitle(false);
                            }}
                            className="w-9 h-9 rounded-lg themeBg text-white flex items-center justify-center hover:brightness-90 transition-all duration-200"
                            title="Save title"
                        >
                            <i className="fa-regular fa-check text-sm"></i>
                        </button>
                        <button
                            onClick={() => {
                                setTitleInput(data.cardTitle || '');
                                setIsEditingTitle(false);
                            }}
                            className="w-9 h-9 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-all duration-200"
                            title="Cancel"
                        >
                            <i className="fa-regular fa-xmark text-sm"></i>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setTitleInput(data.cardTitle || '');
                            setIsEditingTitle(true);
                        }}
                        className="group flex items-center gap-3 w-full rounded-xl border border-dashed border-[var(--border-color)] hover:border-[var(--theme-color)]/50 bg-[var(--bg-primary)] hover:bg-[var(--light-theme-color)] px-4 py-3.5 transition-all duration-300 cursor-pointer hover:shadow-sm"
                    >
                        {data.cardTitle ? (
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                                {data.cardTitle}
                            </span>
                        ) : (
                            <span className="text-sm text-[var(--text-muted)]">
                                <i className="fa-regular fa-pen mr-2"></i>
                                Add a card title...
                            </span>
                        )}
                        <span className="ml-auto text-xs text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <i className="fa-regular fa-pen-to-square"></i>
                        </span>
                    </button>
                )}
            </div>

            {/* Add your details  */}
            <div className="space-y-8">
                {/* Section renderer - dynamically groups items by heading */}
                {!loader && ['Personal', 'General', 'Social', 'Messaging', 'Business', 'Payment'].map((section) => {
                    const sectionItems = details.filter(d => d.heading === section);
                    if (sectionItems.length === 0) return null;
                    return (
                        <div key={section} className="fade-in-stagger">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-[3px] h-5 bg-gradient-to-b from-[var(--theme-color)] to-[color-mix(in_srgb,var(--theme-color)_50%,#6366f1)] rounded-full"></div>
                                <h4 className='text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.12em]'>{section}</h4>
                                <div className="flex-1"></div>
                                <span className='text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full font-medium border border-[var(--border-color)]/30'>{sectionItems.length} fields</span>
                            </div>
                            <ul className='detail_box flex gap-6 flex-wrap'>
                                {sectionItems.map((item) => {
                                    const modalKey = item.socialName || item.openModal;
                                    const isSaved = data.cardData[modalKey]?.saveData === 'true';
                                    return (
                                        <li 
                                            key={item.id}
                                            className={`${isSaved ? 'isDesable' : 'isActive'} w-fit hover-lift`} 
                                        >
                                            <button 
                                                type="button"
                                                disabled={isSaved}
                                                onClick={() => {
                                                    if (item.openModal === 'social') {
                                                        dispatch(openModal({ openModal: item.openModal, name: item.socialName }));
                                                    } else {
                                                        dispatch(openModal({ openModal: item.openModal }));
                                                    }
                                                }}
                                                className='flex flex-col justify-center items-center px-6 py-5 w-full'
                                            >
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--theme-color)] to-[color-mix(in_srgb,var(--theme-color)_50%,#000)] flex items-center justify-center mb-3 shadow-lg shadow-[var(--theme-color)]/25 transition-all duration-300">
                                            <i className={`${item.icon} text-white text-lg`}></i>
                                        </div>
                                        <p className='font-medium text-[13px] text-[var(--text-secondary)]'>{item.name}</p>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <div className='sticky bottom-0 left-0 right-0 mt-10 pt-6 pb-5 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)]/95 to-transparent z-10'>
                <div className="flex justify-between items-center gap-4 max-w-3xl mx-auto">
                    <p className='text-sm text-[var(--text-muted)] hidden sm:block'>
                        <i className="fa-regular fa-heart textTheme mr-1"></i>
                        Crafted by <a className='font-medium textTheme hover:underline' href='https://github.com/Atugatran'>Atugatran</a>
                    </p>
                    {
                        !headers ? (
                            <button onClick={() => {
                                const parsedData = data.savecardData ? JSON.parse(data.savecardData) : {};
                                dbService.AddData(user, parsedData, data.cardTitle);
                            }} className={`${isEmpty(data.cardData) ? 'disable-btn' : 'Primay-btn'} btn min-w-[120px] sm:min-w-[160px]`} type="button">
                                <i className="fa-regular fa-floppy-disk mr-2"></i>
                                Create Card
                            </button>
                        ) : (
                            <button onClick={() => {
                                const parsedData = data.savecardData ? JSON.parse(data.savecardData) : {};
                                dbService.updateData(headers, user, parsedData, data.cardTitle);
                            }} className={`${isEmpty(data.cardData) ? 'disable-btn' : 'Primay-btn'} btn min-w-[120px] sm:min-w-[160px]`} type="button">
                                <i className="fa-regular fa-pen-to-square mr-2"></i>
                                Update Card
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    data: state.data,
    user: state.auth.userData,
    details: state.details.details,
    loader: state.details.loading,
});

export default connect(mapStateToProps, { openModal })(Details);