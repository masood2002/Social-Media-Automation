import {
  add,
  modify,
  eliminate,
  show,
  getSortedPosts,
  getByDateRange,
} from "../../services/post/index.js";
import { successResponse, errorResponse } from "../../resources/index.js";

/**
 * Creates a new post.
 * @param {Object} req - The request object containing the post data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a success response with the created post data.
 * @throws {Error} If there is an issue with creating the post.
 */
export const create = async (req, res) => {
  try {
    const result = await add(req);
    res
      .status(200)
      .json(successResponse(req.__("postCreatedSuccessfully"), result.data));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Updates an existing post based on the provided ID and data.
 * @param {Object} req - The request object containing the post ID and update data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a success response with the updated post data.
 * @throws {Error} If there is an issue with updating the post.
 */
export const update = async (req, res) => {
  try {
    const result = await modify(req);
    res
      .status(200)
      .json(successResponse(req.__("postUpdatedSuccessfully"), result.data));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Deletes a post based on the provided ID.
 * @param {Object} req - The request object containing the post ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a success response with the deleted post data.
 * @throws {Error} If there is an issue with deleting the post.
 */
export const remove = async (req, res) => {
  try {
    const result = await eliminate(req);
    res
      .status(200)
      .json(successResponse(req.__("postDeletedSuccessfully"), result.data));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Retrieves a post based on the provided ID.
 * @param {Object} req - The request object containing the post ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a success response with the retrieved post data.
 * @throws {Error} If there is an issue with retrieving the post.
 */
export const get = async (req, res) => {
  try {
    const result = await show(req);
    res
      .status(200)
      .json(successResponse(req.__("postFetchedSuccessfully"), result.data));
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

/**
 * Retrieves posts based on filters, with sorting and pagination.
 * @param {Object} req - The request object containing filters and pagination parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a success response with filtered posts and pagination metadata.
 * @throws {Error} If there is an issue with retrieving or filtering posts.
 */
export const filter = async (req, res) => {
  try {
    const result = await getSortedPosts(req);
    return res
      .status(200)
      .json(
        successResponse(
          result.data.length === 0
            ? req.__("postsNotFoundForFilter")
            : req.__("postsFetchedSuccessfully"),
          result.data,
          result.meta
        )
      );
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};

export const applyCalendarFilters = async (req, res) => {
  try {
    const result = await getByDateRange(req);
    return res
      .status(200)
      .json(
        successResponse(
          req.__("calendarFiltersAppliedSuccessfully"),
          result.data,
          result.meta
        )
      );
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};
