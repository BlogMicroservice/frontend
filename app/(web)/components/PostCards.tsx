"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { URL_BASE_PRIVATE } from "@/constants";
import { useRouter } from "next/navigation";

interface Topic {
  topic: { name: string };
}

interface Author {
  userName: string;
  profileImage: string;
}

interface Post {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  createdAt: string;
  topics: Topic[];
  author?: Author;
}

export default function PostGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${URL_BASE_PRIVATE}/content/blog/searchPosts`, {
        params: { page, limit: 6 },
        withCredentials: true,
      });
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);
  const router=useRouter()
  const goToView=(id:string)=>{
    router.push(`/blog/view-blog/${id}`)
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Blogs</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
            onClick={()=>{goToView(post.id)}}
          >
            <div className="relative h-52 w-full">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-5 h-[250px] flex flex-col">
              <span className="text-[11px] uppercase text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full mb-2 w-fit">
                {post.topics?.[0]?.topic?.name || "General"}
              </span>

              <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.summary}</p>

              <div className="flex items-center gap-3 mt-auto pt-4">
                <Image
                  src={post.author?.profileImage || "/avatar.png"}
                  alt={post.author?.userName || "Author"}
                  width={32}
                  height={32}
                  className="rounded-full w-7 h-7"
                />
                <div className="text-sm text-gray-500">
                  <p className="font-medium text-gray-700">{post.author?.userName || "Unknown"}</p>
                  <p className="text-xs">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
