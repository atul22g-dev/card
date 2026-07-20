import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    savecardData: {},
    cardData: {},
    modals: {},
    isDelete: {},
    isOpen: null,
    isSocial: null,
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setCardData(state, action) {
            let sData = action.payload;
            let singleData = Array.isArray(sData) && sData[0] ? sData[0].Data : '';
            let jsonSingleData = {};
            try {
                const parsed = singleData ? JSON.parse(singleData) : {};
                // Keep __themeColor in cardData so preview components can read it from Redux
                jsonSingleData = parsed;
            } catch (e) {
                console.error('Failed to parse saved card data:', e);
                jsonSingleData = {};
            }
            state.cardData = jsonSingleData;
            state.savecardData = jsonSingleData;
        },
        updateCardData(state, action) {
            const { modal, field, value, icon } = action.payload;
            const updatedCardData = {
                "modal": modal,
                ...state.cardData[modal],
                [field]: value,
                icon
            };

            // Check if all fields are empty
            const allFieldsEmpty = Object.values(updatedCardData).every(fieldValue => fieldValue === '');
            // Update state only if at least one field has a non-empty value
            if (!allFieldsEmpty) {
                state.cardData[modal] = updatedCardData;
            } else {
                // Delete the modal from cardData
                delete state.cardData[modal];
            }
        },
        openModal(state, action) {
            const { openModal, name } = action.payload;
            state.modals[openModal] = true;
            state.isOpen = (openModal === 'social' ? name : openModal);
            state.isSocial = (name === undefined ? false : true);
        },
        closeModal(state, action) {
            const openModal = action.payload;
            state.modals[openModal] = false;
            state.modals['social'] = false;
            state.isOpen = undefined;
            if (openModal !== 'social') {
                state.cardData[openModal] = {
                    ...state.savecardData[openModal]
                };
            }
            state.isSocial = false
        },
        saveData(state, action) {
            const modalName = action.payload;
            state.savecardData[modalName] = {
                ...state.cardData[modalName],
                saveData: 'true'
            };
            state.modals['social'] = false;
            state.modals[modalName] = false;
            state.isOpen = null;
            state.cardData[modalName] = {
                ...state.cardData[modalName],
                saveData: 'true'
            };
        },
        openDeleteModal(state, action) {
            const { modal, itstrue } = action.payload;
            let itsDeleteVal = {
                [modal]: itstrue
            }
            state.isDelete = itsDeleteVal;
        },
        removeField(state, action) {
            const { modal, itstrue } = action.payload;
            let itsDeleteVal = {
                [modal]: itstrue
            }
            state.cardData[modal] = undefined;
            state.savecardData[modal] = undefined;
            state.isDelete = itsDeleteVal;
            state.modals[modal] = false
            state.isOpen = null;
        },
    },
});

export const { updateCardData, openModal, closeModal, saveData, openDeleteModal, removeField, setCardData } = dataSlice.actions;
export default dataSlice.reducer;
