import React from 'react'
import { useSelector } from 'react-redux';

const CardData = () => {
  const cardData = useSelector(state => state.database.singleData);
  let data = cardData[0] ? cardData[0].Data : ''
  let jsonData = cardData[0] ? JSON.parse(data) : ''
  let arrData = cardData[0] ? Object.entries(jsonData) : ''
  return (
    <>
      {/* Personal */}
      {arrData && arrData.map((key) => {
        let value = Object.values(key[1])
        value.pop()
        value.shift();
        return (
        key[1].value === undefined ? 
          <div key={key}
            className={`card-data font-semibold text-2xl themeOutLine !cursor-default`}
          >
            {value.join(' ')}
          </div> : ''
        );
      })
      }
      {/* Social */}
      {arrData ? arrData.map((key) => {
        return (
          key[1].value !== undefined ?

            <div key={key} className='flex card-data gap-3 min-h-[38px] !cursor-default items-center'>
              {/* Icon */}
              <div className={`icon_con flex justify-center items-center Social`}>
                <i className={`${key[1].icon} text-white text-sm`}></i>
              </div>
              {/* Text */}
              <div className='flex card-data_text_con flex-col justify-center items-start'>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{key[1]?.value}</span>
                {key[1]?.label && <span className="text-xs text-[var(--text-muted)]">{key[1]?.label}</span>}
              </div>
            </div> : ''
        )
      }) : ''
      }
    </>
  )
}

export default CardData