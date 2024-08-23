import { faker } from "@faker-js/faker";
import { factory } from "factory-girl";
import { Post } from "../../models/index.js";

// Define the array of valid post actions
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

// Define the Post factory
factory.define("post", Post, {
  dataType: () => faker.helpers.arrayElement(["match", "player", "official"]),
  targetId: () => faker.string.uuid(),
  action: () => faker.helpers.arrayElement(postActions), // Select one action from the array
  networks: () => faker.helpers.arrayElements(["email", "social-media"], 1),
  channels: () => faker.helpers.arrayElements(["facebook", "instagram"], 2),
  status: () => "not-sent",
  content: () => faker.lorem.paragraph(),
  image: {
    url: () => faker.image.url(),
  },
  scheduleDate: () => new Date(),
  scheduleTime: () => new Date().toTimeString().split(" ")[0], // HH:mm:ss format
  scheduleDateTime: () => new Date(),
});

/**
 * Create dummy posts based on the number provided in the API request.
 * The posts are scheduled starting from the current time plus a specified number of minutes,
 * with each subsequent post having a random delay between 6 and 7 seconds.
 *
 * @param {Object} req - The request object containing the number of posts and minutes ahead.
 * @returns {Object} - The result containing the created posts.
 */
export const createDummyPosts = async (req) => {
  try {
    // Validate the count and minutesAhead
    const count = parseInt(req.params.number, 10);
    const minutesAhead = parseInt(req.params.minutesAhead, 10);

    if (isNaN(count) || count <= 0) throw new Error("Invalid number format");
    if (isNaN(minutesAhead) || minutesAhead < 0)
      throw new Error("Invalid minutesAhead format");

    // Clear existing posts
    await Post.deleteMany({});

    const result = [];
    const now = new Date();

    // Function to generate posts with random delays
    const generatePosts = async (numPosts, startMinutesAhead) => {
      let createdPosts = 0;

      while (createdPosts < numPosts) {
        // Calculate the start time for the current batch
        const startBatchTime = new Date(now);
        startBatchTime.setMinutes(
          now.getMinutes() +
            startMinutesAhead +
            Math.floor(createdPosts / numPosts) * 2
        );

        const promises = [];

        for (let i = 0; i < numPosts - createdPosts; i++) {
          // Calculate schedule time with random delay
          const scheduleTime = new Date(startBatchTime);
          const randomDelay =
            Math.floor(Math.random() * (7000 - 6000 + 1)) + 6000; // Random delay between 6 and 7 seconds
          scheduleTime.setSeconds(
            scheduleTime.getSeconds() +
              i * ((2 * 60) / numPosts) +
              randomDelay / 1000
          );

          // Build and save post
          const dummyPost = await factory.build("post", {
            scheduleDate: scheduleTime,
            scheduleTime: scheduleTime.toTimeString().split(" ")[0], // HH:mm:ss format
            scheduleDateTime: scheduleTime,
          });

          // Save the post
          promises.push(dummyPost.save());
        }

        // Wait for all posts in the batch to be saved
        await Promise.all(promises);

        result.push(...(await Promise.all(promises)));
        createdPosts += numPosts - createdPosts;
      }
    };

    // Generate posts starting from the specified minutes ahead
    await generatePosts(count, minutesAhead);

    return {
      data: result,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
