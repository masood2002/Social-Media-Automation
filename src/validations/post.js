import { errorResponse } from "../resources/index.js";

// Arrays of post values
const postDataTypes = ["match", "player", "official"];
const postActions = [
  "match_summary",
  "match_result",
  "toss_result",
  "match_scheduled",

  "player_Birthday",
  "player_Anniversary",
  "player_Retirement",

  "official_Birthday",

  "official_Promotion",

  "official_Achievement",
];

const postNetworks = ["social media", "email"];
const postChannels = ["instagram", "facebook", "twitter"];
const postStatuses = ["sent", "not-sent"];

// Validation functions
const validateAction = (action) => postActions.includes(action);
const validateNetwork = (network) => postNetworks.includes(network);
const validateChannel = (channel) => postChannels.includes(channel);
const validateStatus = (status) => postStatuses.includes(status);

export const postValidations = async (req, res, next) => {
  try {
    // Validate 'dataType'
    if (!req.body.dataType || !postDataTypes.includes(req.body.dataType)) {
      return res.status(422).json(errorResponse(req.__("Invalid dataType")));
    }
    // Validate 'action'
    if (!req.body.action || !validateAction(req.body.action)) {
      return res.status(422).json(errorResponse(req.__("Invalid action")));
    }

    // validate targetId
    if (!req.body.targetId || typeof req.body.targetId !== "string") {
      return res.status(422).json(errorResponse(req.__("Invalid target Id")));
    }
    // validate content
    if (!req.body.content || typeof req.body.content !== "string") {
      return res.status(422).json(errorResponse(req.__("Invalid content")));
    }
    // validate image
    if (!req.body.image.url || typeof req.body.image.url !== "string") {
      return res.status(422).json(errorResponse(req.__("Invalid image type")));
    }

    // Validate 'network'
    if (
      !req.body.networks ||
      !Array.isArray(req.body.networks) ||
      req.body.networks.length === 0 ||
      req.body.networks.some((net) => !validateNetwork(net))
    ) {
      return res.status(422).json(errorResponse(req.__("Invalid networks")));
    }

    // Validate 'channels'
    if (
      !req.body.channels ||
      !Array.isArray(req.body.channels) ||
      req.body.channels.length === 0 ||
      req.body.channels.some((chan) => !validateChannel(chan))
    ) {
      return res.status(422).json(errorResponse(req.__("Invalid channels")));
    }

    // Validate 'status'
    if (!req.body.action || !validateStatus(req.body.status)) {
      return res.status(422).json(errorResponse(req.__("Invalid status")));
    }

    const scheduleDate = new Date(req.body.scheduleDate);
    const currentDate = new Date();

    if (
      isNaN(scheduleDate.getTime()) ||
      !/^(\d{4}-\d{2}-\d{2})$/.test(req.body.scheduleDate) ||
      scheduleDate < currentDate.setHours(0, 0, 0, 0)
    ) {
      return res
        .status(422)
        .json(errorResponse(req.__("Invalid scheduleDate")));
    }

    // Validate 'scheduleTime'
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!req.body.scheduleTime || !timePattern.test(req.body.scheduleTime)) {
      return res
        .status(422)
        .json(errorResponse(req.__("Invalid scheduleTime")));
    }

    // Validate 'scheduleDateTime'
    const scheduleDateTime = new Date(req.body.scheduleDateTime);
    const isoDatePattern =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|([+\-]\d{2}:\d{2}))$/;

    if (
      !req.body.scheduleDateTime ||
      !isoDatePattern.test(req.body.scheduleDateTime) ||
      isNaN(scheduleDateTime.getTime())
    ) {
      return res
        .status(422)
        .json(errorResponse(req.__("Invalid scheduleDateTime")));
    }

    next();
  } catch (error) {
    return res.status(500).json(errorResponse(error.message));
  }
};
