import { api, HydrateClient } from "@/trpc/server";
import { PostList } from "./_components/post";

export default async function Home() {
  void api.post.list.prefetch({ limit: 50 });

  return (
    <HydrateClient>
      <div className="relative">
        <section className="relative z-10 mx-auto max-w-5xl py-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Latest Posts
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Thoughts, updates, and notes from Little Eleven
              </p>
            </div>
          </div>
          <PostList />
        </section>
      </div>
    </HydrateClient>
  );
}
