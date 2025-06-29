"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { URL_BASE_PRIVATE } from "@/constants";

interface CardData {
  title: string;
  desc: string;
  topic: string;
  img: string;
  author: string;
  authorImg: string;
  date: string;
}

export default function Landing() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await axios.get(`${URL_BASE_PRIVATE}/content/blog/LandingPageBlog`, {
          withCredentials: true,
        });

        const posts = res.data.posts?.slice(0, 2) || [];

        const parsed = posts.map((post: any) => ({
          title: post.title,
          desc: post.summary || "",
          topic: post.topics[0]?.topic?.name || "General",
          img: post.thumbnailUrl || "/placeholder.jpg",
          author: post.author?.userName || "Unknown",
          authorImg: post.author?.profileImage || "/avatar.png",
          date: new Date(post.createdAt).toLocaleDateString(),
        }));

        setCards(parsed);
      } catch (err) {
        console.error("Error fetching landing data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (cards.length === 0) return <div className="text-center py-20 text-gray-500">No posts found</div>;

  return (
    <div className="w-screen h-[90vh] overflow-x-hidden px-6 py-10 flex justify-center items-center gap-6 font-sans">
      {cards.map((card, i) => (
        <div
          key={i}
          className="relative h-[80vh] rounded-2xl overflow-hidden shadow-xl"
          style={{ width: "calc(50vw - 100px)" }}
        >
          <Image
            src={card.img}
            alt={card.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full w-fit mb-3 uppercase tracking-wide">
              {card.topic}
            </span>
            <h2 className="text-3xl font-bold mb-2">{card.title}</h2>
            <p
              className="text-sm text-gray-200 mb-3 overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {card.desc}
            </p>
            <div className="flex items-center gap-3">
              <Image
                src={card.authorImg}
                alt={card.author}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="text-xs text-gray-300 leading-tight">
                <p>{card.author}</p>
                <p className="text-[10px] text-gray-400">{card.date}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
