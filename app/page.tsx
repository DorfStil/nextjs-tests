import { unpackAllSettled } from "~/lib/unpackAllSettled";
import { z } from "zod";
import Filters from "~/components/filters";
import { apiFetch } from "~/lib/api-fetch";

const reviewSchema = z.object({
  _id: z.string(),
  name: z.string(),
  title: z.string(),
  description: z.string(),
  rating: z.number(),
  productId: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  __v: z.number(),
});

const reviewsResponseSchema = z.array(reviewSchema);

export default async function Home({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const [reviewsResult] = await Promise.allSettled([
    apiFetch("/reviews", {params: sp}),
  ]);

  const reviews = await unpackAllSettled(reviewsResult, reviewsResponseSchema);

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl mb-4">Отзывы</h2>
        <Filters />
        <ul>
          {reviews.map((review) => (
            <li key={review._id} className="bg-gray-500 rounded-md p-2 mb-2">
              <p>Имя: {review.name}</p>
              <p>Заголовок: {review.title}</p>
              <p>Описание: {review.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
