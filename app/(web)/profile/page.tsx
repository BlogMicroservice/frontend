"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/useAuth";
import axios from "axios";
import { URL_BASE_PRIVATE } from "@/constants";

const defaultImg =
  "https://lh3.googleusercontent.com/a/ACg8ocIUESr3Fo6fU7ROnjgFJv1CMQhAD-YUTWKyR-gCcJHJ9oCUIpAKJA=s96-c";

interface Blog {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  topics: string[];
  likeCount: number;
  published: boolean;
}

export default function ProfilePage() {
  const auth = useAuth();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bio, setBio] = useState("");
  const [newBio, setNewBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [email, setEmail] = useState("");
  const [profileImg, setProfileImg] = useState(defaultImg);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (auth === false) router.push("/login");
  }, [auth, router]);

  useEffect(() => {
    if (auth !== true) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${URL_BASE_PRIVATE}/user/getUserProfile`, {
          withCredentials: true,
        });

        const data = res.data.data;
        setBio(data.bio || "");
        setNewBio(data.bio || "");
        setProfileImg(data.profileImage || defaultImg);
        setName(data.userName || "");
        setEmail(data.email || "");

        const blogRes = await axios.get(
          `${URL_BASE_PRIVATE}/content/blog/getUserBlog`,
          { withCredentials: true }
        );

        const posts: Blog[] = blogRes.data;
        setBlogs(posts);
      } catch (error) {
        console.error("Error fetching profile or blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [auth]);

  if (loading || auth === false) return <p>Loading profile...</p>;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setProfileImg(blobUrl);

    const formData = new FormData();
    formData.append("image", file);

    await axios.post(`${URL_BASE_PRIVATE}/user/updateProfileImage`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleSaveBio = async () => {
    try {
      setBio(newBio);
      setEditingBio(false);
      await axios.put(
        `${URL_BASE_PRIVATE}/user/updateBio`,
        { bio: newBio },
        { withCredentials: true }
      );
    } catch {
      setBio(bio);
      setEditingBio(true);
    }
  };

  const goToPost = (id: string, isPublished: boolean) => {
    router.push(`/blog/${isPublished ? "view" : "edit"}-blog/${id}`);
  };

  const published = blogs.filter((b) => b.published);
  const drafts = blogs.filter((b) => !b.published);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 overflow-x-hidden">
      <h1 className="text-2xl font-semibold mb-8 text-neutral-800">Profile</h1>
      <div className="flex gap-6 items-start mb-10">
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image
            src={profileImg?.length>=0?profileImg:defaultImg}
            alt="Profile"
            width={112}
            height={112}
            className="rounded-full object-cover object-center h-28 w-28"
          />
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium">
            Edit
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="space-y-1 text-sm text-neutral-700 w-full max-w-lg">
          <p className="text-base font-medium text-neutral-900">Hi, {name}</p>
          <p>{email}</p>
          {editingBio ? (
            <>
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                rows={3}
                className="w-full border rounded-lg p-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveBio}
                  className="px-4 py-1 bg-neutral-800 text-white text-sm rounded hover:bg-black transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingBio(false);
                    setNewBio(bio);
                  }}
                  className="text-sm text-neutral-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-neutral-600 mt-1">
                {bio || "Add a bio to your profile."}
              </p>
              <button
                onClick={() => setEditingBio(true)}
                className="text-sm text-neutral-500 hover:underline mt-1"
              >
                Edit Bio
              </button>
            </>
          )}
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Published Blogs
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {published.length > 0 ? (
            published.map((post) => (
              <div
                key={post.id}
                onClick={() => goToPost(post.id, true)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={post?.thumbnailUrl?.length>=0?post.thumbnailUrl:defaultImg}
                    alt={post.title}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between h-[240px]">
                  <span className="text-[11px] uppercase text-indigo-600 font-semibold tracking-wide bg-indigo-100 px-2 py-1 rounded-full w-fit mb-2">
                    {post.topics.join(", ")}
                  </span>
                  <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 col-span-full">
              No published blogs yet.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Drafts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.length > 0 ? (
            drafts.map((post) => (
              <div
                key={post.id}
                onClick={() => goToPost(post.id, false)}
                className="bg-white border border-dashed border-gray-300 rounded-2xl p-4 opacity-80 cursor-pointer"
              >
                <div className="relative h-40 w-full mb-3 rounded overflow-hidden">
                  <Image
                    src={post?.thumbnailUrl?.length>=0?post.thumbnailUrl:defaultImg}
                    alt={post.title}
                    fill
                    sizes="100vw"
                    className="object-cover grayscale"
                  />
                </div>
                <span className="text-[11px] uppercase text-yellow-600 font-semibold tracking-wide bg-yellow-100 px-2 py-1 rounded-full w-fit mb-2">
                  {post.topics.join(", ")}
                </span>
                <h3 className="text-base font-semibold text-gray-700 line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {post.summary}
                </p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 col-span-full">
              No drafts available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
