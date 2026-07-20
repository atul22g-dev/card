import { toast } from 'react-toastify';
import { authService } from '../../appwrite/auth';

// Find Social Icon
export const findCardInon = (details, isOpen) => {
    for (let i = 0; i < details.length; i++) {
        if (details[i].openModal === 'social' && details[i].socialName === isOpen) {
            return details[i].icon
        } else { }
    }
}

// Find Object is empty or not 
export const isEmpty = (obj) => {
    if (!obj) return true;
    if (Object.keys(obj).length === 0) return true;
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (obj[key] && typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
                return false;
            }
        }
    }
    return true;
}

// Toasta Css
let toastcss = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
}

// Hangle Errors
export const handleErrors = (errors) => {
    for (let key in errors) {
        if (key === 'message') {
            toast.error(errors[key], toastcss);
        }
        else if (errors[key].message !== '') {
            toast.error(errors[key].message, toastcss);
        }
    }
}

export const handleSuccess = (success) => {
    toast.success(success, toastcss);
}


//  get User Data
export const getData = async () => {
    return await authService.getCurrentUser()

}