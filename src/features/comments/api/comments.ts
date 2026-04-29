import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchClient,
  fetchClientResponse,
  type PaginatedResult
} from '@/lib/fetch-client';
import { queryKeys } from '@/lib/query-keys';
import {
  CommentSchema,
  CreateCommentSchema,
  UpdateCommentSchema,
  type Comment,
  type CommentsListParams,
  type CreateCommentDto,
  type UpdateCommentDto
} from '../types';

const commentsListSchema = CommentSchema.array();

function parseComment(data: unknown): Comment {
  return CommentSchema.parse(data);
}

function parseComments(data: unknown): Comment[] {
  return commentsListSchema.parse(data);
}

export function useCommentsByDisaster(
  disasterId: string,
  params?: CommentsListParams
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.comments.byDisaster(disasterId, params),
    queryFn: async () => {
      const response = await fetchClientResponse<Comment[]>(
        `/comments/disaster/${disasterId}`,
        { params },
        getToken
      );

      return {
        items: parseComments(response.data),
        meta: response.meta
      } satisfies PaginatedResult<Comment>;
    },
    enabled: !!disasterId
  });
}

export function useCreateComment() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCommentDto) => {
      const validatedPayload = CreateCommentSchema.parse(payload);

      const data = await fetchClient<Comment>(
        '/comments',
        {
          method: 'POST',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseComment(data);
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byDisaster(comment.disasterId)
      });
    }
  });
}

export function useUpdateComment(id: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCommentDto) => {
      const validatedPayload = UpdateCommentSchema.parse(payload);

      const data = await fetchClient<Comment>(
        `/comments/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(validatedPayload)
        },
        getToken
      );

      return parseComment(data);
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byDisaster(comment.disasterId)
      });
    }
  });
}

export function useDeleteComment() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      disasterId
    }: {
      id: string;
      disasterId: string;
    }) => {
      await fetchClient<void>(
        `/comments/${id}`,
        {
          method: 'DELETE'
        },
        getToken
      );

      return { disasterId };
    },
    onSuccess: ({ disasterId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byDisaster(disasterId)
      });
    }
  });
}
