import axios from "axios";

const igPosting = async (content, imageUrl) => {
  console.log(process.env.accessToken);
  const getInstagramAccountId = async (pageId, accessToken) => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v20.0/${pageId}`,
        {
          params: {
            fields: "instagram_business_account",
            access_token: accessToken,
          },
        }
      );

      const instagramAccountId = response.data.instagram_business_account.id;

      return instagramAccountId;
    } catch (error) {
      console.error(
        "Error fetching Instagram Account ID:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };
  const addInstagramPost = async (instagramUserId, accessToken) => {
    const image = imageUrl;

    const caption = content;
    try {
      const mediaResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${instagramUserId}/media`,
        {
          image_url: image,
          caption: caption,
          access_token: accessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const creationId = mediaResponse.data.id;

      const publishResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${instagramUserId}/media_publish`,
        {
          creation_id: creationId,
          access_token: accessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Posted on Instagram");
      return;
    } catch (error) {
      console.error(
        "Error uploading to Instagram:",
        error.response ? error.response.data : error.message
      );
      throw new Error(error.message);
    }
  };

  // Example usage
  const pageId = process.env.pageId; // Replace with your Facebook Page ID
  const accessToken = process.env.access_token;
  const instaId = await getInstagramAccountId(pageId, accessToken);

  await addInstagramPost(instaId, accessToken);
};

export { igPosting };
