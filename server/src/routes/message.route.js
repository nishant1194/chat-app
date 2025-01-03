import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", getUsersForSidebar);
router.get("/:id/:userid", getMessages);

router.post("/send/:id", sendMessage);

export default router;
