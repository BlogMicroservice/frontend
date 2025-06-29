"use client";

import { useAuth } from "@/hook/useAuth";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { URL_BASE_PRIVATE } from "@/constants";
import { FaRegHeart, FaHeart, FaShareAlt } from "react-icons/fa";
import Image from "next/image";

interface Topic {
  id: string;
  name: string;
}

interface PostTopic {
  postId: string;
  topicId: string;
  topic: Topic;
}

interface Post {
  id: string;
  userId: string;
  title: string;
  summary?: string;
  content: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  topics: PostTopic[];
  _count: {
    likes: number;
  };
}

interface Author {
  userName: string;
  profileImage: string;
  bio: string;
}

interface BlogResponse {
  status: boolean;
  post: Post;
  author: {
    status: boolean;
    message: string;
    data: Author;
  } | null;
  isLiked: boolean;
}

export default function EditorViewer() {
  const auth = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [html, setHtml] = useState<string>("");
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    if (auth === false) {
      router.push("/login");
    }
  }, [auth, router]);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await axios.get<BlogResponse>(
          `${URL_BASE_PRIVATE}/content/blog/getBlog/${id}`,
          { withCredentials: true }
        );

        if (res.data.status && res.data.post) {
          setPost(res.data.post);
          setHtml(res.data.post.content);
          setLikeCount(res.data.post._count.likes);
          setIsLiked(res.data.isLiked);
          setAuthor(res.data.author?.data || null);
        }
      } catch (error) {
        console.error("Failed to fetch blog content:", error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await axios.post<{ status: boolean; liked: boolean }>(
        `${URL_BASE_PRIVATE}/content/blog/toggleLike/${id}`,
        {},
        { withCredentials: true }
      );

      if (res.data?.status) {
        setIsLiked(res.data.liked);
        setLikeCount((prev) => prev + (res.data.liked ? 1 : -1));
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Post URL copied to clipboard!");
  };

  if (!post) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-gray-500 text-sm">
            Published on {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {post.topics.map((t) => (
              <span
                key={t.topic.id}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >
                #{t.topic.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleLike}
            className="text-red-500 flex items-center gap-1 hover:scale-110 transition"
          >
            {isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
            <span className="text-sm">{likeCount}</span>
          </button>
          <button
            onClick={handleShare}
            className="text-gray-600 flex items-center gap-1 hover:scale-110 transition"
          >
            <FaShareAlt size={18} />
            <span className="text-sm">Copy</span>
          </button>
        </div>
      </div>

      {/* Author */}
      {author && (
        <div className="flex items-center gap-3 border-b pb-4">
          <Image
            src={author.profileImage}
            alt={author.userName}
            width={40}
            height={40}
            className="rounded-full object-cover object-center w-18 h-18"
          />
          <div>
            <p className="font-medium">{author.userName}</p>
            <p className="text-sm text-gray-500">{author.bio}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className="ProseMirror prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
