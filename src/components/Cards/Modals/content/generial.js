import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Input } from "@material-tailwind/react";
import { updateCardData } from '../../../../data/slices/dataSlice';
import { findCardInon } from '../../../func/AllFunc';

const RequiredBadge = () => (
    <span className="text-red-400 ml-0.5 text-xs">*</span>
);

const ErrorText = ({ message }) => (
    message ? (
        <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1 ml-1 animate-slideDown">
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.25 5a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zM8 10a.75.75 0 100 1.5A.75.75 0 008 10z"/>
            </svg>
            {message}
        </p>
    ) : null
);

export const Social = () => {
    const dispatch = useDispatch();
    const details = useSelector(state => state.details.details);
    const data = useSelector(state => state.data);
    const modal = useSelector(state => state.data.isOpen);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);
    let ficon = findCardInon(details, modal)

    const handleValueChange = (e) => {
        dispatch(updateCardData({
            modal: modal,
            field: e.target.name,
            value: e.target.value,
            icon: ficon
        }));
        if (touched && e.target.value.trim()) setError('');
    };

    const handleValueBlur = (e) => {
        setTouched(true);
        if (!e.target.value.trim()) {
            setError('Value is required');
        } else {
            setError('');
        }
    };

    return (
        <>
            <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Value<RequiredBadge />
                </label>
                <Input className="!w-full" color="indigo"
                    value={data?.cardData[modal]?.value || ''}
                    size="lg" name='value' label=""
                    onChange={handleValueChange}
                    onBlur={handleValueBlur}
                />
                <ErrorText message={error} />
            </div>
            {/* <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Label <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                </label>
                <Input className="!w-full" color="indigo"
                    value={data?.cardData[modal]?.label || ''}
                    size="lg" name='label' label=""
                    onChange={(e) => dispatch(updateCardData({
                        modal: modal,
                        field: e.target.name,
                        value: e.target.value,
                        icon: ficon
                    }))}
                />
            </div> */}
        </>
    )
}
