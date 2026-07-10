const express = require("express");
const Group = require("../models/group");
const Message = require("../models/message");
const User = require("../models/user");
const router = express.Router();

// CREATE a new group
router.post("/", async (req, res) => {
  try {
    const { name, description, avatar, memberIds, creatorId } = req.body;

    if (!name || !creatorId) {
      return res.status(400).json({ message: "Group name and creator are required" });
    }

    // Ensure creator is included in members
    const allMembers = Array.from(new Set([creatorId, ...(memberIds || [])]));

    const group = new Group({
      name,
      description: description || "",
      avatar: avatar || "",
      members: allMembers,
      createdBy: creatorId,
    });

    await group.save();

    // Populate member info for the response
    await group.populate("members", "_id firstname email");

    res.status(201).json({
      message: "Group created",
      group: {
        _id: group._id,
        name: group.name,
        avatar: group.avatar,
        description: group.description,
        members: group.members.map((m) => ({
          _id: m._id,
          name: m.firstname,
          email: m.email,
        })),
        createdBy: group.createdBy,
        createdAt: group.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all groups for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.userId })
      .populate("members", "_id firstname email")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = groups.map((g) => ({
      _id: g._id,
      name: g.name,
      avatar: g.avatar,
      description: g.description,
      memberCount: g.members.length,
      members: g.members.map((m) => ({
        _id: m._id,
        name: m.firstname,
        email: m.email,
      })),
      createdBy: g.createdBy,
      createdAt: g.createdAt,
    }));

    res.status(200).json({ groups: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET messages for a group
router.get("/:groupId/messages", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.query;

    const messages = await Message.find({ group: groupId })
      .populate("sender", "_id firstname")
      .sort({ timestamp: 1 })
      .limit(200)
      .lean();

    const formatted = messages.map((msg) => ({
      _id: msg._id.toString(),
      text: msg.text,
      sender: msg.sender._id.toString() === userId ? "me" : "other",
      senderName: msg.sender.firstname,
      senderId: msg.sender._id.toString(),
      timestamp: msg.timestamp,
    }));

    res.status(200).json({ messages: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD a member to a group (any member can add)
router.post("/:groupId/members", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, newMemberId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check that the requester is a member
    if (!group.members.some((m) => m.toString() === userId)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Check if already a member
    if (group.members.some((m) => m.toString() === newMemberId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Verify the new member exists
    const newMember = await User.findById(newMemberId).select("_id firstname email");
    if (!newMember) {
      return res.status(404).json({ message: "User not found" });
    }

    group.members.push(newMemberId);
    await group.save();

    res.status(200).json({
      message: "Member added",
      member: {
        _id: newMember._id,
        name: newMember.firstname,
        email: newMember.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET group details
router.get("/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members", "_id firstname email")
      .lean();

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({
      group: {
        _id: group._id,
        name: group.name,
        avatar: group.avatar,
        description: group.description,
        members: group.members.map((m) => ({
          _id: m._id,
          name: m.firstname,
          email: m.email,
        })),
        createdBy: group.createdBy,
        createdAt: group.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
