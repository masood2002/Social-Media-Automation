import mongoose from "mongoose";
const Url =
  "mongodb+srv://mainbilal342gcu:2p2oMLgq7HaxKTEn@cluster0.kbzxykn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const dbCon = async () => {
  try {
    await mongoose.connect(Url);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    console.log("connection fail");
  }
};
