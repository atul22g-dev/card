import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { openModal } from '../../../data/slices/dataSlice';
import { findCardInon } from '../../func/AllFunc';
import brandColors, { platformLabels } from '../../../constants/brandColors';

const Social = ({ data, isOpen, details, color, saveData, isSocial }) => {
    const dispatch = useDispatch();
    const [icon, setIcon] = useState()
    useEffect(() => {
        let ficon = findCardInon(details, isOpen)
        setIcon(ficon)
    }, [details, isOpen])

    const socialEntries = Object.entries(data).filter(([key, val]) => val?.icon !== undefined);

    return (
        <div className="card-social-section-modern">
            {socialEntries.map(([key, val]) => {
                if (key === isOpen) return null;
                const brandColor = brandColors[key] || null;
                const platformName = platformLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);

                return (
                    <div key={key} 
                         onClick={() => dispatch(openModal({ openModal: 'social', name: key }))} 
                         className="card-social-item-modern"
                         style={brandColor ? { '--social-brand': brandColor } : { '--social-brand': `rgb(${color})` }}
                    >
                        <div className="card-social-item-bg"></div>
                        <div
                            className="card-social-item-icon-wrap"
                            style={brandColor ? { backgroundColor: brandColor } : { backgroundColor: `rgb(${color})` }}
                        >
                            <i className={`${val.icon} text-white`}></i>
                        </div>
                        <div className="card-social-item-content">
                            <span className="card-social-item-platform">{platformName}</span>
                            <span className="card-social-item-value">{val?.value}</span>
                        </div>
                        <div className="card-social-item-arrow">
                            <i className="fa-regular fa-pen"></i>
                        </div>
                    </div>
                );
            })}

            {/* Active editing field */}
            {isSocial && data[isOpen] && isOpen && (
                <div 
                    className={`card-social-item-modern active ${isOpen !== undefined ? 'card-text-style_active' : ''}`}
                    style={{ '--social-brand': `rgb(${color})` }}
                >
                    <div className="card-social-item-bg"></div>
                    <div
                        className="card-social-item-icon-wrap"
                        style={{ backgroundColor: `rgb(${color})` }}
                    >
                        <i className={`${icon} text-white`}></i>
                    </div>
                    <div className="card-social-item-content">
                        <span className="card-social-item-platform">{platformLabels[isOpen] || isOpen}</span>
                        <span className="card-social-item-value">{data[isOpen]?.value}</span>
                    </div>
                </div>
            )}
        </div>
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