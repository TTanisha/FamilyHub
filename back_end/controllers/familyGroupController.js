const FamilyGroups = require("../models/familyGroupModel");
const Users = require("../models/userModel");
const errorToJSON = require("error-to-json");

// Include controller logic
exports.createFamilyGroup = async (req, res, next) => {
  try {
    const { groupName } = req.body;
    await FamilyGroups.create({
      groupName,
    }).then((group) =>
      res.status(200).send({
        status: "success",
        message: "Family Group (ID: " + group._id + ") successfully created",
        group,
      }),
    );
  } catch (err) {
    //parsing error to JSON
    var reason = "";
    var dbError = errorToJSON.parse(err);
    console.log("The following error occurred:" + dbError);

    res.status(401).send({
      error: dbError.message,
      message: reason + "Family group not successfully created",
    });
  }
};

exports.getFamilyGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await FamilyGroups.findById( groupId );
    reason = "";

    if (group == null) {
      reason = "Family Group not found";
      throw new Error(message = "Group not found for id: " + groupId);
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
    const group = await FamilyGroups.findOne({ _id: groupId });
    const member = await Users.findOne({ email: memberEmail });

    reason = "";

    if (group == null) {
      reason = "Family Group not found";
      throw err;
    }

    if (member == null) {
      reason = "Member not found";
      throw err;
    }

    //if new member, count should = 0
    const count = await FamilyGroups.find({
      _id: groupId,
      "groupMembers._id": member._id,
    }).count();

    if (count >= 1) {
      reason = "Member already in family.";
      throw err;
    }

    await Users.updateOne(
      { _id: member._id },
      {
        $addToSet: {
          groups: group,
        },
      },
    );

    group = await FamilyGroups.updateOne(
      { _id: groupId },
      {
        $addToSet: {
          groupMembers: member,
        },
      }, 
      { new: true }
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
      message: reason + " Member not successfully added to group",
    });
  }
};

exports.getFamilyGroupEvents = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await FamilyGroups.findById({ _id: groupId }).populate(
      "events",
    );
    reason = "";

    if (group == null) {
      reason = "Family Group not found";
      throw err;
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
      message: "Group not found",
    });
  }
};

exports.leaveFamilyGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    const group = await FamilyGroups.findOne({ _id: groupId });
    const member = await Users.findOne({ _id: memberId });
    let updatedGroup = null;
    reason = "";
    successMessage = "";

    //check if group and user are null
    if (group == null) {
      reason = "Family Group not found";
      throw err;
    }

    if (member == null) {
      reason = "User not found";
      throw err;
    }

    //check if member array is empty
    const initialMemberCount = group.groupMembers.length;
    if (initialMemberCount <= 0) {
      reason = "Group does not have any members to remove";
      throw err;
    }

    //remove member from the group's member array
    try {
      await FamilyGroups.updateOne(
        { _id: groupId },
        {
          $pull: {
            groupMembers: memberId,
          },
        },
      );
    } catch (err) {
      reason = "Member could not be removed from the group";
      throw err;
    }

    //if member array is now empty, delete the group
    try {
      updatedGroup = await FamilyGroups.findOne({ _id: groupId });

      if (updatedGroup.groupMembers.length == 0) {
        updatedGroup = await FamilyGroups.findOneAndRemove({ _id: groupId }, {new: true});

        successMessage =
          " User was the last member of the group, so the group has been deleted";
      }
    } catch (err) {
      reason =
        "The last member of the group was removed, but the group could not be deleted";
      throw err;
    }

    //remove the group from the user's groups array
    try {
      await Users.updateOne(
        { _id: memberId },
        {
          $pull: {
            groups: groupId,
          },
        },
      );
    } catch (err) {
      reason = "Group could not be removed from the member";
      throw err;
    }

    res.status(200).send({
      status: "success",
      message: "User has successfully left the family group." + successMessage,
      data: updatedGroup
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: reason,
    });
  }
};
