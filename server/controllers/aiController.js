import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Free features

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // Free usage check
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to continue.",
      });
    }

    // Prompt validation
    if (!prompt || prompt.trim().length === 0) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }

    // Clean prompt
    const cleanedPrompt = prompt.trim().slice(0, 2000);

    // Optimized prompt
    const finalPrompt = `
Write a high-quality article.

Requirements:
- Clear headings and subheadings
- Engaging writing style
- Proper conclusion
- Article size: ${length} tokens maximum

Topic:

${cleanedPrompt}
`;

    // Gemini response
    const result = await model.generateContent(finalPrompt);

    const content = result.response.text();

    // Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${cleanedPrompt}, ${content}, 'article')
    `;

    // Update free usage
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    // Response
    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log("Generate Article Error:", error);

    if (error.status === 429) {
      return res.json({
        success: false,
        message: "Gemini API rate limit exceeded. Please wait and try again.",
      });
    }

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // Free usage limit
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit Reached. Upgrade to continue.",
      });
    }

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }

    // Limit prompt size
    const cleanedPrompt = prompt.trim().slice(0, 1000);

    // Generate titles
    const result = await model.generateContent(cleanedPrompt);

    const content = result.response.text();

    // Save to database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${cleanedPrompt}, ${content}, 'blog-title')
    `;

    // Update free usage
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log("Generate Blog Title Error:", error);

    // Gemini quota handling
    if (error.status === 429) {
      return res.json({
        success: false,
        message:
          "Gemini free-tier limit reached. Please wait 1 minute and try again.",
      });
    }

    res.json({
      success: false,
      message: error.message,
    });
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
    const resume = req.file;
    const plan = req.plan;

    // Premium check
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available in Premium Subscription",
      });
    }

    // File validation
    if (!resume) {
      return res.json({
        success: false,
        message: "Resume file is required",
      });
    }

    // File size validation
    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file exceeds allowed size (5MB).",
      });
    }

    // Read PDF
    const dataBuffer = fs.readFileSync(resume.path);

    // Extract text
    let pdfText = "";

    try {
      const parsed = await pdf(dataBuffer);

      pdfText = parsed.text;
    } catch (parseError) {
      console.log("PDF Parse Error:", parseError);

      return res.json({
        success: false,
        message: "Failed to parse PDF file",
      });
    }

    // Clean extracted text
    const cleanedText = pdfText.replace(/\s+/g, " ").trim().slice(0, 5000);

    console.log("Resume text length:", cleanedText.length);

    // Validate text
    if (!cleanedText || cleanedText.length === 0) {
      return res.json({
        success: false,
        message: "No readable text found in resume",
      });
    }

    // Prompt
    const prompt = `
Analyze this resume and provide:

1. Resume Score (out of 10)
2. Strengths
3. Weaknesses
4. Missing Skills
5. ATS Optimization Tips
6. Final Suggestions

Resume:

${cleanedText}
`;

    // Gemini response
    const result = await model.generateContent(prompt);

    const content = result.response.text();

    const displayTitle = `Resume Review Analysis - ${resume.originalname}`;

    // Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${displayTitle}, ${content}, 'resume-review')
    `;

    // Response
    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log("Resume Review Error:", error);

    if (error.status === 429) {
      return res.json({
        success: false,
        message: "Gemini API rate limit exceeded. Please wait and try again.",
      });
    }

    res.json({
      success: false,
      message: error.message,
    });
  }
};
