import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchDetails } from '../../data/slices/detailSlice';
import { openModal, setCardData } from '../../data/slices/dataSlice';
import { restoreThemeColor } from '../../data/slices/colors';
import { isEmpty } from '../func/AllFunc';
import { dbService } from "../../appwrite/auth";
import { useLocation } from 'react-router-dom';
import { storeSingleData } from '../../data/slices/databaseSlice';


const Details = ({ details, fetchDetails, loader, openModal, data, user }) => {
    const [fetchedId, setFetchedId] = useState(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const headers = location.search;
    const reduxSingleData = useSelector(state => state.database.singleData);

    useEffect(() => {
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
                    console.error(error);
                    // Don't set fetchedId on error so it can retry on next relevant re-render
                }
            };
            loadData();
        }
        fetchDetails();
    }, [dispatch, fetchDetails, headers, fetchedId]);

    return (
        <div className='w-[60vw] max-md:w-[100vw] mx-8 py-7 absolute card_con_right left-[33vw] top-0 bottom-0 right-0 scrool-hidden'>
            {/* Heading */}
            <div className="mb-8 fade-in">
                <h1 className='text-2xl sm:text-3xl font-bold text-[var(--text-primary)]'>Design Your Card</h1>
                <p className='text-[var(--text-muted)] mt-1.5'>Choose a field below to add information to your card</p>
            </div>

            {/* Add your details  */}
            <div className="space-y-8">
                {/* Section renderer - dynamically groups items by heading */}
                {!loader && ['Personal', 'General', 'Social', 'Messaging', 'Business', 'Payment'].map((section, sectionIdx) => {
                    const sectionItems = details.filter(d => d.heading === section);
                    if (sectionItems.length === 0) return null;
                    return (
                        <div key={section} className="fade-in-stagger">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-5 themeBg rounded-full"></div>
                                <h4 className='text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider'>{section}</h4>
                                <span className="text-[10px] text-[var(--text-muted)] ml-auto">{sectionItems.length} fields</span>
                            </div>
                            <ul className='flex flex-row detail_box flex-wrap gap-4'>
                                {sectionItems.map((item) => {
                                    const modalKey = item.socialName || item.openModal;
                                    const isSaved = data.cardData[modalKey]?.saveData === 'true';
                                    return (
                                        <li 
                                            key={item.id}
                                            className={`${isSaved ? 'isDesable' : 'isActive'} w-fit hover-lift`} 
                                            onClick={isSaved ? null : () => {
                                                if (item.openModal === 'social') {
                                                    dispatch(openModal({ openModal: item.openModal, name: item.socialName }));
                                                } else {
                                                    dispatch(openModal({ openModal: item.openModal }));
                                                }
                                            }}
                                        >
                                            <div className='flex flex-col justify-center items-center px-6 py-5'>
                                                <div className="w-10 h-10 rounded-xl themeLgbg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                                                    <i className={`${item.icon} textTheme text-lg`}></i>
                                                </div>
                                                <p className='font-medium text-sm text-[var(--text-secondary)]'>{item.name}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <div className='sticky bottom-0 mt-10 py-4 px-2 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-transparent'>
                <div className="flex justify-between items-center gap-4">
                    <p className='text-sm text-[var(--text-muted)] hidden sm:block'>
                        <i className="fa-regular fa-heart textTheme mr-1"></i>
                        Crafted by <a className='font-medium textTheme hover:underline' href='https://github.com/Atugatran'>Atugatran</a>
                    </p>
                    {
                        !headers ? (
                            <button onClick={() => {
                                const parsedData = data.savecardData ? JSON.parse(data.savecardData) : {};
                                dbService.AddData(user, parsedData);
                            }} className={`${isEmpty(data.cardData) ? 'disable-btn' : 'Primay-btn'} btn min-w-[160px]`} type="button">
                                <i className="fa-regular fa-floppy-disk mr-2"></i>
                                Create Card
                            </button>
                        ) : (
                            <button onClick={() => {
                                const parsedData = data.savecardData ? JSON.parse(data.savecardData) : {};
                                dbService.updateData(headers, user, parsedData);
                            }} className={`${isEmpty(data.cardData) ? 'disable-btn' : 'Primay-btn'} btn min-w-[160px]`} type="button">
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

export default connect(mapStateToProps, { fetchDetails, openModal })(Details);