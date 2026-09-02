
import { Link } from "react-router-dom";

/**
 * NavLinkItem — consistent nav link with active-state highlighting.
 *
 * @param {Object}   props
 * @param {string}   props.to       - Route path
 * @param {boolean}  props.isActive - Whether the current route matches
 * @param {Function} props.onClick  - Close mobile menu, etc.
 * @param {React.ReactNode} props.children - Label / content
 * @param {string}   [props.variant] - 'default' | 'danger' (for sign-out)
 */
const NavLinkItem = ({ to, isActive, onClick, children, variant = 'default' }) => {
    const baseClass = 'block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-max';

    // Determine style based on variant
    let activeClass, inactiveClass;
    if (variant === 'danger') {
        activeClass = 'text-red-500 bg-red-50 dark:bg-red-500/10';
        inactiveClass = 'text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10';
    } else {
        activeClass = 'themeLgbg textTheme';
        inactiveClass = 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]';
    }

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
        >
            {children}
        </Link>
    );
};

export default NavLinkItem;
