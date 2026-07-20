import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { openModal } from '../../../data/slices/dataSlice';
import { findCardInon } from '../../func/AllFunc';

const Social = ({ data, isOpen, details, color, saveData, isSocial }) => {
    const dispatch = useDispatch();
    const [icon, setIcon] = useState()
    useEffect(() => {
        let ficon = findCardInon(details, isOpen)
        setIcon(ficon)
    }, [details, isOpen])
    return (
        <>
            {Object.keys(data).map((key) => (
                key !== isOpen ? (
                    data[key]?.icon !== undefined ? (
                        <div key={key} onClick={() => dispatch(openModal({ openModal: 'social', name: key }))} className='flex themeOutLine outline-offset-[1px] outline card-data card-data_social gap-2 min-h-[38px] w-full'>
                            {/* Icon */}
                            <div className={`bg-[rgb(${color})] icon_con flex justify-center items-center Social`}>
                                <i className={`${data[key].icon} text-white`}></i>
                            </div>
                            {/* Text */}
                            <div className='w-full flex card-data_text_con flex-col justify-center items-start p-1'>
                                <span>{data[key]?.value}</span>
                                <span>{data[key]?.label}</span>
                            </div>
                        </div>) : null
                ) : null
            ))
            }
            {
                isSocial && data[isOpen] !== '{}' && isOpen ?
                    <div className={`flex card-data themeOutLine card-data_social outline-offset-[1px] outline gap-2 min-h-[38px] w-full ${isOpen !== undefined ? 'card-data_active' : ''}`}>
                        {/* Icon */}
                        <div className={`bg-[rgb(${color})] icon_con flex justify-center items-center Social`}>
                            <i className={`${icon} text-white`}></i>
                        </div>
                        {/* Text */}
                        <div className='w-full flex card-data_text_con flex-col justify-center items-start p-1'>
                            <span>{data[isOpen]?.value}</span>
                            <span>{data[isOpen]?.label}</span>
                        </div>
                    </div> : null
            }
        </>
    )
}

const mapStateToProps = state => ({
    saveData: state.data?.savecardData,
    data: state.data.cardData,
    isOpen: state.data.isOpen,
    color: state.colors.color,
    details: state.details.details,
    isSocial: state.data.isSocial,
});

export default connect(mapStateToProps)(Social);