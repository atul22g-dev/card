import React from 'react'
import { connect, useDispatch } from 'react-redux';
import { updateCardData } from '../../../data/slices/dataSlice';
import { openModal } from '../../../data/slices/dataSlice';

const Personal = ({ data, isOpen }) => {
    const dispatch = useDispatch();
    
    return (
        <>
            {/* Name */}
            {/* Default */}
            {isOpen === 'name' && !data?.name?.firstName && !data?.name?.middleName && !data?.name?.lastName ?
                <div className={`card-data card-data-personal text-3xl card-data_comman font-bold themeOutLine outline-offset-[1px] outline ${isOpen === 'name' ? 'card-data_active' : ''}`}>Name</div>
                : null}
            {/* Name */}
            {data.name && (data?.name?.firstName || data?.name?.middleName || data?.name?.lastName) ?
                <div onClick={() => dispatch(openModal({ openModal: 'name' }))} className={`card-data font-bold text-3xl themeOutLine outline-offset-[1px] card-data-personal outline ${isOpen === 'name' ? 'card-data_active' : ''}`}>{data?.name?.firstName} {data?.name?.middleName} {data?.name?.lastName}</div>
                : null}

            {/* JobTitle */}
            {/* Default */}
            {isOpen === 'jobTitle' && !data?.jobTitle?.jobTitle ?
                <div className={`card-data card-data_comman card-data-personal themeOutLine font-semibold text-2xl outline-offset-[1px] outline ${isOpen === 'jobTitle' ? 'card-data_active' : ''}`}>Job title</div>
                : null}
            {/* Name */}
            {data.jobTitle && data.jobTitle.jobTitle ?
                <div onClick={() => dispatch(openModal({ openModal: 'jobTitle' }))} className={`card-data card-data-personal font-semibold text-2xl themeOutLine outline-offset-[1px] outline ${isOpen === 'jobTitle' ? 'card-data_active' : ''}`}>{data?.jobTitle?.jobTitle}</div>
                : null}

            {/* Department */}
            {/* Default */}
            {isOpen === 'department' && !data?.department?.department ?
                <div className={`card-data card-data_comman text-2xl themeOutLine card-data-personal font-semibold outline-offset-[1px] outline ${isOpen === 'department' ? 'card-data_active' : ''}`}>Department</div>
                : null}
            {/* Name */}
            {data.department && data.department.department ?
                <div onClick={() => dispatch(openModal({ openModal: 'department' }))} className={`card-data card-data-personal text-2xl font-semibold themeOutLine outline-offset-[1px] outline ${isOpen === 'department' ? 'card-data_active' : ''}`}>{data?.department?.department}</div>
                : null}


            {/* Company */}
            {/* Default */}
            {isOpen === 'company' && !data?.company?.company ?
                <div className={`card-data card-data_comman themeOutLine text-2xl card-data-personal font-semibold outline-offset-[1px] outline ${isOpen === 'company' ? 'card-data_active' : ''}`}>Company Name</div>
                : null}
            {/* Value */}
            {data.company && data.company.company ?
                <div onClick={() => dispatch(openModal({ openModal: 'company' }))} className={`card-data-personal card-data font-semibold text-2xl themeOutLine outline-offset-[1px] outline ${isOpen === 'company' ? 'card-data_active' : ''}`}>{data?.company?.company}</div>
                : null}

            {/* Headline */}
            {/* Default */}
            {isOpen === 'headline' && !data?.headline?.headline ?
                <div className={`card-data card-data_comman themeOutLine card-data-personal text-sm outline-offset-[1px] outline ${isOpen === 'headline' ? 'card-data_active' : ''}`}>Headline</div>
                : null}
            {/* Name */}
            {data.headline && data.headline.headline ?
                <div onClick={() => dispatch(openModal({ openModal: 'headline' }))} className={`card-data-personal card-data text-[var(--text-muted)] text-sm themeOutLine outline-offset-[1px] outline ${isOpen === 'headline' ? 'card-data_active' : ''}`}>{data?.headline?.headline}</div>
                : null}
        </>
    )
}

const mapStateToProps = state => ({
    data: state.data.cardData,
    isOpen: state.data.isOpen,
    color: state.colors.color
});

export default connect(mapStateToProps, { updateCardData })(Personal);