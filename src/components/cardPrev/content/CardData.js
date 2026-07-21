import React from 'react'
import { useSelector } from 'react-redux';
import brandColors, { platformLabels } from '../../../constants/brandColors';

const CardData = () => {
  const cardData = useSelector(state => state.database.singleData);

  // Safely parse card data with error handling
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
    jsonData = {};
    arrData = [];
  }  // Keys to exclude from personal field display (metadata, not actual content)
  const metaKeys = ['modal', 'icon', 'saveData', 'saveColor'];

  // Extract personal fields
  const personalFields = arrData.filter(([key, value]) => value.value === undefined);
  // Extract social fields
  const socialFields = arrData.filter(([key, value]) => value.value !== undefined);

  // Get name for avatar initials
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

  // If no name field, build from personal fields
  if (!displayName) {
    personalFields.forEach(([key, value]) => {
      const vals = Object.entries(value)
        .filter(([k, v]) => !metaKeys.includes(k) && v && v !== 'true' && v !== '')
        .map(([k, v]) => v);
      if (vals.length > 0 && !displayName) {
        displayName = vals.join(' ');
      }
    });
  }

  // Get saved theme color from card data JSON
  let savedThemeColor = '';
  try {
    if (jsonData.__themeColor) {
      savedThemeColor = jsonData.__themeColor;
    }
  } catch (e) {
    // ignore
  }

  // Get initials for avatar
  const initials = (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '') || '?';
  // Card Data in JSON
  // console.log(JSON.parse(cardData[0].Data));
  return (
    <>
      {/* ══ HERO SECTION — Avatar, Name, Headline ══ */}
      <div className="card-hero-section">
        {/* Avatar */}
        {displayName && (
          <div className="card-hero-avatar-wrapper">
            <div className="card-hero-avatar">
              {initials.toUpperCase()}
            </div>
            {savedThemeColor && (
              <div className="card-hero-avatar-ring"
                style={{ background: `linear-gradient(135deg, rgb(${savedThemeColor}), color-mix(in srgb, rgb(${savedThemeColor}) 70%, #000))` }}
              ></div>
            )}
          </div>
        )}

        {/* Name */}
        {displayName && (
          <div className="card-hero-name" style={savedThemeColor ? { '--name-color': `rgb(${savedThemeColor})` } : {}}>
            <h2 className="card-hero-name-text">{displayName}</h2>
          </div>
        )}

        {/* Headline */}
        {headline && (
          <p className="card-hero-headline">{headline}</p>
        )}
      </div>

      {/* Divider */}
      {(displayName || socialFields.length > 0) && (
        <div className="card-divider"></div>
      )}

      {/* Other Personal Fields (jobTitle, department, company, etc.) */}
      {(() => {
        const fieldIcons = {
          jobTitle: 'fa-briefcase',
          department: 'fa-folder-tree',
          company: 'fa-building',
        };
        const fieldLabels = {
          jobTitle: 'Job Title',
          department: 'Department',
          company: 'Company',
        };
        const displayFields = personalFields.filter(([key]) => key !== 'name' && key !== 'headline');
        if (displayFields.length === 0) return null;
        return (
          <div className="card-personal-section-modern">
            {displayFields.map(([key, value]) => {
              const vals = Object.entries(value)
              .filter(([k, v]) => !metaKeys.includes(k) && v && v !== 'true' && v !== '')
              .map(([k, v]) => v);
              if (vals.length === 0 || key === "__themeColor") return null;
              return (
                <div key={key} className="card-personal-item-modern card-personal-item-preview">
                  <div className="card-personal-item-icon-wrap">
                    <i className={`fa-regular ${fieldIcons[key] || 'fa-circle'}`}></i>
                  </div>
                  <div className="card-personal-item-content">
                    <span className="card-personal-item-label">{fieldLabels[key] || key}</span>
                    <span className="card-personal-item-value">{vals.join(' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Social Fields */}
      {socialFields.length > 0 && (
        <div className="card-social-section-modern">
          {socialFields.map(([key, value]) => {
            const brandColor = brandColors[key] || null;
            const platformName = platformLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <div key={key} className="card-social-item-modern card-social-item-preview" style={brandColor ? { '--social-brand': brandColor } : {}}>
                <div className="card-social-item-bg"></div>
                <div
                  className="card-social-item-icon-wrap"
                  style={brandColor ? { backgroundColor: brandColor } : undefined}
                >
                  <i className={`${value.icon || 'fa-solid fa-link'} text-white`}></i>
                </div>
                <div className="card-social-item-content">
                  <span className="card-social-item-platform">{platformName}</span>
                  <span className="card-social-item-value">{value?.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fallback if no card data at all */}
      {arrData.length === 0 && (
        <div className="text-center py-8 text-[var(--text-muted)]">
          <div className="w-16 h-16 rounded-2xl themeLgbg flex items-center justify-center mx-auto mb-3">
            <i className="fa-regular fa-address-card text-2xl textTheme"></i>
          </div>
          <p className="text-sm font-medium">No card data</p>
          <p className="text-xs mt-1">Create a new card to get started</p>
        </div>
      )}
    </>
  )
}

export default CardData