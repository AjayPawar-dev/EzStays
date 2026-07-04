import React from 'react'
import HotelCard from './HotelCard'
import { roomsDummyData } from '../assets/assets'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const FeaturedDestination = () => {

    const navigate = useNavigate()
    return (
        <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
            <Title
                title="Featured Destinations"
                subTitle="Explore our handpicked selection of premium luxury suites and boutique hotels designed for your ultimate comfort."
            />
            <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
                {roomsDummyData.slice(0, 4).map((room, index) => (
                    <HotelCard key={room._id} room={room} index={index} />
                ))}
            </div>

            <button
                onClick={() => { navigate('/rooms'); window.scrollTo(0, 0); }}
                className="mt-12 group flex items-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded text-sm font-medium hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-sm hover:shadow-md shadow-gray-200 cursor-pointer self-start md:self-auto shrink-0"
            >
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination