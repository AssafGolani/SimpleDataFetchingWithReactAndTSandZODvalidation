import { type ReactNode, useEffect, useState } from "react";
import { z } from "zod";
import { get } from "./util/http";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import fetchingImg from "./assets/data-fetching.png";
import ErrorMessage from "./components/ErrorMessage";
type RawDataBlogPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      const rawDataBlogPostSchema = z.object({
        id: z.number(),
        userId: z.number(),
        title: z.string(),
        body: z.string(),
      });
      try {
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
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        setError("An error occurred");
      }
      setIsFetching(false);
    }

    fetchData();
  }, []);

  let content: ReactNode;
  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  if (isFetching) {
    content = <p id="loading-fallback">Loading...</p>;
  }

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  return (
    <main>
      <img src={fetchingImg} alt="an abstract image" />
      {content}
    </main>
  );
}

export default App;
