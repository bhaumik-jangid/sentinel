"use client";

import { useParams } from "next/navigation";
import PostForm from "@/components/PostForm";

export default function EditPage() {
  const { id } = useParams();
  return <PostForm mode="edit" postId={id as string} />;
}