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
    // Card container
    <div className="w-[33vw] h-screen card_con_left grid place-content-center max-md:hidden themeLgbg smoot_transition fixed left-0 top-14 bottom-0 right-[60vw] overflow-hidden">
      {/* card */}
      <div className="w-[28vw] rounded-xl mb-5 shadow-card scale-in">
        {/* Card Header */}
        <div className='w-full min-h-[16vh] rounded-t-xl themeBg relative overflow-hidden'>
          {/* Decorative pattern overlay */}
          <div className='absolute inset-0 opacity-20'>
            <div className='absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-xl'></div>
            <div className='absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/15 blur-lg'></div>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full'></div>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/15 rounded-full'></div>
          </div>
        </div>
        {/* Card Body */}
        <div className='w-full min-h-[3.1vh] rounded-b-xl flex flex-col gap-2 bg-[var(--bg-primary)] px-3 py-5'>
          <Personal />
          <Social />
        </div>
      </div>
      {/* Colors Section */}
      <div className="w-[28vw] relative">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 ml-1">Theme Colors</h3>
        <div className="flex flex-wrap gap-2.5">
          {!loding && colors.map(color => (
            <div key={color.id} className="relative">
              <button
                onClick={() => dispatch(setCurrentColor(color.color))}
                onMouseEnter={() => setHoveredColor(color.color)}
                onMouseLeave={() => setHoveredColor(null)}
                className={`h-7 w-7 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md ${Color === color.color
                  ? 'ring-2 ring-offset-2 ring-[var(--theme-color)] scale-110 shadow-lg'
                  : 'hover:z-10'
                  }`}
                style={{
                  backgroundColor: `rgb(${color.color})`,
                }}
                aria-label={colorNames[color.color] || color.name}
              ></button>
              {hoveredColor === color.color && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none shadow-lg">
                  {colorNames[color.color] || color.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--text-primary)]"></div>
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
