import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/assets';

const MyBookings = () => {

    const [bookings, setBookings] = useState(userBookingsDummyData);


  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
        <Title
        title='My Bookings' subTitle='Review your upcoming resort itineraries, stay details, and reservation payment records.'
        align='left'/>

        <div className='max-w-6xl mt-8 w-full text-gray-800'>
            
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
            <div className='w-1/3'>Hotels</div>
            <div className='w-1/3'>Date & Timings</div>
            <div className='w-1/3'>Payment</div>
        </div>

             {bookings.map((booking)=>(
                 <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t gap-4 items-center'>
                     {/* ------ Hotel Details ---- */}
                     <div className='flex flex-col md:flex-row'>
                         <img src={booking.room.images[0]} alt="hotel-img" className='md:w-44 rounded shadow object-cover' />
                         <div className='flex flex-col gap-1.5 max-md:mt-3 md:ml-4'>
                             <p className='font-playfair text-2xl'>{booking.hotel.name}
                                 <span className='font-inter text-sm text-gray-500'> ({booking.room.roomType})</span>
                             </p>
                             <div className='flex items-center gap-1 text-sm text-gray-500'>
                                 <img src={assets.locationIcon} alt="location-icon" />
                                 <span>{booking.hotel.address}</span>
                             </div>
                             {/* Number of Guests  */}
                             <div className='flex items-center gap-1 text-sm text-gray-500'>
                                 <img src={assets.guestsIcon} alt="guests-icon" />
                                 <span>Guests: {booking.guests}</span>
                             </div>
                             <p className='text-base font-medium'>Total: ${booking.totalPrice}</p>
                         </div>
                     </div>

                {/* ------ Date & Timings ---- */}
                <div className='flex flex-row md:flex-col md:items-start md:gap-2 mt-3 gap-8 text-sm'>
                    <div>
                        <p className='font-medium text-gray-700 md:inline'>Check-In: </p>
                        <p className='text-gray-500 inline md:block'>
                            {new Date(booking.checkInDate).toDateString()}
                        </p>
                    </div>
                    <div>
                        <p className='font-medium text-gray-700 md:inline'>Check-Out: </p>
                        <p className='text-gray-500 inline md:block'>
                            {new Date(booking.checkOutDate).toDateString()}
                        </p>
                    </div>
                </div>

                {/* ------ Payment Status ---- */}
                <div className='flex flex-col items-start justify-center pt-3'>
                    <div className='flex items-center gap-2'>
                        <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                        <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                            {booking.isPaid ? "Paid" : "Unpaid"}
                        </p>
                    </div>
                    {/* For Unpaid  */}
                    {!booking.isPaid && (
                        <button onClick={()=>handlePayment(booking._id)} className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                            Pay Now
                        </button>
                    )}
                </div>      

                 </div>
             ))}
        </div>
    </div>
  )
}

export default MyBookings