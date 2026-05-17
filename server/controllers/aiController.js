import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { PDFParse } from "pdf-parse";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Free features
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-pro",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: Number(length) || 4000,
    });
    const content = response.choices[0].message.content;
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    if (error.status == 429) {
      return res.json({
        success: false,
        message: "Too many requests. Try again later.",
      });
    }
    console.log(error.status, error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-pro",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    const content = response.choices[0].message.content;
    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.status, error.message);
    res.json({ success: false, message: error.message });
  }
};

// Premium features

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available in Premium Subscription",
      });
    }

    // Using Clipdrop for image generation
    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    // Store Image in cloud storage -> Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64Image, {
      folder: "QuickAI",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.status, error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file; // image will be put in req.file by multer middleware
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available in Premium Subscription",
      });
    }

    if (!image) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Store Image in cloud storage -> Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove Background from image', ${secure_url}, 'image')`;
    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.status, error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file; // image will be put in req.file by multer middleware
    const { object } = req.body;
    // console.log("req.file:", req.file);
    // console.log("req.body:", req.body);
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available in Premium Subscription",
      });
    }

    if (!image) {
      return res.json({ success: false, message: "Image is required" });
    }

    if (!object) {
      return res.json({ success: false, message: "Object name is required" });
    }

    // Store Image in cloud storage -> Cloudinary
    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:prompt_${object}` }],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')`;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.status, error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file; // resume will be put in req.file by multer middleware
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available in Premium Subscription",
      });
    }

    if (!resume) {
      return res.json({ success: false, message: "Resume file is required" });
    }

    if (resume.size > 5 * 1024 * 1024) {
      // greater than 5MB
      return res.json({
        success: false,
        message: "Resume file exceeds allowed size (5MB).",
      });
    }

    // Convert resume file to data buffer using file system
    const dataBuffer = fs.readFileSync(resume.path);
    // Now parse resume to extract text using pdf-parse package
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();

    const prompt = `Review the following resume and provide constructive feedback on its strengths,
    weaknesses, and areas for improvement. Resume Content: \n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-pro",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},${prompt}, ${content}, 'resume-review')`;

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.status, error.message);
    res.json({ success: false, message: error.message });
  }
};
