"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { URL_BASE_PRIVATE } from "@/constants";
import { useAuth } from "@/hook/useAuth";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  img: string;
  title: string;
  topic: string;
  desc: string;
  author: string;
  authorImg: string;
  date: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (auth === false) router.push("/login");
  }, [auth, router]);
    const goToView=(id:string)=>{
    router.push(`/blog/view-blog/${id}`)
  }
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${URL_BASE_PRIVATE}/content/blog/searchPosts`,
        {
          params: {
            search: query,
            page,
            limit: 6,
          },
          withCredentials: true,
        }
      );

      const mapped = res.data.posts.map((p: any) => ({
        id: p.id,
        img: p.thumbnailUrl || "/placeholder.jpg",
        title: p.title,
        topic: p.topics?.[0]?.topic?.name || "General",
        desc: p.summary || "",
        author: p.author?.userName || "Unknown",
        authorImg: p.author?.profileImage || "/avatar.png",
        date: new Date(p.createdAt).toLocaleDateString(),
      }));

      setPosts(mapped);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPosts();
    }, 400); // debounce

    return () => clearTimeout(delay);
  }, [query, page]);

  const handlePrev = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const handleNext = () => {
    setPage((p) => Math.min(p + 1, totalPages));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6 text-neutral-800">
        Search Posts
      </h1>

      <Input
        placeholder="Search by title or topic..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1); // Reset to page 1 on new search
        }}
        className="mb-8"
      />

      {loading ? (
        <p className="text-sm text-gray-400">Searching...</p>
      ) : posts.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={()=>{
                  goToView(post.id)
                }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 flex flex-col justify-between h-[240px]">
                  <span className="text-[11px] uppercase text-indigo-600 font-semibold tracking-wide bg-indigo-100 px-2 py-1 rounded-full w-fit mb-2">
                    {post.topic}
                  </span>

                  <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {post.desc}
                  </p>

                  <div className="flex items-center gap-3 mt-auto">
                    <Image
                      src={post.authorImg}
                      alt={post.author}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="text-sm text-gray-500">
                      <p className="font-medium text-gray-700">{post.author}</p>
                      <p className="text-xs">{post.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">No matching posts found.</p>
      )}
    </div>
  );
}
