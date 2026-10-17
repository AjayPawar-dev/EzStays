import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailabililty } from "../controllers/roomController.js";

const roomRouter = express.Router();

// Endpoint 
// 1st Route to upload the images when to create room
roomRouter.post('/', upload.array("images", 4), protect, createRoom);
// 2nd Route to get the room data
roomRouter.get('/', getRooms);
// 3rd Route to fetch the data of the room for the owner
roomRouter.get('/owner', protect, getOwnerRooms);
// 4th Route to update whether the room is available or not
roomRouter.post('/toggle-availability', protect, toggleRoomAvailabililty);

export default roomRouter;