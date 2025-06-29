"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { URL_BASE_PRIVATE } from "@/constants";

type Topic = {
  name: string;
};

export default function TrendingTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const res = await axios.get(`${URL_BASE_PRIVATE}/content/blog/getTopic`, {
          withCredentials: true,
        });
        setTopics(res.data.topics || []);
      } catch (error) {
        console.error("Failed to fetch trending topics", error);
      }
    };

    fetchTrendingTopics();
  }, []);

  return (
    <div className="bg-neutral-100 rounded-xl px-6 py-4 mt-10 mx-auto max-w-7xl">
      <h2 className="text-lg font-semibold text-neutral-800 mb-3">Trending Topics</h2>
      <div className="flex flex-wrap gap-3">
        {topics.map((topic, i) => (
          <div
            key={i}
            className="bg-white hover:bg-neutral-200 text-neutral-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm cursor-pointer transition"
          >
            {topic.name}
          </div>
        ))}
      </div>
    </div>
  );
}
