
import { connect, useDispatch } from 'react-redux';
import HeroSection from './personal/HeroSection';
import PersonalFieldItem from './personal/PersonalFieldItem';

const FIELDS = [
  { key: 'jobTitle',   label: 'Job Title',   icon: 'fa-briefcase' },
  { key: 'department', label: 'Department',   icon: 'fa-folder-tree' },
  { key: 'company',    label: 'Company',      icon: 'fa-building' },
];

const Personal = ({ data, isOpen, color }) => {
  const dispatch = useDispatch();

  const hasContent =
    (data.name && (data?.name?.firstName || data?.name?.middleName || data?.name?.lastName)) ||
    data?.headline?.headline ||
    data?.jobTitle?.jobTitle ||
    data?.department?.department ||
    data?.company?.company;

  return (
    <>
      <HeroSection data={data} isOpen={isOpen} color={color} dispatch={dispatch} />

      <div className="card-personal-section-modern">
        {FIELDS.map(({ key, label, icon }) => (
          <PersonalFieldItem
            key={key}
            fieldKey={key}
            label={label}
            icon={icon}
            value={data?.[key]?.[key] || ''}
            isOpen={isOpen}
          />
        ))}
      </div>

      {hasContent && <div className="card-divider"></div>}
    </>
  );
};

const mapStateToProps = state => ({
  data: state.data.cardData,
  isOpen: state.data.isOpen,
  color: state.colors.color
});

export default connect(mapStateToProps)(Personal);
