import axios from "axios";

const API_KEY = "b63a97eb71494ee0816644c4acb93624";

export const getTravelSpots = async () => {
  try {
    const res = await axios.get(
      "https://api.geoapify.com/v2/places",
      {
        params: {
          categories: "tourism.attraction",
          filter: "circle:126.9780,37.5665,5000",
          limit: 10,
          apiKey: API_KEY,
        },
      }
    );

    return res.data.features;

  } catch (err) {
    console.log(err);
    return [];
  }
};
