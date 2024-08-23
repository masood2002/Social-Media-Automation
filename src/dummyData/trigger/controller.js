import { dummyCreation } from "../../dummyData/trigger/index.js";
import {
  errorResponse,
  successResponse,
} from "../../resources/triggerResources.js";
/**
 * Handles the request to create dummy data for testing purposes.
 * @param {Object} req - The request object containing dummy data creation parameters.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The response object with a success message and the created dummy data.
 */
export const dummy = async (req, res) => {
  try {
    const result = await dummyCreation(req);
    return res
      .status(200)
      .json(
        successResponse(req.__("dummyDataCreatedSuccessfully"), result.data)
      );
  } catch (error) {
    return res.status(422).json(errorResponse(error.message));
  }
};
