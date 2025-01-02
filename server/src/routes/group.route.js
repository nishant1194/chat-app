import express from "express";
import {
  createGroup,
  addMember,
  removeMember,
  sendMessage,
  getMyGroup
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", createGroup);
router.get("/:userId", getMyGroup);
router.put("/:groupId/add", addMember);
router.put("/:groupId/remove", removeMember);
router.post("/:groupId/message", sendMessage);

export default router;
