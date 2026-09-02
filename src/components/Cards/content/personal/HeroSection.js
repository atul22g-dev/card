
import { openModal } from '../../../../data/slices/dataSlice';

const AvatarPlaceholder = ({ onClick }) => (
  <div className="card-hero-avatar-wrapper">
    <button
      type="button"
      className="card-hero-avatar-placeholder"
      onClick={onClick}
      aria-label="Add profile photo"
    >
      <i className="fa-regular fa-camera"></i>
    </button>
  </div>
);

const AvatarInitials = ({ initials, color, onClick }) => (
  <div className="card-hero-avatar-wrapper">
    <button type="button" className="card-hero-avatar" onClick={onClick}>
      {initials}
    </button>
    <div
      className="card-hero-avatar-ring"
      style={{
        background: `linear-gradient(135deg, rgb(${color}), color-mix(in srgb, rgb(${color}) 70%, #000))`
      }}
    ></div>
  </div>
);

const HeroAvatar = ({ data, isOpen, color, dispatch }) => {
  const hasName = data.name && (data?.name?.firstName || data?.name?.middleName || data?.name?.lastName);
  const initials = (
    (data?.name?.firstName?.charAt(0) || '') +
    (data?.name?.lastName?.charAt(0) || '')
  ).toUpperCase();
  if (hasName) {
    return <AvatarInitials initials={initials} color={color} onClick={() => dispatch(openModal({ openModal: 'name' }))} />;
  }
  if (isOpen === 'name') {
    return <AvatarPlaceholder onClick={() => dispatch(openModal({ openModal: 'name' }))} />;
  }
  return null;
};

const HeroName = ({ data, isOpen, color, dispatch }) => {
  const hasName = data.name && (data?.name?.firstName || data?.name?.middleName || data?.name?.lastName);
  if (hasName) {
    return (
      <button
        type="button"
        onClick={() => dispatch(openModal({ openModal: 'name' }))}
        className={`card-hero-name ${isOpen === 'name' ? 'card-text-style_active' : ''}`}
        style={{ '--name-color': `rgb(${color})` }}
      >
        <h2 className="card-hero-name-text">
          {data?.name?.firstName} {data?.name?.middleName} {data?.name?.lastName}
        </h2>
      </button>
    );
  }
  if (isOpen === 'name') {
    return (
      <div className="card-text-style card-text-icon card-default-outline card_data_default card-hero-name-placeholder justify-center card-text-style_active">
        <i className="fa-regular fa-user mr-2"></i> Name
      </div>
    );
  }
  return null;
};

const HeroHeadline = ({ data, isOpen, dispatch }) => {
  const hasHeadline = data.headline && data.headline.headline;
  if (hasHeadline) {
    return (
      <button
        type="button"
        onClick={() => dispatch(openModal({ openModal: 'headline' }))}
        className={`card-hero-headline ${isOpen === 'headline' ? 'card-text-style_active' : ''}`}
      >
        {data?.headline?.headline}
      </button>
    );
  }
  if (isOpen === 'headline') {
    return (
      <div className="card-text-style card-text-icon card-default-outline card_data_default card-hero-headline-placeholder justify-center card-text-style_active">
        <i className="fa-regular fa-heading mr-2"></i> Headline
      </div>
    );
  }
  return null;
};

const HeroSection = ({ data, isOpen, color, dispatch }) => (
  <div className="card-hero-section">
    <HeroAvatar data={data} isOpen={isOpen} color={color} dispatch={dispatch} />
    <HeroName data={data} isOpen={isOpen} color={color} dispatch={dispatch} />
    <HeroHeadline data={data} isOpen={isOpen} dispatch={dispatch} />
  </div>
);

export default HeroSection;
