import axios from "axios";

const fbPosting = async (content, image) => {
  const url = process.env.url;
  const body = {
    url: image,
    caption: content,
    access_token: process.env.access_token,
  };

  try {
    // console.log(body);
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
export { fbPosting };
