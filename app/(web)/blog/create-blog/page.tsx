"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LuArrowRight } from "react-icons/lu";
import { URL_BASE_PRIVATE } from "@/constants";
import { useAuth } from "@/hook/useAuth";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth === false) {
      router.push("/login");
    }
  }, [auth, router]);
  if (loading || auth === false) return <p>Loading profile...</p>;
  const handleNext = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${URL_BASE_PRIVATE}/content/blog/createBlog`,
        { title },
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );

      if (res.data?.status && res.data?.post?.id) {
        const postId = res.data.post.id;
        router.push(`/blog/edit-blog/${postId}`);
      } else {
        console.error("Failed to create post:", res.data);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-5 rounded-xl shadow-md space-y-4">
        <h1 className="text-lg font-medium text-gray-800">Enter the title</h1>

        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
        />

        <button
          onClick={handleNext}
          disabled={loading || !title.trim()}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded"
          style={{ backgroundColor: "#000", color: "#fff", border: "none" }}
        >
          {loading ? "Submitting..." : "Next"}
          <LuArrowRight className="text-sm" />
        </button>
      </div>
    </main>
  );
}
