import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import type { MulterError } from "multer";
import type { Express, Request as MulterRequest, NextFunction } from "express";
import fs from "fs";

import multer from "multer";
const PORT: number = 8000;
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

const API_KEY: string = process.env.OPENAI_API_KEY || "";

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    //save file on public folder
    cb(null, "public");
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage to create a File object
  limits: { fileSize: 1000000 }, // Limit the file size to 1MB
});

let filePath: string;

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send("No file uploaded");
      }

      // Create a new File object from the ReadStream object
      const imageFile = new File([file.buffer], file.originalname, {
        type: file.mimetype,
      });

      const response = await openai.createImageVariation(
        imageFile,
        2,
        "1024x1024"
      );
      res.send(response.data.data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
  }
);

app.post("/variations", async (req: Request, res: Response) => {
  try {
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const readStream = fs.createReadStream(filePath, { encoding: "utf-8" });
      readStream.on("data", (chunk: string) => {
        chunks.push(Buffer.from(chunk, "utf-8"));
      });

      readStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readStream.on("error", (error) => {
        reject(error);
      });
    });

    const imageFile = new File([fileBuffer], "filename");

    const response = await openai.createImageVariation(
      imageFile,
      2,
      "1024x1024"
    );
    res.send(response.data.data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/images", async (req: Request, res: Response) => {
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
