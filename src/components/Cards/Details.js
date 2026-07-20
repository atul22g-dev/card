import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchDetails } from '../../data/slices/detailSlice';
import { openModal, setCardData } from '../../data/slices/dataSlice';
import { isEmpty } from '../func/AllFunc';
import { dbService } from "../../appwrite/auth";
import { useLocation } from 'react-router-dom';
import { storeSingleData } from '../../data/slices/databaseSlice';


const Details = ({ details, fetchDetails, loader, openModal, data, user }) => {
    const [fetched, setFetched] = useState(false);
    const sData = useSelector(state => state.database.singleData);
    const dispatch = useDispatch();
    const location = useLocation();
    const headers = location.search;

    useEffect(() => {
        if (!fetched) {
            const addOneData = async () => {
                try {
                    let data = await dbService.fetchOnedata(headers);
                    dispatch(storeSingleData(data));
                } catch (error) {
                    console.error(error);
                }
            };

            const storeOneData = (sData) => {
                dispatch(setCardData(sData));
            };

            if (headers) {
                storeOneData(sData);
                addOneData();
            }
            fetchDetails();
        }

        if (isEmpty(headers)) {
            setFetched(true);
        }
        if (!isEmpty(sData)) {
            setFetched(true);
        }

    }, [dispatch, fetchDetails, headers, details, fetched, sData]);

    return (
        <div className='w-[60vw] max-md:w-[100vw] mx-14 my-7 absolute card_con_right left-[33vw] top-14 bottom-0 right-0'>
            {/* Heading */}
            <div className="mb-8 fade-in">
                <h1 className='text-2xl sm:text-3xl font-bold text-[var(--text-primary)]'>Design Your Card</h1>
                <p className='text-[var(--text-muted)] mt-1.5'>Choose a field below to add information to your card</p>
            </div>

            {/* Add your details  */}
            <div className="space-y-8">
                {/* Personal */}
                <div className="fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 themeBg rounded-full"></div>
                        <h4 className='text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider'>Personal</h4>
                    </div>
                    <ul className='flex flex-row detail_box flex-wrap gap-4'>
                        {!loader && details.map((personal) => {
                            return (
                                personal.heading === "Personal" ? (
                                    <li className={`${data.cardData[personal.openModal]?.saveData === 'true' ? 'isDesable' : 'isActive'} w-fit hover-lift`} onClick={data.cardData[personal.openModal]?.saveData === 'true' ? null : () => dispatch(openModal({ openModal: personal.openModal }))} key={personal.id}>
                                        <div className='flex flex-col justify-center items-center px-6 py-5'>
                                            <div className="w-10 h-10 rounded-xl themeLgbg flex items-center justify-center mb-3">
                                                <i className={`${personal.icon} textTheme text-lg`}></i>
                                            </div>
                                            <p className='font-medium text-sm text-[var(--text-secondary)]'>{personal.name}</p>
                                        </div>
                                    </li>
                                ) : null)
                        })}
                    </ul>
                </div>

                {/* General */}
                <div className="fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 themeBg rounded-full"></div>
                        <h4 className='text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider'>General</h4>
                    </div>
                    <ul className='flex flex-row detail_box flex-wrap gap-4'>
                        {!loader && details.map(General => (
                            General.heading === "General" ? (
                                <li className={`${data.cardData[General.socialName]?.saveData === 'true' ? 'isDesable' : 'isActive'} w-fit hover-lift`} onClick={data.cardData[General.socialName]?.saveData === 'true' ? null : () => dispatch(openModal({ openModal: General.openModal, name: General.socialName }))} key={General.id}>
                                    <div className='flex flex-col justify-center items-center px-6 py-5'>
                                        <div className="w-10 h-10 rounded-xl themeLgbg flex items-center justify-center mb-3">
                                            <i className={`${General.icon} textTheme text-lg`}></i>
                                        </div>
                                        <p className='font-medium text-sm text-[var(--text-secondary)]'>{General.name}</p>
                                    </div>
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>

                {/* Social */}
                <div className="fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 themeBg rounded-full"></div>
                        <h4 className='text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider'>Social</h4>
                    </div>
                    <ul className='flex flex-row detail_box flex-wrap gap-4'>
                        {!loader && details.map(General => (
                            General.heading === "Social" ? (
                                <li className={`${data.cardData[General.socialName]?.saveData === 'true' ? 'isDesable' : 'isActive'} w-fit hover-lift`} onClick={data.cardData[General.socialName]?.saveData === 'true' ? null : () => dispatch(openModal({ openModal: General.openModal, name: General.socialName }))} key={General.id}>
                                    <div className='flex flex-col justify-center items-center px-6 py-5'>
                                        <div className="w-10 h-10 rounded-xl themeLgbg flex items-center justify-center mb-3">
                                            <i className={`${General.icon} textTheme text-lg`}></i>
                                        </div>
                                        <p className='font-medium text-sm text-[var(--text-secondary)]'>{General.name}</p>
                                    </div>
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>

                {/* Messaging */}
                <div className="fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 themeBg rounded-full"></div>
                        <h4 className='text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider'>Messaging</h4>
                    </div>
                    <ul className='flex flex-row detail_box flex-wrap gap-4'>
                        {!loader && details.map(General => (
                            General.heading === "Messaging" ? (
                                <li className={`${data.cardData[General.socialName]?.saveData === 'true' ? 'isDesable' : 'isActive'} w-fit hover-lift`} onClick={data.cardData[General.socialName]?.saveData === 'true' ? null : () => dispatch(openModal({ openModal: General.openModal, name: General.socialName }))} key={General.id}>
                                    <div className='flex flex-col justify-center items-center px-6 py-5'>
                                        <div className="w-10 h-10 rounded-xl themeLgbg flex items-center justify-center mb-3">
                                            <i className={`${General.icon} textTheme text-lg`}></i>
                                        </div>
                                        <p className='font-medium text-sm text-[var(--text-secondary)]'>{General.name}</p>
                                    </div>
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>

                {/* Business */}
                <div className="fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 themeBg rounded-full"></div>
                        <h4 className='text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider'>Business</h4>
                    </div>
                    <ul className='flex flex-row detail_box flex-wrap gap-4'>
                        {!loader && details.map(General => (
                            General.heading === "Business" ? (
                                <li className={`${data.cardData[General.socialName]?.saveData === 'true' ? 'isDesable' : 'isActive'} w-fit hover-lift`} onClick={data.cardData[General.socialName]?.saveData === 'true' ? null : () => dispatch(openModal({ openModal: General.openModal, name: General.socialName }))} key={General.id}>
                                    <div className='flex flex-col justify-center items-center px-6 py-5'>
                                        <div className="w-10 h-10 rounded-xl themeLgbg flex items-center justify-center mb-3">
                                            <i className={`${General.icon} textTheme text-lg`}></i>
                                        </div>
                                        <p className='font-medium text-sm text-[var(--text-secondary)]'>{General.name}</p>
                                    </div>
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>

                {/* Payment */}
                <div className="fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-5 themeBg rounded-full"></div>
                        <h4 className='text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider'>Payment</h4>
                    </div>
                    <ul className='flex flex-row detail_box flex-wrap gap-4'>
                        {!loader && details.map(General => (
                            General.heading === "Payment" ? (
                                <li className={`${data.cardData[General.socialName]?.saveData === 'true' ? 'isDesable' : 'isActive'} w-fit hover-lift`} onClick={data.cardData[General.socialName]?.saveData === 'true' ? null : () => dispatch(openModal({ openModal: General.openModal, name: General.socialName }))} key={General.id}>
                                    <div className='flex flex-col justify-center items-center px-6 py-5'>
                                        <div className="w-10 h-10 rounded-xl themeLgbg flex items-center justify-center mb-3">
                                            <i className={`${General.icon} textTheme text-lg`}></i>
                                        </div>
                                        <p className='font-medium text-sm text-[var(--text-secondary)]'>{General.name}</p>
                                    </div>
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>
            </div>

            <div className='sticky bottom-0 mt-10 py-4 px-2 bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-transparent'>
                <div className="flex justify-between items-center gap-4">
                    <p className='text-sm text-[var(--text-muted)] hidden sm:block'>
                        <i className="fa-regular fa-heart textTheme mr-1"></i>
                        Crafted by <a className='font-medium textTheme hover:underline' href='https://github.com/Atugatran'>Atugatran</a>
                    </p>
                    {
                        !headers ? (
                            <button onClick={() => dbService.AddData(user, data.savecardData,)} className={`${isEmpty(data.cardData) ? 'disable-btn' : 'Primay-btn'} btn min-w-[160px]`} type="button">
                                <i className="fa-regular fa-floppy-disk mr-2"></i>
                                Create Card
                            </button>
                        ) : (
                            <button onClick={() => dbService.updateData(headers, user, data.savecardData)} className={`${isEmpty(data.cardData) ? 'disable-btn' : 'Primay-btn'} btn min-w-[160px]`} type="button">
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