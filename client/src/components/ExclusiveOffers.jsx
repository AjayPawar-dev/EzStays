import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title 
          align="left" 
          title="Exclusive Offers" 
          subTitle="Unlock limited-time deals, tailored escape packages, and curated member benefits designed for your next unforgettable journey."
        />

        <button className="group flex items-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded text-sm font-medium hover:bg-gray-200 transition-all duration-300 cursor-pointer self-start md:self-auto shrink-0">
          View All Offers
          <img 
            src={assets.arrowIcon} 
            alt="arrow-icon" 
            className="group-hover:translate-x-1 transition-all duration-300"
          />
        </button>
      </div>

      <div>

      </div>
    </div>
  )
}

export default ExclusiveOffers