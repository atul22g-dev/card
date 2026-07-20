import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Input, Textarea } from "@material-tailwind/react";
import { updateCardData } from '../../../../data/slices/dataSlice';

// Helper: validation error display
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

// Required field label suffix
const RequiredBadge = () => (
    <span className="text-red-400 ml-0.5 text-xs">*</span>
);

export const Name = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validate = useCallback((field, value) => {
        if (field === 'middleName') return ''; // Middle name is optional
        return value.trim() ? '' : `${field === 'firstName' ? 'First name' : 'Last name'} is required`;
    }, []);

    const handleChange = (e) => {
        const field = e.target.name;
        const value = e.target.value;
        dispatch(updateCardData({
            modal: e.target.getAttribute('data-modal'),
            field: field,
            value: value
        }));
        // Clear error on change if previously touched
        if (touched[field]) {
            setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
        }
    };

    const handleBlur = (e) => {
        const field = e.target.name;
        const value = e.target.value;
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
    };    return (
        <>
            <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    First name<RequiredBadge />
                </label>
                <Input className="!w-full" color="indigo"
                    value={data?.cardData?.name?.firstName || ''}
                    size="lg" name='firstName' data-modal="name" label=""
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <ErrorText message={errors.firstName} />
            </div>
            <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Middle name
                </label>
                <Input className="!w-full" color="indigo"
                    value={data?.cardData?.name?.middleName || ''}
                    size="lg" name='middleName' data-modal="name" label=""
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Last name<RequiredBadge />
                </label>
                <Input className="!w-full" color="indigo"
                    value={data?.cardData?.name?.lastName || ''}
                    size="lg" name='lastName' data-modal="name" label=""
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <ErrorText message={errors.lastName} />
            </div>
        </>
    )
}

export const JobTitle = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        dispatch(updateCardData({
            modal: e.target.getAttribute('data-modal'),
            field: e.target.name,
            value: e.target.value
        }));
        if (touched && e.target.value.trim()) setError('');
    };

    const handleBlur = (e) => {
        setTouched(true);
        if (!e.target.value.trim()) {
            setError('Job title is required');
        } else {
            setError('');
        }
    };

    return (
        <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Job title<RequiredBadge />
            </label>
            <Textarea label="" size='lg' className="!w-full" color="indigo"
                value={data?.cardData?.jobTitle?.jobTitle || ''}
                name='jobTitle' data-modal="jobTitle"
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <ErrorText message={error} />
        </div>
    )
}

export const Department = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        dispatch(updateCardData({
            modal: e.target.getAttribute('data-modal'),
            field: e.target.name,
            value: e.target.value
        }));
        if (touched && e.target.value.trim()) setError('');
    };

    const handleBlur = (e) => {
        setTouched(true);
        if (!e.target.value.trim()) {
            setError('Department is required');
        } else {
            setError('');
        }
    };

    return (
        <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Department<RequiredBadge />
            </label>
            <Textarea label="" size='lg' className="!w-full" color="indigo"
                value={data?.cardData?.department?.department || ''}
                name='department' data-modal="department"
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <ErrorText message={error} />
        </div>
    )
}

export const Company = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        dispatch(updateCardData({
            modal: e.target.getAttribute('data-modal'),
            field: e.target.name,
            value: e.target.value
        }));
        if (touched && e.target.value.trim()) setError('');
    };

    const handleBlur = (e) => {
        setTouched(true);
        if (!e.target.value.trim()) {
            setError('Company name is required');
        } else {
            setError('');
        }
    };

    return (
        <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Company name<RequiredBadge />
            </label>
            <Textarea label="" size='lg' className="!w-full" color="indigo"
                value={data?.cardData?.company?.company || ''}
                name='company' data-modal="company"
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <ErrorText message={error} />
        </div>
    )
}

export const Headline = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        dispatch(updateCardData({
            modal: e.target.getAttribute('data-modal'),
            field: e.target.name,
            value: e.target.value
        }));
        if (touched && e.target.value.trim()) setError('');
    };

    const handleBlur = (e) => {
        setTouched(true);
        if (!e.target.value.trim()) {
            setError('Headline is required');
        } else {
            setError('');
        }
    };

    return (
        <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Headline<RequiredBadge />
            </label>
            <Textarea label="" size='lg' className="!w-full" color="indigo"
                value={data?.cardData?.headline?.headline || ''}
                name='headline' data-modal="headline"
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <ErrorText message={error} />
        </div>
    )
}
