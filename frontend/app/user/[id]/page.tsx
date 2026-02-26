"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import { motion } from "framer-motion";

export default function UserProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // Fetch user
        fetch(`http://localhost:5000/api/users/${id}`)
            .then((res) => res.json())
            .then((data) => setUser(data));

        // ✅ Updated to match new route: /api/users/:id/posts
        fetch(`http://localhost:5000/api/users/${id}/posts`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error("Unexpected posts response:", data);
                    setPosts([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setPosts([]);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                User not found
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 px-6 py-20">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* Profile Card */}
                <div className="flex justify-center">
                    <ProfileCard user={user} />
                </div>

                {/* User Posts */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-8">
                        Posts by {user.name}
                    </h3>

                    {posts.length === 0 && (
                        <p className="text-gray-500">No posts yet.</p>
                    )}

                    <div className="space-y-8">
                        {posts.map((post) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6"
                            >
                                <div className="text-gray-900 text-lg font-medium mb-3">
                                    {post.title}
                                </div>

                                {post.image && (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="rounded-xl w-full max-h-64 object-cover mb-4"
                                    />
                                )}

                                <div className="text-gray-500 mb-4">
                                    {post.content}
                                </div>

                                <div className="text-sm text-gray-400">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}