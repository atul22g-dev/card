
import { useDispatch } from 'react-redux';
import { openModal } from '../../../../data/slices/dataSlice';

const PersonalFieldItem = ({ fieldKey, label, icon, value, isOpen }) => {
  const dispatch = useDispatch();
  if (isOpen === fieldKey && !value) {
    return (
      <div className={`card-text-style card-text-icon card-default-outline card_data_default font-semibold text-2xl justify-center card-text-style_active`}>
        <i className={`fa-regular ${icon} mr-3 text-xl`}></i> {label}
      </div>
    );
  }
  if (value) {
    return (
      <button
        type="button"
        onClick={() => dispatch(openModal({ openModal: fieldKey }))}
        className="card-personal-item-modern"
      >
        <div className="card-personal-item-icon-wrap">
          <i className={`fa-regular ${icon}`}></i>
        </div>
        <div className="card-personal-item-content">
          <span className="card-personal-item-label">{label}</span>
          <span className="card-personal-item-value">{value}</span>
        </div>
        <div className="card-personal-item-arrow">
          <i className="fa-regular fa-pen"></i>
        </div>
      </button>
    );
  }
  return null;
};

export default PersonalFieldItem;
