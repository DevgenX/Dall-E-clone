const PORT = 8000;
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());

app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/images", async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.message,
      n: 9,
      size: "1024x1024",
    });
    console.log(response.data.data);
    res.send(response.data.data);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => console.log("Server is running on PORT " + PORT));
