import { z } from "zod";
import { da } from 'zod/v4/locales';

export const unpackAllSettled = async <TSchema extends z.ZodTypeAny>(
  result: PromiseSettledResult<Response>,
  schema: TSchema,
): Promise<z.infer<TSchema>> => {
  if (result.status !== "fulfilled") {
    throw result.reason;
  }

  const data = await result.value.json();
  return Array.isArray(data) ? schema.parse(data) : data;
};
