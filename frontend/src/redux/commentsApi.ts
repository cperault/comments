import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Comment {
  id: number;
  author: string;
  parent: string;
  text: string;
  created_at: string;
  likes: number;
  image?: string;
}

interface CreateCommentRequest {
  author: string;
  parent: string;
  text: string;
  image: string;
}

interface UpdateCommentRequest {
  id: number;
  text: string;
}

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], void>({
      query: () => "comments",
      providesTags: ["Comment"],
    }),
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: (body) => ({
        url: "comments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Comment"],
    }),
    updateComment: builder.mutation<Comment, UpdateCommentRequest>({
      query: ({ id, text }) => ({
        url: `comments/${id}`,
        method: "PUT",
        body: { text },
      }),
      invalidatesTags: ["Comment"],
    }),
    deleteComment: builder.mutation<void, number>({
      query: (id) => ({
        url: `comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const { useGetCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } =
  commentsApi;
