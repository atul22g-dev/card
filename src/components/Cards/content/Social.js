import { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { openModal } from '../../../data/slices/dataSlice';
import { findCardIcon } from '../../func/AllFunc';
import brandColors, { platformLabels } from '../../../constants/brandColors';

const Social = ({ data, isOpen, details, color, isSocial }) => {
    const dispatch = useDispatch();
    const [icon, setIcon] = useState()
    useEffect(() => {
        let ficon = findCardIcon(details, isOpen)
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
                    <button type="button" key={key} 
                         onClick={() => dispatch(openModal({ openModal: 'social', name: key }))} 
                         className="card-social-item-modern w-full text-left"
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
                    </button>
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
    data: state.data.cardData,
    isOpen: state.data.isOpen,
    color: state.colors.color,
    details: state.details.details,
    isSocial: state.data.isSocial,
});

export default connect(mapStateToProps)(Social);