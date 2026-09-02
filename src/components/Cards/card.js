import { useEffect, useState } from 'react';
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

const Card = ({ loading, colors, fetchColors, Color }) => {
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
    <div className="w-full md:w-[28vw] md:min-w-[300px] md:max-w-[420px] h-auto md:h-[calc(100vh-56px)] card_con_left relative flex flex-col items-center pt-8 themeLgbg smoot_transition md:left-0 md:top-0 md:bottom-0 md:right-0 scrool-hidden overflow-hidden flex-shrink-0">
      {/* Card */}
      <div className="w-full max-w-[380px] scale-in flex-shrink-0 px-4 md:px-0">
        <div className="modern-card">
          {/* Card Header */}
          <div className="card-header-modern" style={{ minHeight: '140px' }}>
            <div className="card-header-deco card-header-deco-1"></div>
            <div className="card-header-deco card-header-deco-2"></div>
            <div className="card-header-deco card-header-deco-3"></div>
            {/* Subtle shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
          </div>

          {/* Card Body */}
          <div className="card-body-modern min-h-[20rem] relative">
            <Personal />
            <Social />
          </div>
        </div>
      </div>
      {/* Colors Section */}
      <div className="w-full max-w-[380px] color-picker-section flex-shrink-0 pb-6 mt-[2rem] px-4 md:px-0">
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-4 shadow-[var(--shadow-sm)]">
        <h3 className="color-picker-title">
          <i className="fa-regular fa-palette mr-1.5"></i>
          Theme Colors
        </h3>
        <div className="color-picker-grid">
          {!loading && colors.map(color => (
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
    </div>
  );
};

const mapStateToProps = state => ({
  colors: state.colors.colors,
  Color: state.colors.color,
  loading: state.colors.loading
});

export default connect(mapStateToProps, { fetchColors })(Card);
