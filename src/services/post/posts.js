import { Post } from "../../models/index.js";
import { getTimeRange, getPaginationMeta } from "../trigger/index.js";
/**
 * Adds a new post to the database.
 * @param {Object} req - The request object containing the post data.
 * @returns {Promise<Object>} The response object with the newly created post data.
 * @throws {Error} If there is an issue with saving the post.
 */
export const add = async (req) => {
  try {
    const post = new Post(req.body);
    await post.save();

    return {
      data: post,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Updates an existing post based on the provided ID and data.
 * @param {Object} req - The request object containing the post ID and update data.
 * @returns {Promise<Object>} The response object with the updated post data.
 * @throws {Error} If the post is not found or if there is an issue with updating the post.
 */
export const modify = async (req) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!post) {
      throw new Error(req.__("postNotFound"));
    }

    return {
      data: post,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Deletes a post based on the provided ID.
 * @param {Object} req - The request object containing the post ID.
 * @returns {Promise<Object>} The response object with the deleted post data.
 * @throws {Error} If the post is not found or if there is an issue with deleting the post.
 */
export const eliminate = async (req) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id);

    if (!result) {
      throw new Error(req.__("postNotFound"));
    }

    return {
      data: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Retrieves a post based on the provided ID.
 * @param {Object} req - The request object containing the post ID.
 * @returns {Promise<Object>} The response object with the post data.
 * @throws {Error} If the post is not found or if there is an issue with retrieving the post.
 */
export const show = async (req) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    if (!post) {
      throw new Error(req.__("postNotFound"));
    }

    return {
      data: post,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Retrieves posts based on filters, with sorting and pagination.
 * @param {Object} req - The request object containing filters and pagination parameters.
 * @returns {Promise<Object>} The response object with post data and pagination metadata.
 * @throws {Error} If there is an issue with retrieving or sorting posts.
 */
export const getSortedPosts = async (req) => {
  const filters = req.body.filters || {};

  const { page = 1, limit = 10 } = req.query;
  const currentPage = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (currentPage - 1) * pageSize;

  try {
    const query = {};

    if (filters.scheduleDate) {
      const date = new Date(filters.scheduleDate);
      const startDate = new Date(date.setHours(0, 0, 0, 0));
      const endDate = new Date(date.setHours(23, 59, 59, 999));
      query.scheduleDate = { $gte: startDate, $lte: endDate };
    }

    if (filters.scheduleTime) {
      const [hour, minute, second] = filters.scheduleTime
        .split(":")
        .map(Number);
      query.scheduleTime = {
        $regex: `^${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}:${second.toString().padStart(2, "0")}`,
      };
    }

    // Handle scheduleDateTime filter
    if (filters.scheduleDateTime) {
      const dateTime = new Date(filters.scheduleDateTime);
      const startDateTime = new Date(dateTime.setMilliseconds(0)); // Start of the provided dateTime
      const endDateTime = new Date(dateTime.getTime() + 1000); // 1 second later to include the exact second
      query.scheduleDateTime = { $gte: startDateTime, $lt: endDateTime };
    }

    Object.keys(filters).forEach((key) => {
      if (!["scheduleDate", "scheduleTime", "scheduleDateTime"].includes(key)) {
        query[key] = filters[key];
      }
    });

    const totalCount = await Post.countDocuments(query);

    const posts = await Post.find(query).skip(skip).limit(pageSize).exec();

    return {
      data: posts,
      meta: getPaginationMeta(totalCount, currentPage, pageSize),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getByDateRange = async (req) => {
  const { timeFrame } = req.params;
  const { year, month, week, date, quarter } = req.body;
  const filters = req.body.filters || {};

  const { page = 1, limit = 10 } = req.query;
  const currentPage = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (currentPage - 1) * pageSize;

  const dateParams = { year, month, week, date, quarter };
  const { startDate, endDate } = getTimeRange(timeFrame, dateParams);

  try {
    const query = {
      scheduleDateTime: { $gte: startDate, $lte: endDate },
      ...(filters.dataType && { dataType: { $in: filters.dataType } }),
      ...(filters.status && { status: { $in: filters.status } }),
      ...(filters.networks && { networks: { $in: filters.networks } }),
      ...(filters.channels && { channels: { $in: filters.channels } }),
      ...(filters.targetId && { targetId: { $in: filters.targetId } }),
    };

    const totalCount = await Post.countDocuments(query);

    const posts = await Post.find(query).skip(skip).limit(pageSize).exec();

    const groupedPosts = {};
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split("T")[0];
      groupedPosts[dateKey] = [];
      currentDate.setDate(currentDate.getDate() + 1);
    }

    posts.forEach((post) => {
      const dateKey = post.scheduleDateTime.toISOString().split("T")[0];
      if (groupedPosts[dateKey]) {
        groupedPosts[dateKey].push(post);
      }
    });

    return {
      data: groupedPosts,
      meta: getPaginationMeta(totalCount, currentPage, pageSize),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
