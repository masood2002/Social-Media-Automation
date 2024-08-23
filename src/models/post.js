import mongoose from "mongoose";
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    dataType: {
      type: String,
      enum: ["match", "player", "official"],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    networks: {
      type: [String],
      required: true,
    },
    channels: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "not-sent"],
      default: "not-sent",
    },
    content: {
      type: String,
      required: true,
    },

    image: {
      url: {
        type: String,
        required: true,
      },
    },

    scheduleDate: {
      type: Date,
      required: true,
    },
    scheduleTime: {
      type: String, // Using string to store time in HH:mm:ss format
      required: true,
    },
    scheduleDateTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", PostSchema);
export { Post };
