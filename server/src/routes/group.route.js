import express from "express";
import {
  createGroup,
  addMember,
  removeMember,
  sendMessage,
  getMyGroup,
  getGroupMessages
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", createGroup);
router.get("/messages/:grpID", getGroupMessages);
router.get("/:userId", getMyGroup);
router.put("/:groupId/add", addMember);
router.put("/:groupId/remove", removeMember);
router.post("/:groupId/message", sendMessage);

export default router;
