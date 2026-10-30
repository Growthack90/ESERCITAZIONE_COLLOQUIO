import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type{ BooksApiResponse } from "../types/books";

interface GetBooksQueryParams {
  query: string;
  startIndex: number;
  maxResults: number;
}

export const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.googleapis.com/books/v1/",
  }),
  endpoints: (builder) => ({
    getBooks: builder.query<BooksApiResponse, GetBooksQueryParams>({
      query: ({ query, startIndex, maxResults }) => ({
        url: "volumes",
        params: {
          q: query,
          startIndex,
          maxResults,
        },
      }),
      // Evita di inviare richieste vuote
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetBooksQuery } = booksApi;
