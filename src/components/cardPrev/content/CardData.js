
import { useSelector } from 'react-redux';
import brandColors, { platformLabels } from '../../../constants/brandColors';

/* --- Preview sub-components --- */

const AvatarRing = ({ color }) => (
  <div
    className="card-hero-avatar-ring"
    style={{
      background: `linear-gradient(135deg, rgb(${color}), color-mix(in srgb, rgb(${color}) 70%, #000))`
    }}
  ></div>
);

const PreviewHero = ({ displayName, initials, headline, savedThemeColor }) => (
  <div className="card-hero-section">
    {displayName && (
      <div className="card-hero-avatar-wrapper">
        <div className="card-hero-avatar">{initials}</div>
        {savedThemeColor && <AvatarRing color={savedThemeColor} />}
      </div>
    )}
    {displayName && (
      <div className="card-hero-name" style={savedThemeColor ? { '--name-color': `rgb(${savedThemeColor})` } : {}}>
        <h2 className="card-hero-name-text">{displayName}</h2>
      </div>
    )}
    {headline && <p className="card-hero-headline">{headline}</p>}
  </div>
);

const PersonalFieldRow = ({ label, icon, value }) => (
  <div className="card-personal-item-modern card-personal-item-preview">
    <div className="card-personal-item-icon-wrap">
      <i className={`fa-regular ${icon}`}></i>
    </div>
    <div className="card-personal-item-content">
      <span className="card-personal-item-label">{label}</span>
      <span className="card-personal-item-value">{value}</span>
    </div>
  </div>
);

const FIELD_META = {
  jobTitle: { label: 'Job Title', icon: 'fa-briefcase' },
  department: { label: 'Department', icon: 'fa-folder-tree' },
  company: { label: 'Company', icon: 'fa-building' },
};
const metaKeys = ['modal', 'icon', 'saveData', 'saveColor'];

const PreviewPersonalFields = ({ personalFields }) => {
  const displayFields = personalFields.filter(([key]) => key !== 'name' && key !== 'headline');
  if (displayFields.length === 0) return null;

  return (
    <div className="card-personal-section-modern">
      {displayFields.map(([key, value]) => {
        const vals = Object.entries(value).reduce((acc, [k, v]) => {
          if (!metaKeys.includes(k) && v && v !== 'true' && v !== '') acc.push(v);
          return acc;
        }, []);
        if (vals.length === 0 || key === '__themeColor' || key === '__cardTitle') return null;
        const meta = FIELD_META[key] || { label: key, icon: 'fa-circle' };
        return <PersonalFieldRow key={key} label={meta.label} icon={meta.icon} value={vals.join(' ')} />;
      })}
    </div>
  );
};

const SocialFieldRow = ({ platformKey, value }) => {
  const brandColor = brandColors[platformKey] || null;
  const platformName = platformLabels[platformKey] || platformKey.charAt(0).toUpperCase() + platformKey.slice(1);
  return (
    <div className="card-social-item-modern card-social-item-preview" style={brandColor ? { '--social-brand': brandColor } : {}}>
      <div className="card-social-item-bg"></div>
      <div className="card-social-item-icon-wrap" style={brandColor ? { backgroundColor: brandColor } : undefined}>
        <i className={`${value.icon || 'fa-solid fa-link'} text-white`}></i>
      </div>
      <div className="card-social-item-content">
        <span className="card-social-item-platform">{platformName}</span>
        <span className="card-social-item-value">{value?.value}</span>
      </div>
    </div>
  );
};

const PreviewSocialFields = ({ socialFields }) => {
  if (socialFields.length === 0) return null;
  return (
    <div className="card-social-section-modern">
      {socialFields.map(([key, value]) => (
        <SocialFieldRow key={key} platformKey={key} value={value} />
      ))}
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-8 text-[var(--text-muted)]">
    <div className="w-16 h-16 rounded-2xl themeLgbg flex items-center justify-center mx-auto mb-3">
      <i className="fa-regular fa-address-card text-2xl textTheme"></i>
    </div>
    <p className="text-sm font-medium">No card data</p>
    <p className="text-xs mt-1">Create a new card to get started</p>
  </div>
);

/* --- Main CardData component --- */

const CardData = () => {
  const cardData = useSelector(state => state.database.singleData);

  let jsonData = {};
  let arrData = [];
  try {
    const rawData = Array.isArray(cardData) && cardData[0] ? cardData[0].Data : '';
    if (rawData) {
      jsonData = JSON.parse(rawData);
      arrData = Object.entries(jsonData);
    }
  } catch (e) {
    console.error('Failed to parse card data:', e);
  }

  const personalFields = arrData.filter(([, value]) => value.value === undefined);
  const socialFields = arrData.filter(([, value]) => value.value !== undefined);

  let displayName = '';
  let headline = '';
  let firstName = '';
  let lastName = '';

  personalFields.forEach(([key, value]) => {
    if (key === 'name') {
      firstName = value.firstName || '';
      lastName = value.lastName || '';
      displayName = `${firstName} ${value.middleName || ''} ${lastName}`.trim();
    }
    if (key === 'headline') {
      headline = value.headline || '';
    }
  });

  if (!displayName) {
    personalFields.forEach(([, value]) => {
      const vals = Object.entries(value).reduce((acc, [k, v]) => {
        if (!metaKeys.includes(k) && v && v !== 'true' && v !== '') acc.push(v);
        return acc;
      }, []);
      if (vals.length > 0 && !displayName) {
        displayName = vals.join(' ');
      }
    });
  }

  const savedThemeColor = jsonData.__themeColor || '';
  const initials = ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || '?';

  return (
    <>
      <PreviewHero displayName={displayName} initials={initials} headline={headline} savedThemeColor={savedThemeColor} />
      {(displayName || socialFields.length > 0) && <div className="card-divider"></div>}
      <PreviewPersonalFields personalFields={personalFields} />
      <PreviewSocialFields socialFields={socialFields} />
      {arrData.length === 0 && <EmptyState />}
    </>
  );
}

export default CardData
