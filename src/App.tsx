import { type ReactNode, useEffect, useState } from "react";
import { z } from "zod";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import fetchingImg from "./assets/data-fetching.png";
type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();

  useEffect(() => {
    async function fetchData() {
      const rawDataBlogPostSchema = z.object({
        id: z.number(),
        userId: z.number(),
        title: z.string(),
        body: z.string(),
      });

      const data = await get(
        "https://jsonplaceholder.typicode.com/posts",
        z.array(rawDataBlogPostSchema)
      );

      const blogPosts: BlogPost[] = data.map((post) => ({
        id: post.id,
        title: post.title,
        text: post.body,
      }));

      setFetchedPosts(blogPosts);
    }

    fetchData();
  }, []);

  let content: ReactNode;
  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  return (
    <main>
      <img src={fetchingImg} alt="an abstract image" />
      {content}
    </main>
  );
}

export default App;
