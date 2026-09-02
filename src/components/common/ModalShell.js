import { useRef, useEffect } from 'react';

/**
 * ModalShell — reusable modal overlay using the native <dialog> element.
 *
 * The native <dialog> provides:
 *   • Focus trapping (Tab cycles within the dialog)
 *   • Escape key closes the dialog automatically
 *   • Backdrop via ::backdrop pseudo-element
 *   • Proper aria-modal semantics for screen readers
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen       — Show / hide
 * @param {Function} props.onClose      — Close handler (backdrop click, Escape)
 * @param {React.ReactNode} props.children — Modal content
 * @param {string}   [props.size]       — max-width class (default: 'sm:max-w-lg')
 */
const ModalShell = ({ isOpen, onClose, children, size = 'sm:max-w-lg' }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
        if (!isOpen) return;

        // Backdrop dismiss: a mousedown on the dialog's backdrop closes it.
        // Registered on `document` instead of as a JSX prop on the native
        // <dialog> — <dialog> is a non-interactive element per jsx-a11y, so
        // carrying a raw mouse handler on it would trip
        // no-noninteractive-element-interactions. Backdrop clicks target the
        // <dialog> element itself; clicks on the content target inner nodes.
        // Keyboard users close via Escape (the dialog's native cancel event,
        // handled below) or the modal's own close buttons.
        const handleBackdropMouseDown = (e) => {
            if (e.target === dialog) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleBackdropMouseDown);
        return () => document.removeEventListener('mousedown', handleBackdropMouseDown);
    }, [isOpen, onClose]);

    // The dialog's native cancel event fires on Escape key press
    const handleCancel = (e) => {
        e.preventDefault();
        onClose();
    };

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            aria-modal="true"
            aria-label="Modal"
            tabIndex={-1}
            className={`rounded-2xl border-0 p-0 shadow-xl bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm w-[calc(100vw-32px)] sm:w-auto ${size}`}
        >
            <div className="relative w-full bg-[var(--bg-primary)] rounded-2xl outline-none scale-in">
                {children}
            </div>
        </dialog>
    );
};

export default ModalShell;
