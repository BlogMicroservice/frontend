"use client";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/hook/useAuth";
import { useEffect } from "react";

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export default function EditorClientWrapper() {
  const params = useParams();
  const id = params?.id as string; // safely cast
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth === false) {
      router.push("/login");
    }
  }, [auth, router]);
  if (auth === false) return <p>Loading profile...</p>;
  if (!id) return <div>No access</div>;

  return <Editor id={id} />;
}
