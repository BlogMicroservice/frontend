"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { URL_BASE_PRIVATE } from "@/constants";
import { useAuth } from "@/hook/useAuth";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const [summary, setSummary] = useState("");
  const [topics, setTopics] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth === false) {
      router.push("/login");
    }
  }, [auth, router]);

  if (auth === false) return <p>Loading profile...</p>;

  const handleGenerateSummary = async () => {
    try {
      setLoadingGenerate(true);
      const res = await axios.post(
        `${URL_BASE_PRIVATE}/content/AI/generateSummary`,
        { content },
        {
          withCredentials: true,
        }
      );
      setSummary(res.data.summary);
    } catch (err: unknown) {
      console.log(err);
      setError("Failed to generate summary.");
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handlePublish = async () => {
    if (!summary.trim() || !topics.trim() || !thumbnail) {
      setError("All fields are required, including the thumbnail image.");
      return;
    }

    const topicArray = topics.split(",").map((t) => t.trim());

    const formData = new FormData();
    formData.append("postId", id);
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("topics", JSON.stringify(topicArray));
    formData.append("image", thumbnail);

    try {
      const res = await axios.post(
        `${URL_BASE_PRIVATE}/content/blog/publishPost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Published:", res.data);
      router.push("/profile");
      // Optionally redirect or show success
    } catch (err) {
      console.error(err);
      setError("Failed to publish the post.");
    }
  };

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${URL_BASE_PRIVATE}/content/blog/getEditBlog/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.status) {
          const postData = res.data.post;
          setTitle(postData.title || "");
          setContent(postData.content || "");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch post:", err);
      });
  }, [id]);

  const handleImageChange = (file: File | null) => {
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Publish Post</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-1">
        <Label>Title</Label>
        <p className="font-semibold text-primary">{title}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Summary</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={loadingGenerate}
            className="flex gap-1 items-center"
          >
            <Sparkles className="w-4 h-4" />
            {loadingGenerate ? "Generating..." : "AI Summary"}
          </Button>
        </div>
        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write or generate a summary..."
        />
      </div>

      <div className="space-y-2">
        <Label>Topics (comma-separated)</Label>
        <Input value={topics} onChange={(e) => setTopics(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Thumbnail Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
        />
        {thumbnailPreview && (
          <Image
            width={300}
            height={300}
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="mt-2 w-40 h-auto rounded-md shadow"
          />
        )}
      </div>

      <Button type="button" onClick={handlePublish}>
        Publish
      </Button>

      <p className="text-sm text-muted-foreground">Page ID: {id}</p>
    </div>
  );
}
