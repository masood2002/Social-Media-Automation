import { createDummyPosts } from "./index.js";
import {
  errorResponse,
  successResponse,
} from "../../resources/triggerResources.js";
/**
 * Creates dummy post data based on the specified number and returns a response.
 * @param {Object} req - The request object containing parameters for dummy data creation.
 * @param {Object} res - The response object used to send the JSON response back to the client.
 * @returns {Object} The response object with status and message indicating the success or failure of the operation.
 * @throws {Error} If there is an issue with creating dummy posts or returning the response.
 */
export const dummy = async (req, res) => {
  try {
    const result = await createDummyPosts(req);
    return res
      .status(200)
      .json(
        successResponse(req.__("dummyPostsCreatedSuccessfully"), result.data)
      );
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};
