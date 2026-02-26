"use client";

import { useParams } from "next/navigation";
import PostForm from "@/components/PostForm";

export default function EditPage() {
  const params = useParams();

  return <PostForm mode="edit" postId={params.id as string} />;
}