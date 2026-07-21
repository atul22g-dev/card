import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchColors, setCurrentColor } from '../../data/slices/colors';
import { useDispatch } from 'react-redux';
import Personal from './content/Personal';
import Social from './content/Social';

const colorNames = {
  '244, 90, 87': 'Coral Red',
  '251, 146, 65': 'Orange',
  '250, 192, 0': 'Amber',
  '200, 163, 88': 'Gold',
  '61, 181, 18': 'Green',
  '0, 224, 187': 'Teal',
  '15, 155, 255': 'Sky Blue',
  '58, 74, 248': 'Royal Blue',
  '165, 61, 245': 'Purple',
  '53, 57, 59': 'Charcoal',
  '235, 71, 218': 'Pink',
  '172, 185, 190': 'Gray',
};

const Card = ({ loding, colors, fetchColors, Color }) => {
  const dispatch = useDispatch();
  const [hoveredColor, setHoveredColor] = useState(null);

  // Fetch color list once on mount
  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  // Apply color whenever it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', `rgb(${Color})`);
    document.documentElement.style.setProperty('--light-theme-color', `rgba(${Color}, .25)`);
    document.documentElement.style.setProperty('--theme-color-rgb', Color);
  }, [Color]);

  return (
    <div className="w-[33vw] h-[calc(100vh-61px)] pt-[10rem] pb-[3rem] card_con_left relative grid place-content-center max-md:hidden themeLgbg smoot_transition left-0 top-0 bottom-0 right-[60vw] overflow-hidden scrool-hidden">
      {/* Card */}
      <div className="w-[28vw] max-w-[380px] scale-in">
        <div className="modern-card">
          {/* Card Header */}
          <div className="card-header-modern" style={{ minHeight: '140px' }}>
            <div className="card-header-deco card-header-deco-1"></div>
            <div className="card-header-deco card-header-deco-2"></div>
            <div className="card-header-deco card-header-deco-3"></div>
          </div>
          
          {/* Card Body */}
          <div className="card-body-modern">
            <Personal />
            <Social />
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div className="w-[28vw] max-w-[380px] color-picker-section">
        <h3 className="color-picker-title">
          <i className="fa-regular fa-palette mr-1.5"></i>
          Theme Colors
        </h3>
        <div className="color-picker-grid">
          {!loding && colors.map(color => (
            <div key={color.id} className="relative">
              <button
                onClick={() => dispatch(setCurrentColor(color.color))}
                onMouseEnter={() => setHoveredColor(color.color)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`color-swatch ${Color === color.color ? 'active' : ''}`}
                style={{
                  backgroundColor: `rgb(${color.color})`,
                }}
                aria-label={colorNames[color.color] || color.name}
              ></button>
              {hoveredColor === color.color && (
                <div className="color-swatch-tooltip">
                  {colorNames[color.color] || color.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  colors: state.colors.colors,
  Color: state.colors.color,
  loding: state.colors.loading
});

export default connect(mapStateToProps, { fetchColors })(Card);
