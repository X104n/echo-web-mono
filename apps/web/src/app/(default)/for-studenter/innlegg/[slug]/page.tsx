import { cache, Suspense } from "react";
import { notFound } from "next/navigation";

import { Authors } from "@/components/authors";
import { CommentSection } from "@/components/comments/comment-section";
import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { fetchPostBySlug } from "@/sanity/posts";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const getData = cache(async (slug: string) => {
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  return post;
});

export const generateMetadata = async (props: Props) => {
  const params = await props.params;
  const post = await getData(params.slug);

  const authors = post.authors?.map((author) => {
    return {
      name: author.name,
    };
  });

  const authorListString = authors?.map((a) => a.name).join(", ");

  return {
    title: post.title,
    description: `Nytt innlegg "${post.title}" av ${authorListString}.`,
    authors,
  };
};

export default async function PostPage(props: Props) {
  const params = await props.params;
  const post = await getData(params.slug);

  return (
    <Container className="space-y-8 py-10">
      <Heading>{post.title}</Heading>
      <Authors authors={post.authors} />
      <Markdown content={post.body} />
      <Suspense fallback={null}>
        <CommentSection id={`post_${post._id}`} />
      </Suspense>
    </Container>
  );
}
