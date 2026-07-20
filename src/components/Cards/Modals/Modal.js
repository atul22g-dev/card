import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { closeModal, saveData, openDeleteModal, removeField } from '../../../data/slices/dataSlice';
import * as personal from './content/personal';
import * as generial from './content/generial';

const Modal = () => {
    const data = useSelector(state => state.data);
    const modals = useSelector(state => state.data.modals);
    const isOpen = useSelector(state => state.data.isOpen);
    const isDelete = useSelector(state => state.data.isDelete);
    const dispatch = useDispatch();
    return (
        <>
            {/* Delete Modal */}
            {isDelete[isOpen] &&
                (<>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none scale-in"
                    >
                        <div className="relative w-auto my-6 mx-4 sm:mx-auto sm:max-w-md">
                            {/*content*/}
                            <div className="border-0 rounded-2xl shadow-xl relative flex flex-col w-full bg-[var(--bg-primary)] outline-none focus:outline-none">
                                {/*body*/}
                                <div className="px-5 sm:px-8 py-8 sm:py-10 flex flex-col items-center gap-4 text-center">
                                    <div className='w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 flex items-center justify-center'>
                                        <svg className='w-8 h-8 text-red-500' aria-hidden="true" focusable="false" data-prefix="far" data-icon="xmark" role="img" viewBox="0 0 384 512" fill="currentColor">
                                            <path d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-lg text-[var(--text-primary)]'>Remove this field?</h3>
                                        <p className='text-sm text-[var(--text-muted)] mt-1'>The information will be permanently removed from your card</p>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-3 px-5 sm:px-8 py-4 sm:py-5 border-t border-[var(--border-color)]">
                                    <button
                                        className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
                                        type="button"
                                        onClick={() => dispatch(openDeleteModal({ modal: isOpen, itstrue: false }))}
                                    >Cancel</button>
                                    <button
                                        onClick={() => dispatch(removeField({ modal: isOpen, itstrue: false }))}
                                        className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all duration-200"
                                    >Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black backdrop-blur-sm"></div>
                </>)
            }

            {/* Modal */}
            {(isOpen && !isDelete[isOpen]) && (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none scale-in"
                    >
                        <div className="relative w-auto my-6 mx-4 sm:mx-auto sm:max-w-lg">
                            {/*content*/}
                            <div className="border-0 rounded-2xl shadow-xl relative flex flex-col w-full bg-[var(--bg-primary)] outline-none focus:outline-none">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-8 pb-2">
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)] capitalize">
                                        {isOpen === 'social' ? 'Social Link' : isOpen.replace(/([A-Z])/g, ' $1').trim()}
                                    </h3>
                                    <button
                                        onClick={() => dispatch(closeModal(isOpen))}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200"
                                    >
                                        <i className="fa-regular fa-xmark text-lg"></i>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="px-5 sm:px-8 py-5 sm:py-6 flex flex-col gap-5">
                                    {/* Personal */}
                                    {modals.name && <personal.Name />}
                                    {modals.jobTitle && <personal.JobTitle />}
                                    {modals.department && <personal.Department />}
                                    {modals.company && <personal.Company />}
                                    {modals.headline && <personal.Headline />}
                                    {/* Generial */}
                                    {modals.social && <generial.Social />}
                                </div>
                                {/*footer*/}
                                <div className="flex flex-col sm:flex-row items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-t border-[var(--border-color)] gap-3">
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
                                            onClick={!data.cardData[isOpen] ? null : () => dispatch(saveData(isOpen))}
                                            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                data.cardData[isOpen]
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
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black backdrop-blur-sm"></div>
                </>
            )}
        </>
    )
}


export default Modal;

