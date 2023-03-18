const FamilyGroups = require("../models/familyGroupModel");
const Users = require("../models/userModel");

// Include controller logic
exports.createFamilyGroup = async (req, res) => {
  try {
    const { groupName } = req.body;
    const group = await FamilyGroups.create({
      groupName,
    });

    res.status(200).send({
      status: "success",
      message: "Family Group (ID: " + group._id + ") successfully created",
      group,
    });
  } catch (err) {
    res.status(401).send({
      message: err.message,
      description: "Family group not successfully created",
    });
  }
};

exports.getFamilyGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await FamilyGroups.findById(groupId);

    if (group == null) {
      throw new Error((message = "Group not found for id: " + groupId));
    }

    res.status(200).send({
      status: "success",
      message: "Found group",
      data: {
        group: group,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
      description: "Group not found",
    });
  }
};

exports.addMemberToFamilyGroup = async (req, res) => {
  try {
    const { groupId, memberEmail } = req.body;
    let group = await FamilyGroups.findById(groupId);
    let member = await Users.findOne({ email: memberEmail });

    if (group == null) {
      throw new Error((message = "Family Group not found"));
    }

    if (member == null) {
      throw new Error((message = "Member not found"));
    }

    //if new member, count should = 0
    const count = await FamilyGroups.countDocuments({
      _id: groupId,
      groupMembers: {
        _id: member._id,
      },
    });

    if (count >= 1) {
      throw new Error((message = "Member already in family."));
    }

    member = await Users.findByIdAndUpdate(
      member._id,
      {
        $addToSet: {
          groups: group,
        },
      },
      { runValidators: true, new: true }
    );

    group = await FamilyGroups.findByIdAndUpdate(
      groupId,
      {
        $addToSet: {
          groupMembers: member,
        },
      },
      { runValidators: true, new: true }
    );

    res.status(200).send({
      status: "success",
      message: "Added member to group",
      data: {
        group: group,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
      description: "Member not successfully added to group",
    });
  }
};

exports.getFamilyGroupEvents = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await FamilyGroups.findById(groupId).populate("events");

    if (group == null) {
      throw new Error((message = "Family Group not found"));
    }

    res.status(200).send({
      status: "success",
      message: "Found group",
      data: {
        groupEvents: group.events,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
      description: "Group not found",
    });
  }
};

exports.leaveFamilyGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    let group = await FamilyGroups.findById(groupId);
    let member = await Users.findById(memberId);
    successMessage = "";

    //check if group and user are null
    if (group == null) {
      throw new Error((message = "Family Group not found"));
    }

    if (member == null) {
      throw new Error((message = "User not found"));
    }

    //check if member array is empty
    const initialMemberCount = group.groupMembers.length;
    if (initialMemberCount <= 0) {
      throw new Error((message = "Group does not have any members to remove"));
    }

    //remove member from the group's member array
    group = await FamilyGroups.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          groupMembers: memberId,
        },
      },
      { new: true }
    );

    //if member array is now empty, delete the group

    group = await FamilyGroups.findById(groupId);

    if (group.groupMembers.length == 0) {
      group = await FamilyGroups.findByIdAndRemove(groupId, {
        new: true,
      });

      successMessage =
        " User was the last member of the group, so the group has been deleted";
    }

    //remove the group from the user's groups array
    await Users.findByIdAndUpdate(memberId, {
      $pull: {
        groups: groupId,
      },
    });

    res.status(200).send({
      status: "success",
      message: "User has successfully left the family group." + successMessage,
      data: group,
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
    });
  }
};
