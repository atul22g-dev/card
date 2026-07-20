import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchColors, setCurrentColor } from '../../data/slices/colors';
import { useDispatch } from 'react-redux';
import Personal from './content/Personal';
import Social from './content/Social';

const Card = ({ loding, colors, fetchColors, Color }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchColors();
    document.documentElement.style.setProperty('--theme-color', `rgb(${Color})`);
    document.documentElement.style.setProperty('--light-theme-color', `rgba(${Color}, .25)`);
    document.documentElement.style.setProperty('--theme-color-rgb', Color);
  }, [Color, fetchColors]);
  return (
    // Card container
    <div className="w-[33vw] h-screen card_con_left grid place-content-center max-md:hidden themeLgbg smoot_transition fixed left-0 top-14 bottom-0 right-[60vw] overflow-hidden">
      {/* card */}
      <div className="w-[28vw] rounded-xl mb-5 shadow-card scale-in">
        {/* Card Header */}
        <div className='w-full min-h-[16vh] rounded-t-xl themeBg relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-b from-white/10 dark:from-white/5 to-transparent'></div>
        </div>
        {/* Card Body */}
        <div className='w-full min-h-[3.1vh] rounded-b-xl flex flex-col gap-2 bg-[var(--bg-primary)] px-5 py-4 pt-7 pb-5'>
          <Personal />
          <Social />
        </div>
      </div>
      {/* Colors Section */}
      <div className="w-[28vw]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 ml-1">Theme Colors</h3>
        <div className="flex flex-wrap gap-2.5">
          {!loding && colors.map(color => (
            <button
              key={color.id}
              onClick={() => dispatch(setCurrentColor(color.color))}
              className={`h-7 w-7 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md ${
                Color === color.color ? 'ring-2 ring-offset-2 ring-[var(--theme-color)] scale-110' : ''
              }`}
              style={{
                backgroundColor: `rgb(${color.color})`,
              }}
              title={color.name}
            ></button>
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
