
import { useSelector, useDispatch } from 'react-redux';
import { closeModal, saveData, openDeleteModal, removeField } from '../../../data/slices/dataSlice';
import * as personal from './content/personal';
import * as generial from './content/generial';
import DeleteModal from '../../common/DeleteModal';
import ModalShell from '../../common/ModalShell';

/**
 * Modal — field editor overlay.
 * Shows inline form for personal / social fields and a DeleteModal
 * confirmation when the user clicks "Remove".
 */
const Modal = () => {
    const data = useSelector(state => state.data);
    const modals = useSelector(state => state.data.modals);
    const isOpen = useSelector(state => state.data.isOpen);
    const isDelete = useSelector(state => state.data.isDelete);
    const dispatch = useDispatch();

    // Check if required fields have actual content for the current modal
    const hasContent = (() => {
        if (!isOpen || !data.cardData[isOpen]) return false;
        const field = data.cardData[isOpen];
        if (isOpen === 'name') return field?.firstName?.trim() && field?.lastName?.trim();
        if (isOpen === 'jobTitle') return field?.jobTitle?.trim();
        if (isOpen === 'department') return field?.department?.trim();
        if (isOpen === 'company') return field?.company?.trim();
        if (isOpen === 'headline') return field?.headline?.trim();
        return field?.value?.trim();
    })();

    return (
        <>
            {/* Delete confirmation — uses shared DeleteModal */}
            <DeleteModal
                title="Remove this field?"
                description="The information will be permanently removed from your card."
                isOpen={isDelete[isOpen]}
                onCancel={() => dispatch(openDeleteModal({ modal: isOpen, itstrue: false }))}
                onConfirm={() => dispatch(removeField({ modal: isOpen, itstrue: false }))}
                confirmText="Remove"
            />

            {/* Field editor modal */}
            {(isOpen && !isDelete[isOpen]) && (
                <ModalShell isOpen onClose={() => dispatch(closeModal(isOpen))}>
                    <div
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && hasContent) {
                                dispatch(saveData(isOpen));
                            }
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-8 pt-5 sm:pt-8 pb-2">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] capitalize">
                                {isOpen === 'social' ? 'Social Link' : isOpen.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <button
                                onClick={() => dispatch(closeModal(isOpen))}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200"
                                aria-label="Close modal"
                            >
                                <i className="fa-regular fa-xmark text-lg"></i>
                            </button>
                        </div>
                        {/* Body — dynamically rendered field inputs */}
                        <div className="px-4 sm:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">
                            {modals.name && <personal.Name />}
                            {modals.jobTitle && <personal.JobTitle />}
                            {modals.department && <personal.Department />}
                            {modals.company && <personal.Company />}
                            {modals.headline && <personal.Headline />}
                            {modals.social && <generial.Social />}
                        </div>
                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 sm:py-5 border-t border-[var(--border-color)] gap-3">
                            <button
                                onClick={() => dispatch(openDeleteModal({ modal: isOpen, itstrue: true }))}
                                className="px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 flex items-center gap-2"
                            >
                                <i className="fa-regular fa-trash-can"></i>
                                Remove
                            </button>
                            <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto'>
                                <button
                                    className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
                                    type="button"
                                    onClick={() => dispatch(closeModal(isOpen))}
                                >Close</button>
                                <button
                                    onClick={!hasContent ? null : () => dispatch(saveData(isOpen))}
                                    className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        hasContent
                                            ? 'themeBg text-white hover:brightness-90 hover:shadow-lg hover:shadow-[var(--theme-color)]/30'
                                            : 'border border-[var(--btn-disable-color)] text-[var(--btn-disable-color)] cursor-not-allowed'
                                    }`}
                                >
                                    <i className="fa-regular fa-check mr-2"></i>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalShell>
            )}
        </>
    )
}

export default Modal;
