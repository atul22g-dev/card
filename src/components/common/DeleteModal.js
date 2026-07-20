import React from 'react';

/**
 * DeleteModal — reusable confirmation dialog.
 *
 * @param {Object}   props
 * @param {string}   props.title          - Heading (e.g. "Remove this field?")
 * @param {string}   props.description    - Body text
 * @param {boolean}  props.isOpen         - Show / hide
 * @param {boolean}  props.isLoading      - Disable buttons while processing
 * @param {Function} props.onCancel       - Close handler
 * @param {Function} props.onConfirm      - Delete handler
 * @param {string}   [props.confirmText]  - "Remove" or "Delete"
 */
const DeleteModal = ({
    title = 'Remove this field?',
    description = 'The information will be permanently removed from your card.',
    isOpen = false,
    isLoading = false,
    onCancel,
    onConfirm,
    confirmText = 'Remove',
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
                onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
            >
                <div className="relative w-auto my-6 mx-4 sm:mx-auto sm:max-w-md scale-in">
                    <div className="border-0 rounded-2xl shadow-xl relative flex flex-col w-full bg-[var(--bg-primary)] outline-none focus:outline-none">
                        {/* Icon */}
                        <div className="px-5 sm:px-8 pt-8 sm:pt-10 pb-2 flex flex-col items-center gap-4 text-center">
                            <div className="delete-modal-icon-box">
                                <svg className="delete-modal-icon" aria-hidden="true" viewBox="0 0 384 512" fill="currentColor">
                                    <path d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="delete-modal-title">{title}</h3>
                                <p className="delete-modal-desc">{description}</p>
                            </div>
                        </div>
                        {/* Footer actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 px-5 sm:px-8 py-4 sm:py-5 border-t border-[var(--border-color)]">
                            <button
                                className="delete-modal-cancel-btn"
                                type="button"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="delete-modal-confirm-btn flex items-center justify-center gap-2"
                                autoFocus
                            >
                                {isLoading && (
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                )}
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop opacity-25 fixed inset-0 z-40 bg-black backdrop-blur-sm"></div>
        </>
    );
};

export default DeleteModal;
