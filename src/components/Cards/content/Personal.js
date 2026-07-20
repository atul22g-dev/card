import React from 'react'
import { connect, useDispatch } from 'react-redux';
import { openModal } from '../../../data/slices/dataSlice';

const Personal = ({ data, isOpen }) => {
    const dispatch = useDispatch();
    const baseClass = `card-data card-data-personal card-default-outline`;
    console.log(isOpen);
    
    return (
        <>
            {/* Name */}
            {isOpen === 'name' && !data?.name?.firstName && !data?.name?.middleName && !data?.name?.lastName ? (
                <div className={`${baseClass} card_data_default name_text ${isOpen === 'name' ? 'card-data_active' : ''}`}>Name</div>
            ) : null}
            {data.name && (data?.name?.firstName || data?.name?.middleName || data?.name?.lastName) ? (
                <div onClick={() => dispatch(openModal({ openModal: 'name' }))} className={`${baseClass} name_text ${isOpen === 'name' ? 'card-data_active' : ''}`}>{data?.name?.firstName} {data?.name?.middleName} {data?.name?.lastName}</div>
            ) : null}

            {/* Job Title */}
            {isOpen === 'jobTitle' && !data?.jobTitle?.jobTitle ? (
                <div className={`${baseClass} card_data_default font-semibold text-2xl ${isOpen === 'jobTitle' ? 'card-data_active' : ''}`}>Job title</div>
            ) : null}
            {data.jobTitle && data.jobTitle.jobTitle ? (
                <div onClick={() => dispatch(openModal({ openModal: 'jobTitle' }))} className={`${baseClass} font-semibold text-2xl ${isOpen === 'jobTitle' ? 'card-data_active' : ''}`}>{data?.jobTitle?.jobTitle}</div>
            ) : null}

            {isOpen === 'department' && !data?.department?.department ? (
                <div className={`${baseClass} card_data_default font-semibold text-2xl ${isOpen === 'department' ? 'card-data_active' : ''}`}>Department</div>
            ) : null}
            {data.department && data.department.department ? (
                <div onClick={() => dispatch(openModal({ openModal: 'department' }))} className={`${baseClass} font-semibold text-2xl ${isOpen === 'department' ? 'card-data_active' : ''}`}>{data?.department?.department}</div>
            ) : null}

            {isOpen === 'company' && !data?.company?.company ? (
                <div className={`${baseClass} card_data_default font-semibold text-2xl ${isOpen === 'company' ? 'card-data_active' : ''}`}>Company Name</div>
            ) : null}
            {data.company && data.company.company ? (
                <div onClick={() => dispatch(openModal({ openModal: 'company' }))} className={`${baseClass} font-semibold text-2xl ${isOpen === 'company' ? 'card-data_active' : ''}`}>{data?.company?.company}</div>
            ) : null}

            {isOpen === 'headline' && !data?.headline?.headline ? (
                <div className={`${baseClass} card_data_default text-sm ${isOpen === 'headline' ? 'card-data_active' : ''}`}>Headline</div>
            ) : null}
            {data.headline && data.headline.headline ? (
                <div onClick={() => dispatch(openModal({ openModal: 'headline' }))} className={`${baseClass} text-[var(--text-muted)] text-sm ${isOpen === 'headline' ? 'card-data_active' : ''}`}>{data?.headline?.headline}</div>
            ) : null}
        </>
    )
}

const mapStateToProps = state => ({
    data: state.data.cardData,
    isOpen: state.data.isOpen,
    color: state.colors.color
});

export default connect(mapStateToProps)(Personal);
