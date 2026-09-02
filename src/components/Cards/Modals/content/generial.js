import { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Input } from "@material-tailwind/react";
import { updateCardData } from '../../../../data/slices/dataSlice';
import { findCardIcon } from '../../../func/AllFunc';
import { ErrorText, RequiredBadge } from '../FormHelpers';

export const Social = () => {
    const dispatch = useDispatch();
    const details = useSelector(state => state.details.details);
    const { cardData, isOpen: modal } = useSelector(state => state.data);
    const [error, setError] = useState('');
    const touchedRef = useRef(false);
    let ficon = findCardIcon(details, modal)

    const handleValueChange = (e) => {
        dispatch(updateCardData({
            modal: modal,
            field: e.target.name,
            value: e.target.value,
            icon: ficon
        }));
        if (touchedRef.current && e.target.value.trim()) setError('');
    };

    const handleValueBlur = (e) => {
        touchedRef.current = true;
        if (!e.target.value.trim()) {
            setError('Value is required');
        } else {
            setError('');
        }
    };

    return (
        <>
            <div>
                <label htmlFor="social-value" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Value<RequiredBadge />
                </label>
                <Input className="!w-full" color="indigo"
                    id="social-value"
                    value={cardData[modal]?.value || ''}
                    size="lg" name='value' label=""
                    onChange={handleValueChange}
                    onBlur={handleValueBlur}
                />
                <ErrorText message={error} />
            </div>

        </>
    )
}
