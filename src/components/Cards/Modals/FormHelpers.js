import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Textarea } from '@material-tailwind/react';
import { updateCardData } from '../../../data/slices/dataSlice';

/**
 * Validation error display — shown below invalid fields.
 */
export const ErrorText = ({ message }) => (
    message ? (
        <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1 ml-1 animate-slideDown">
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.25 5a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zM8 10a.75.75 0 100 1.5A.75.75 0 008 10z" />
            </svg>
            {message}
        </p>
    ) : null
);

/**
 * Required field indicator — asterisk badge.
 */
export const RequiredBadge = () => (
    <span className="text-red-400 ml-0.5 text-xs">*</span>
);

/**
 * Reusable textarea field for modal forms.
 * Handles Redux dispatch, validation, and blur/touch tracking.
 *
 * @param {Object} props
 * @param {string} props.fieldName    — Redux data key (e.g. 'jobTitle', 'department')
 * @param {string} props.label        — Display label (e.g. 'Job title')
 * @param {string} props.errorMessage — Validation message (e.g. 'Job title is required')
 * @param {string} [props.htmlFor]    — htmlFor/id for the label-input association
 */
export const TextAreaField = ({ fieldName, label, errorMessage, htmlFor }) => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.data);
    const [error, setError] = useState('');
    const touchedRef = useRef(false);

    const handleChange = (e) => {
        dispatch(updateCardData({
            modal: e.target.getAttribute('data-modal'),
            field: e.target.name,
            value: e.target.value,
        }));
        if (touchedRef.current && e.target.value.trim()) setError('');
    };

    const handleBlur = (e) => {
        touchedRef.current = true;
        setError(e.target.value.trim() ? '' : errorMessage);
    };

    return (
        <div>
            <label htmlFor={htmlFor} className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                {label}<RequiredBadge />
            </label>
            <Textarea
                id={htmlFor}
                label=""
                size="lg"
                className="!w-full"
                color="indigo"
                value={data?.cardData?.[fieldName]?.[fieldName] || ''}
                name={fieldName}
                data-modal={fieldName}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <ErrorText message={error} />
        </div>
    );
};
