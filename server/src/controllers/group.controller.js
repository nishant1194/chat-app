import Group from "../models/group.model.js";

//get my groups

 export const getMyGroup = async (req, res) => {
    const userId = req.params.userId;
     try {
      const groups = Group.find({members: userId})
      res.status(200).json(groups) ;
    } catch (error) {
      res.status(500).json({ message: "Error creating group", error });
    }
  };

// Create a group
export const createGroup = async (req, res) => {
  const { name, admin, members } = req.body;
  try {
    const group = new Group({ name, admin, members });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};

// Add a member to a group
export const addMember = async (req, res) => {
  const { memberId } = req.body;
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $addToSet: { members: memberId } },
      { new: true }
    );
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error });
  }
};

// Remove a member from a group
export const removeMember = async (req, res) => {
  const { memberId } = req.body;
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $pull: { members: memberId } },
      { new: true }
    );
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error removing member", error });
  }
};

// Send a message to a group
export const sendMessage = async (req, res) => {
  const { sender, content } = req.body;
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $push: { messages: { sender, content } } },
      { new: true }
    ).populate("messages.sender", "fullName");
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};
