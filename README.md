# QuickAI - Intelligent SaaS Platform 🚀

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791.svg)](https://neon.tech/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange.svg)](https://aistudio.google.com/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg)](https://clerk.com/)

QuickAI is a powerful, full-stack AI Software-as-a-Service (SaaS) application that empowers users to supercharge their productivity. Featuring a sleek, modern UI, QuickAI offers a suite of advanced generative AI tools ranging from long-form article writing to automated resume analysis and intelligent image editing.

## ✨ Features

### 📝 Text Generation
*   **Article Writer:** Generate high-quality, structured articles (up to 1200+ words) from a simple prompt.
*   **Blog Titles:** Brainstorm catchy and SEO-optimized blog titles instantly.
*   **Resume Reviewer:** Upload your resume (PDF). The AI parses it, provides a score out of 10, identifies strengths/weaknesses, and offers ATS optimization tips.

### 🖼️ Image Processing
*   **AI Image Generation:** Create stunning visuals from text prompts (Powered by Clipdrop AI).
*   **Background Removal:** Instantly remove backgrounds from uploaded images (Powered by Cloudinary AI).
*   **Object Eraser:** Seamlessly remove specific unwanted objects from any image.

### 💼 SaaS Core Features
*   **Authentication:** Secure, seamless user login and registration powered by Clerk.
*   **Tiered Access:** 
    *   *Free Tier:* Limited to 10 generations with token limits.
    *   *Premium Tier:* Unlocks image processing features, resume reviews, and removes usage limits.
*   **Dashboard History:** Save, view, and copy your past AI creations directly from your dashboard.

---

## 🛠️ Tech Stack

**Frontend:**
*   **React 19** (Vite)
*   **Tailwind CSS** (Responsive, modern styling)
*   **Axios** (API requests)

**Backend:**
*   **Node.js & Express.js** (ES Modules)
*   **Google Generative AI SDK** (Gemini 2.5 Flash)
*   **Multer** (File uploads for PDFs and Images)
*   **PDF-Parse** (Extracting text from PDF resumes)
*   **Cloudinary** (Image storage and AI transformations)

**Database & Auth:**
*   **PostgreSQL** (Hosted on Neon Serverless)
*   **Clerk** (User authentication and webhook management)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   API Keys for Clerk, Gemini, Cloudinary, Neon, and Clipdrop.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/QuickAI.git
cd QuickAI
```

### 2. Install Dependencies

**For the Backend:**
```bash
cd server
npm install
```

**For the Frontend:**
```bash
cd ../client
npm install
```

### 3. Environment Variables
Create a `.env` file in both the `client` and `server` directories.

**`server/.env`**
```env
PORT=3000
DATABASE_URL=your_neon_postgres_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLIPDROP_API_KEY=your_clipdrop_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:3000
```

### 4. Run the Application

**Start the Backend Server:**
```bash
cd server
npm run server
```

**Start the Frontend Client:**
```bash
cd client
npm run dev
```

Your application should now be running locally at `http://localhost:5173`.

---

## ☁️ Deployment

*   **Frontend:** Optimized for deployment on **Vercel** or Netlify.
*   **Backend:** Configured for Vercel Serverless Functions. (Note: `pdf-parse@1.1.1` is specifically used to ensure compatibility with Vercel's serverless Node.js environment).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
