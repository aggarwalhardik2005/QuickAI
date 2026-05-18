import { Edit, Hash, Sparkles, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuth } from "@clerk/react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Travel",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { getToken } = useAuth();

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      return toast.error("Please enter a keyword");
    }

    try {
      setLoading(true);

      // Clean input
      const cleanInput = input.trim().slice(0, 100);

      const prompt = `
Generate 5 short catchy blog titles.

Keyword: ${cleanInput}
Category: ${selectedCategory}

Requirements:
- Engaging
- SEO-friendly
- Unique
- Numbered list only
`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    // Cooldown to avoid Gemini free-tier throttling
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />
        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item ? "bg-purple-50 text-purple-700" : "text-gray-500 border-gray-300"}`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white py-2 px-4 rounded-lg text-sm mt-6 cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 border-2 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Title
        </button>
      </form>
      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-[#8E37EB]" />
            <h1 className="text-xl font-semibold">Generated Titles</h1>
          </div>
          <div className="relative flex items-center">
            {isCopied && (
              <span className="absolute -top-8 right-0 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-100 whitespace-nowrap z-10 transition-opacity">
                Copied to Clipboard
              </span>
            )}
            <button
              onClick={handleCopy}
              disabled={!content}
              className={`p-2 rounded-md transition-colors ${
                !content
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              }`}
              title="Copy to Clipboard"
            >
              {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {!content ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>
                Enter a topic and click <b>"Generate Title"</b> to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
