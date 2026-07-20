import React from 'react'
import { connect, useDispatch } from 'react-redux';
import { openModal } from '../../../data/slices/dataSlice';

const Personal = ({ data, isOpen, color }) => {
    // `color` from Redux always reflects the current active theme color
    const dispatch = useDispatch();
    const baseClass = `card-text-style card-text-icon card-default-outline`;

    // Check if name exists for avatar display
    const hasName = data.name && (data?.name?.firstName || data?.name?.middleName || data?.name?.lastName);
    const firstName = data?.name?.firstName || '';
    const lastName = data?.name?.lastName || '';
    const initials = (firstName.charAt(0) || '') + (lastName.charAt(0) || '');

    return (
        <>
            {/* ══ HERO SECTION — Avatar, Name, Headline ══ */}
            <div className="card-hero-section">

                {/* Avatar - integrated into hero */}
                {!hasName && isOpen === 'name' ? (
                    <div className="card-hero-avatar-wrapper">
                        <div className={`card-hero-avatar-placeholder ${isOpen === 'name' ? 'card-text-style_active' : ''}`}
                            onClick={() => dispatch(openModal({ openModal: 'name' }))}>
                            <i className="fa-regular fa-camera"></i>
                        </div>
                    </div>
                ) : null}
                {hasName ? (
                    <div className="card-hero-avatar-wrapper">
                        <div
                            className="card-hero-avatar"
                            onClick={() => dispatch(openModal({ openModal: 'name' }))}
                        >
                            {initials.toUpperCase()}
                        </div>
                        <div className="card-hero-avatar-ring"
                            style={{ background: `linear-gradient(135deg, rgb(${color}), color-mix(in srgb, rgb(${color}) 70%, #000))` }}
                        ></div>
                    </div>
                ) : null}

                {/* Name */}
                {isOpen === 'name' && !hasName ? (
                    <div className={`${baseClass} card_data_default card-hero-name-placeholder justify-center ${isOpen === 'name' ? 'card-text-style_active' : ''}`}>
                        <i className="fa-regular fa-user mr-2"></i> Name
                    </div>
                ) : null}
                {hasName ? (
                    <div onClick={() => dispatch(openModal({ openModal: 'name' }))}
                        className={`card-hero-name ${isOpen === 'name' ? 'card-text-style_active' : ''}`}
                        style={{ '--name-color': `rgb(${color})` }}
                    >
                        <h2 className="card-hero-name-text">{data?.name?.firstName} {data?.name?.middleName} {data?.name?.lastName}</h2>
                    </div>
                ) : null}

                {/* Headline */}
                {isOpen === 'headline' && !data?.headline?.headline ? (
                    <div className={`${baseClass} card_data_default card-hero-headline-placeholder justify-center ${isOpen === 'headline' ? 'card-text-style_active' : ''}`}>
                        <i className="fa-regular fa-heading mr-2"></i> Headline
                    </div>
                ) : null}
                {data.headline && data.headline.headline ? (
                    <div onClick={() => dispatch(openModal({ openModal: 'headline' }))}
                        className={`card-hero-headline ${isOpen === 'headline' ? 'card-text-style_active' : ''}`}>
                        {data?.headline?.headline}
                    </div>
                ) : null}

            </div>

            {/* Personal Details Section — Job Title, Department, Company */}
            <div className="card-personal-section-modern">

                {/* Job Title — with icon and label */}
                {isOpen === 'jobTitle' && !data?.jobTitle?.jobTitle ? (
                    <div className={`${baseClass} card_data_default font-semibold text-2xl justify-center ${isOpen === 'jobTitle' ? 'card-text-style_active' : ''}`}>
                        <i className="fa-regular fa-briefcase mr-3 text-xl"></i> Job title
                    </div>
                ) : null}
                {data.jobTitle && data.jobTitle.jobTitle ? (
                    <div onClick={() => dispatch(openModal({ openModal: 'jobTitle' }))}
                        className="card-personal-item-modern"
                    >
                        <div className="card-personal-item-icon-wrap">
                            <i className="fa-regular fa-briefcase"></i>
                        </div>
                        <div className="card-personal-item-content">
                            <span className="card-personal-item-label">Job Title</span>
                            <span className="card-personal-item-value">{data?.jobTitle?.jobTitle}</span>
                        </div>
                        <div className="card-personal-item-arrow">
                            <i className="fa-regular fa-pen"></i>
                        </div>
                    </div>
                ) : null}

                {/* Department — with icon and label */}
                {isOpen === 'department' && !data?.department?.department ? (
                    <div className={`${baseClass} card_data_default font-semibold text-2xl justify-center ${isOpen === 'department' ? 'card-text-style_active' : ''}`}>
                        <i className="fa-regular fa-folder-tree mr-3 text-xl"></i> Department
                    </div>
                ) : null}
                {data.department && data.department.department ? (
                    <div onClick={() => dispatch(openModal({ openModal: 'department' }))}
                        className="card-personal-item-modern"
                    >
                        <div className="card-personal-item-icon-wrap">
                            <i className="fa-regular fa-folder-tree"></i>
                        </div>
                        <div className="card-personal-item-content">
                            <span className="card-personal-item-label">Department</span>
                            <span className="card-personal-item-value">{data?.department?.department}</span>
                        </div>
                        <div className="card-personal-item-arrow">
                            <i className="fa-regular fa-pen"></i>
                        </div>
                    </div>
                ) : null}

                {/* Company — with icon and label */}
                {isOpen === 'company' && !data?.company?.company ? (
                    <div className={`${baseClass} card_data_default font-semibold text-2xl justify-center ${isOpen === 'company' ? 'card-text-style_active' : ''}`}>
                        <i className="fa-regular fa-building mr-3 text-xl"></i> Company Name
                    </div>
                ) : null}
                {data.company && data.company.company ? (
                    <div onClick={() => dispatch(openModal({ openModal: 'company' }))}
                        className="card-personal-item-modern"
                    >
                        <div className="card-personal-item-icon-wrap">
                            <i className="fa-regular fa-building"></i>
                        </div>
                        <div className="card-personal-item-content">
                            <span className="card-personal-item-label">Company</span>
                            <span className="card-personal-item-value">{data?.company?.company}</span>
                        </div>
                        <div className="card-personal-item-arrow">
                            <i className="fa-regular fa-pen"></i>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Divider when there are personal fields filled */}
            {(hasName || data?.jobTitle?.jobTitle || data?.department?.department || data?.company?.company || data?.headline?.headline) && (
                <div className="card-divider"></div>
            )}
        </>
    )
}

const mapStateToProps = state => ({
    data: state.data.cardData,
    isOpen: state.data.isOpen,
    color: state.colors.color
});

export default connect(mapStateToProps)(Personal);
