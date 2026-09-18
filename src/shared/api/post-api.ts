import { BaseQueryFn, createApi, EndpointBuilder } from '@reduxjs/toolkit/query/react';

import { IComment, IPost, TChipData } from '../types';

import { instance } from './api';
import { CountResponseType, GenericResponseType } from './api-types';
import customFetchBase from './custom-fetch-base';

const baseUrl = 'posts';
export const postAPI = {
  getPopularTags() {
    return instance.get<GenericResponseType<TChipData[]>>(`tags/tags`).then((response) => {
      return response.data;
    });
  },

  getPopularAuthors() {
    return instance.get<GenericResponseType<TChipData[]>>(`tags/authors`).then((response) => {
      return response.data;
    });
  },

  markPostFavorite(postId: string) {
    return instance.put<GenericResponseType<void>>(`${baseUrl}/${postId}/like`).then((response) => {
      return response.data;
    });
  },

  toggleRating(postId: string, rating: number) {
    return instance
      .put<GenericResponseType<void>>(`${baseUrl}/${postId}/rating?rating=${rating}`)
      .then((response) => {
        return response.data;
      });
  },

  getPopular() {
    return instance.get<GenericResponseType<IPost[]>>(`${baseUrl}/popular`).then((response) => {
      return response.data;
    });
  },

  getRecommendationPost(originPostId: string) {
    return instance
      .get<GenericResponseType<IPost[]>>(`${baseUrl}/recommendations?postId=${originPostId}`)
      .then((response) => {
        return response.data;
      });
  },

  getOne(postId: string) {
    return instance.get<GenericResponseType<IPost>>(`${baseUrl}/${postId}`).then((response) => {
      return response.data;
    });
  },

  createPost(data: FormData) {
    return instance
      .post<GenericResponseType<IPost>>(`${baseUrl}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        return response.data;
      });
  },

  updatePost(data: FormData, id: string) {
    return instance
      .put<GenericResponseType<void>>(`${baseUrl}/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        return response.data;
      });
  },

  deletePost(postId: string) {
    return instance.delete<GenericResponseType<void>>(`${baseUrl}/${postId}`).then((response) => {
      return response.data;
    });
  },

  createPostComment(comment: IComment, postId: string) {
    return instance
      .post<GenericResponseType<IPost>>(`${baseUrl}/${postId}/comment`, comment)
      .then((response) => {
        return response.data;
      });
  },

  toggleCommentRating(commentId: string, rating: number) {
    return instance
      .put<GenericResponseType<void>>(`${baseUrl}/${commentId}/comment-rating?rating=${rating}`)
      .then((response) => {
        return response.data;
      });
  },

  getUserPostComments(userId: string) {
    return instance
      .get<GenericResponseType<IPost[]>>(`${baseUrl}/post-comments?userId=${userId}`)
      .then((response) => {
        return response.data;
      });
  },
};
export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: customFetchBase('/posts'),
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getAllArticles: build.query<CountResponseType<IPost[]>, { searchParams: string }>({
      query: ({ searchParams }) => {
        return {
          url: `${searchParams}`,
          method: 'GET',
        };
      },
    }),
    getAllTags: build.query<GenericResponseType<TChipData[]>, unknown>({
      query: () => {
        return {
          url: `all-tags`,
          method: 'GET',
        };
      },
    }),
    getOneArticle: build.query<GenericResponseType<IPost>, { postId: string }>({
      query: ({ postId }) => {
        return {
          url: `/${postId}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) => [{ type: 'getOneArticle', id: arg.postId }],
    }),
    createPostComment: build.mutation<
      GenericResponseType<IPost>,
      { comment: IComment; postId: string }
    >({
      query: ({ postId, comment }) => {
        return {
          url: `/${postId}/comment`,
          method: 'POST',
          body: comment,
        };
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'getOneArticle', id: postId }],
    }),
  }),
});

export const {
  useLazyGetAllArticlesQuery,
  useLazyGetAllTagsQuery,
  useLazyGetOneArticleQuery,
  useCreatePostCommentMutation,
} = articleApi;
