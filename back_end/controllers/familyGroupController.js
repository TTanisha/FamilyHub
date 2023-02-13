const FamilyGroups = require("../models/familyGroupModel");
const Users = require("../models/userModel");
const errorToJSON = require('error-to-json');
const { db } = require("../models/familyGroupModel");

// Include controller logic
exports.createFamilyGroup = async(req, res, next) => { 
    try {
      const { groupName } = req.body
          await FamilyGroups.create({
            groupName
          }).then(group =>
            res.status(200).json({
              status: "success",
              message: "Family Group (ID: " + group._id +") successfully created",
              group,
            })
          )
    } catch (err) {
      //parsing error to JSON
      var reason = "";
      var dbError = errorToJSON.parse(err);
      console.log("The following error occured:" + dbError);

      res.status(401).json({
          message: reason + "Family group not successfully created",
        })
    }
    
};

exports.getFamilyGroup = async(req, res) => {
  try {
    
    const { groupId } = req.body
    const group = await FamilyGroups.findOne({ _id: groupId });
    reason = "";

    if (group == null) {
      reason = "Family Group not found";
      throw err;
    }

    res.status(200).json({
        status: "success",
        message: "Found group",
        data: {
            group: group,
        },
    });
  } catch (err) {

    res.status(404).json({
        status: "fail",
        message: "Group not found",
    });
  }
};

exports.addMemberToFamilyGroup = async(req, res) => {
    try {
      
      const { groupId, memberId } = req.body
      const group = await FamilyGroups.findOne({ _id: groupId });
      const member = await Users.findOne({ _id: memberId });

      reason = "";
  
      if (group == null) {
        reason = "Family Group not found";
        throw err;
      }

      if (member == null) {
        reason = "Member not found";
        throw err;
      }

      const isNotNewMember = await FamilyGroups.findOne({
        _id: groupId ,
        groupMembers: { $in: [member._id]},
        }).count();

        if(!isNotNewMember) {
            reason = "Member already in family.";
            throw err;
        }

      const result = await FamilyGroups.updateOne({ _id: groupId },
        {
            $addToSet: {
                groupMembers: member,
            },
        });

      res.status(200).json({
          status: "success",
          message: "Added member to group",
          data: {
              group: group,
          },
      });
    } catch (err) {
      res.status(404).json({
          status: "fail",
          message: reason + " Member not successfully added to group",
        });
    }
  };

