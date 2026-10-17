import { getAuth } from "@clerk/express";
import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";

// Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        // Finding rooms - bookings data
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate},
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

// API to check availability of room
// Endpoint
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({success: true, isAvailable})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// API to create new booking
// Endpoint
// POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        // Before Booking Check Availability
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        if(!isAvailable) {
            return res.json({success: false, message: "Room is not available"})
        }

        // if room is avialable
        // Get totalPrice from Room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        // Calculate totalPrice based on night
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil( timeDiff / (1000 * 3600 * 24) );

        totalPrice *= nights;

        // Now creating booking
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

// Mail options
const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: req.user.email,
    subject: 'Hotel Booking Confirmation - EzStays',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');
          </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Outfit', Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 10px;">
              <tr>
                  <td align="center">
                      <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                          
                          <!-- Header Banner (Black Background + Cloudinary Logo + Gold Accent) -->
                          <tr>
                              <td style="background-color: #000000; padding: 36px 24px; text-align: center; border-bottom: 3px solid #FBBF24;">
                                  <img src="https://res.cloudinary.com/p8tnfeu1/image/upload/v1790491565/logo3.svg" alt="EzStays Logo" style="max-height: 48px; width: auto; margin-bottom: 12px; display: inline-block;" />
                                  <h1 style="color: #ffffff; font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
                                      Booking Confirmation
                                  </h1>
                              </td>
                          </tr>

                          <!-- Content Body -->
                          <tr>
                              <td style="padding: 32px 28px;">
                                  <p style="font-size: 16px; margin: 0 0 12px 0; color: #1f2937; font-family: 'Outfit', sans-serif;">
                                      Dear <strong>${req.user.username}</strong>,
                                  </p>
                                  <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.6; font-family: 'Outfit', sans-serif;">
                                      Thank you for choosing <strong style="color: #2563EB;">EzStays</strong>! We are excited to confirm your upcoming stay. Below are your reservation details:
                                  </p>

                                  <!-- Reservation Details Card -->
                                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
                                      <tr>
                                          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; font-family: 'Outfit', sans-serif;">Booking ID</td>
                                          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #1e293b; text-align: right; font-family: 'Outfit', sans-serif;">${booking._id}</td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; font-family: 'Outfit', sans-serif;">Hotel Name</td>
                                          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 16px; font-weight: 600; color: #2563EB; text-align: right; font-family: 'Playfair Display', Georgia, serif;">${roomData.hotel.name}</td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; font-family: 'Outfit', sans-serif;">Location</td>
                                          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #1e293b; text-align: right; font-family: 'Outfit', sans-serif;">${roomData.hotel.address}</td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; font-family: 'Outfit', sans-serif;">Check-In Date</td>
                                          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #1e293b; text-align: right; font-family: 'Outfit', sans-serif;">${new Date(booking.checkInDate).toDateString()}</td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 10px 0; font-size: 14px; color: #64748b; font-family: 'Outfit', sans-serif;">Total Amount</td>
                                          <td style="padding: 10px 0; font-size: 18px; font-weight: 700; color: #2563EB; text-align: right; font-family: 'Outfit', sans-serif;">
                                              <span style="background-color: #FBBF24; color: #000000; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 6px; font-weight: 600;">Paid</span>
                                              ${process.env.CURRENCY || '$'}${booking.totalPrice}
                                          </td>
                                      </tr>
                                  </table>

                                  <p style="font-size: 14px; color: #334155; margin: 0 0 12px 0; font-family: 'Outfit', sans-serif;">
                                      We look forward to welcoming you!
                                  </p>
                                  <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.5; font-family: 'Outfit', sans-serif;">
                                      If you need to make any changes or have special requests, please feel free to contact us.
                                  </p>
                              </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                              <td style="background-color: #f8fafc; padding: 18px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; font-family: 'Outfit', sans-serif;">
                                  &copy; ${new Date().getFullYear()} EzStays. All rights reserved.
                              </td>
                          </tr>

                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `
};

        // Sending email
        await transporter.sendMail(mailOptions)
        
        // response
        res.json({success: true, message: "Booking created successfully"});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: "Failed to create booking"});
    }
}

// API to get all bookings for a specific user
// Endpoint: GET /api/bookings/user

export const getUserBookings = async (req, res) => {
    try {
        // Extract the authenticated user's ID (added by auth middleware)
        const user = req.user._id;

        // Fetch all bookings made by this user:
        // - Filter by user ID
        // - Populate 'room' and 'hotel' references to return full details
        // - Sort by creation date (newest first)
        let bookings = await Booking.find({ user })
            .populate("room hotel")
            .sort({ createdAt: -1 });

        // Filter out bookings whose room no longer exists
        // This prevents frontend crashes when a room is deleted
        bookings = bookings.filter(b => b.room);

        // Send response with the cleaned and sorted data
        res.json({ success: true, bookings });

    } catch (error) {
        // Handle errors such as database issues or invalid user
        res.json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
};

// API to get booking details for a particular owner
export const getHotelBookings = async (req, res) => {
    try {
        // Extract userId consistently using getAuth
        const { userId } = getAuth(req);

        // Find the hotel for this owner
        const hotel = await Hotel.findOne({ owner: userId });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel found" });
        }

        // Find all bookings for this hotel and populate related data
        let bookings = await Booking.find({ hotel: hotel._id })
            .populate("room hotel user")
            .sort({ createdAt: -1 });

        // Remove bookings whose room was deleted
        bookings = bookings.filter(b => b.room);

        // Total Bookings
        const totalBookings = bookings.length;

        // Total Revenue (only count paid bookings)
        const totalRevenue = bookings
            .filter(booking => booking.isPaid)
            .reduce((acc, booking) => acc + booking.totalPrice, 0);

        // Send response
        res.json({ 
            success: true, 
            dashboardData: { totalBookings, totalRevenue, bookings } 
        });

    } catch (error) {
        console.error("Get Hotel Bookings Error:", error);
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
};

// controller function - for making payment for our bookings
export const stripePayment = async (req, res) => {
    try {
        // Getting booking id
        const { bookingId } = req.body;

        // Find booking data
        const booking = await Booking.findById(bookingId);
        // Find room data from booking data
        const roomData = await Room.findById(booking.room).populate('hotel');
        // Getting price
        const totalPrice = booking.totalPrice;
        // Origin - means frontend url
        const { origin } = req.headers;

        // Stripe instance
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Line items - for stripe
        const line_items = [
            {
                price_data:{
                    currency: "usd",
                    product_data:{
                        name: roomData.hotel.name,
                    },
                    unit_amount: Math.round(totalPrice * 100)
                },
                quantity: 1,
            }
        ]

        // Create Checkout Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata:{
                bookingId,
            }
        })

        // Send response
        res.json({success: true, url: session.url})

    } catch (error) {
        console.error("Stripe Payment Error:", error);
        res.json({success: false, message: "Payment Failed"})
    }
}