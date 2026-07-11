import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'

const Dashboard = () => {

    const [dashboardData, setDashboardData] = useState(dashboardDummyData)

    return (
        <div className='p-6 md:p-10 text-gray-800'>
            <Title 
                align='left' 
                font='outfit' 
                title='Dashboard' 
                subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with realtime insights to ensure smooth operations.' 
            />
            
            <div className='flex flex-wrap gap-4 my-8'>
                <div className='bg-blue-50/50 border border-blue-100 rounded-lg flex items-center p-4 pr-8 min-w-60 flex-1'>
                    <img src={assets.totalBookingIcon} alt="Bookings" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-600 text-sm uppercase tracking-wider'>Total Bookings</p>
                        <p className='text-2xl text-neutral-800 mt-1'>{dashboardData.totalBookings}</p>
                    </div>
                </div>

                <div className='bg-blue-50/50 border border-blue-100 rounded-lg flex items-center p-4 pr-8 min-w-60 flex-1'>
                    <img src={assets.totalRevenueIcon} alt="Revenue" className='max-sm:hidden h-10' />
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-600 text-sm uppercase tracking-wider'>Total Revenue</p>
                        <p className='text-2xl text-neutral-800 mt-1'>${dashboardData.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-auto shadow-sm rounded-t-lg'>
                <table className='w-full border-collapse'>
                    <thead className='bg-gray-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(209,213,219,1)]'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium text-sm'>User Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-sm max-sm:hidden'>Room Type</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-sm text-center'>Total Amount</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-sm text-center'>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm divide-y divide-gray-200'>
                        {dashboardData.bookings
                            .filter(item => item.room)
                            .map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50/50 transition-colors'>
                                    <td className='py-3 px-4 text-gray-700'>
                                        {item.user.username}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 max-sm:hidden'>
                                        {item.room.roomType}
                                    </td>
                                    <td className='py-3 px-4 text-gray-700 text-center font-medium'>
                                        ${item.totalPrice}
                                    </td>
                                    <td className='py-3 px-4 text-center'>
                                        <span className={`inline-block py-1 px-3 text-xs font-medium rounded-full ${item.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {item.isPaid ? 'Completed' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard