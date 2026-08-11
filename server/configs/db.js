import mongoose from "mongoose";

const connectDB = async()=>{//asyncrhronous function to connect to mongodb
    try{                        //event
        mongoose.connection.on('connected', ()=>console.log("Database Connected")); //whenever we are connected to the db we will print the message db connected
        await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`)//to acess the env variable where our monogodb uri is stored
    } catch(error){// if any error occur in the try block we simply return the error in the console

        console.log(error.message);
    }
}

export default connectDB;