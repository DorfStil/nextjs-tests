import { unpackAllSettled } from "~/lib/unpackAllSettled";
import { BASE_URL } from "./config";
import { z } from "zod";

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

export default async function Home() {
  const [reviewsResult] = await Promise.allSettled([fetch(BASE_URL + "/reviews")]);

  const reviews = await unpackAllSettled(reviewsResult, reviewsResponseSchema);

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl mb-4">Отзывы</h2>
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
