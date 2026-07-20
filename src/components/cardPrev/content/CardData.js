import React from 'react'
import { useSelector } from 'react-redux';

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
  }

  // Social platform brand colors
  const brandColors = {
    instagram: '#E4405F',
    linkedin: '#0A66C2',
    facebook: '#1877F2',
    youtube: '#FF0000',
    snapchat: '#FFFC00',
    whatsapp: '#25D366',
    discord: '#5865F2',
    telegram: '#26A5E4',
    github: '#333333',
    twitter: '#1DA1F2',
    paypal: '#00457C',
    gpay: '#4285F4',
  };

  // Keys to exclude from personal field display (metadata, not actual content)
  const metaKeys = ['modal', 'icon', 'saveData', 'saveColor'];

  return (
    <>
      {/* Personal Fields */}
      {arrData.map(([key, value]) => {
        if (value.value !== undefined) return null; // Skip social fields
        // Filter out metadata keys and empty values
        const vals = Object.entries(value)
          .filter(([k, v]) => !metaKeys.includes(k) && v && v !== 'true' && v !== '')
          .map(([k, v]) => v);
        if (vals.length === 0) return null;
        return (
          <div key={key}
            className="card-data font-semibold text-xl sm:text-2xl themeOutLine !cursor-default"
          >
            {vals.join(' ')}
          </div>
        );
      })}

      {/* Social Fields */}
      {arrData.map(([key, value]) => {
        if (value.value === undefined) return null; // Skip personal fields
        const brandColor = brandColors[key] || null;
        return (
          <div key={key} className="flex card-data gap-3 min-h-[38px] !cursor-default items-center group">
            {/* Icon with brand color */}
            <div 
              className="icon_con flex justify-center items-center Social"
              style={brandColor ? { backgroundColor: brandColor } : undefined}
            >
              <i className={`${value.icon} text-white text-sm`}></i>
            </div>
            {/* Text */}
            <div className="flex card-data_text_con flex-col justify-center items-start">
              <span className="text-sm font-semibold text-[var(--text-primary)]">{value?.value}</span>
              {value?.label && <span className="text-xs text-[var(--text-muted)]">{value?.label}</span>}
            </div>
          </div>
        );
      })}
    </>
  )
}

export default CardData