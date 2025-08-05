"use client";

import { useMemo } from "react";

import { api } from "@/trpc/react";

export function PostList() {
  const [data] = api.post.list.useSuspenseQuery({ limit: 50 });
  const posts = useMemo(() => {
    return data ?? [];
  }, [data]);

  const formatted = useMemo(
    () =>
      posts.map((p) => ({
        id: p.id,
        title: p.name,
        date: new Date(p.createdAt).toLocaleDateString(),
      })),
    [posts],
  );

  return (
    <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
      {formatted.map((post) => (
        <article
          key={post.id}
          className="group relative overflow-hidden rounded-2xl border bg-white/60 p-5 shadow-sm backdrop-blur transition-all hover:shadow-md dark:border-white/10 dark:bg-white/5"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 transition-opacity group-hover:opacity-100 dark:to-white/5" />
          <h3 className="text-lg font-semibold tracking-tight">{post.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm">{post.date}</p>
        </article>
      ))}
      {formatted.length === 0 && (
        <div className="text-muted-foreground col-span-full rounded-xl border p-8 text-center text-sm dark:border-white/10">
          No posts yet.
        </div>
      )}
    </div>
  );
}
