const Events = require("../models/eventModel");

exports.createEvent = async(req, res) => {
  const newEvent = await Events.create(req.body);
  
};

exports.getEvent = async(req, res) => {

};

exports.updateEventName = async(req, res) => {

};

exports.updateEventBody = async(req, res) => {

};

exports.updateEventTime = async(req, res) => {

};

exports.updateEventLocation = async(req, res) => {

};

exports.updateEventTags = async(req, res) => {

};

exports.updateEventGroup = async(req, res) => {

};

exports.deleteEvent = async(req, res) => {

};
