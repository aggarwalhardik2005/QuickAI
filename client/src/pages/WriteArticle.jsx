import { Edit, Sparkle, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articlelength = [
    { length: 500, text: "Short (500-800 words)" },
    { length: 800, text: "Medium (800-1200 words)" },
    { length: 1200, text: "Long (1200+ words)" },
  ];

  const [selectedlength, setSelectedLength] = useState(articlelength[0]);
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
      return toast.error("Please enter an article topic");
    }

    try {
      setLoading(true);

      const cleanInput = input.trim().slice(0, 150);

      const prompt = `
Write a well-structured article about "${cleanInput}".

Requirements:
- ${selectedlength.text}
- Use headings and subheadings
- Keep the content clear and engaging
- End with a proper conclusion
`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        {
          prompt,
          length: selectedlength.length,
        },
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
      toast.error(error.message);
    }

    // Cooldown to avoid rapid requests
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkle className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Cofiguration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />
        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articlelength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedlength.text === item.text ? "bg-blue-50 text-blue-700" : "text-gray-500 border-gray-300"}`}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white py-2 px-4 rounded-lg text-sm mt-6 cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Article
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Edit className="w-5 h-5 text-[#4A7AFF]" />
            <h1 className="text-xl font-semibold">Generated Article</h1>
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
              <Edit className="w-9 h-9" />
              <p>
                Enter a topic and click <b>"Generate Article"</b> to get started
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

export default WriteArticle;
