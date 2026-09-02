import { useState, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Input } from "@material-tailwind/react";
import { updateCardData } from '../../../../data/slices/dataSlice';
import { ErrorText, RequiredBadge, TextAreaField } from '../FormHelpers';

export const Name = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data);
    const [errors, setErrors] = useState({});
    const touchedRef = useRef({});

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
        if (touchedRef.current[field]) {
            setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
        }
    };

    const handleBlur = (e) => {
        const field = e.target.name;
        const value = e.target.value;
        touchedRef.current = { ...touchedRef.current, [field]: true };
        setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
    };    return (
        <>
            <div>
                <label htmlFor="personal-firstName" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    First name<RequiredBadge />
                </label>
                <Input className="!w-full" color="indigo"
                    id="personal-firstName"
                    value={data?.cardData?.name?.firstName || ''}
                    size="lg" name='firstName' data-modal="name" label=""
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <ErrorText message={errors.firstName} />
            </div>
            <div>
                <label htmlFor="personal-middleName" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Middle name
                </label>
                <Input className="!w-full" color="indigo"
                    id="personal-middleName"
                    value={data?.cardData?.name?.middleName || ''}
                    size="lg" name='middleName' data-modal="name" label=""
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="personal-lastName" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Last name<RequiredBadge />
                </label>
                <Input className="!w-full" color="indigo"
                    id="personal-lastName"
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

export const JobTitle = () => (
    <TextAreaField
        fieldName="jobTitle"
        label="Job title"
        errorMessage="Job title is required"
        htmlFor="personal-jobTitle"
    />
);

export const Department = () => (
    <TextAreaField
        fieldName="department"
        label="Department"
        errorMessage="Department is required"
        htmlFor="personal-department"
    />
);

export const Company = () => (
    <TextAreaField
        fieldName="company"
        label="Company name"
        errorMessage="Company name is required"
        htmlFor="personal-company"
    />
);

export const Headline = () => (
    <TextAreaField
        fieldName="headline"
        label="Headline"
        errorMessage="Headline is required"
        htmlFor="personal-headline"
    />
);
