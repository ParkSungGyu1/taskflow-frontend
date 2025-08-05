import { Comment, CreateCommentRequest, PagedResponse } from '../types';
import { get, post, put, del } from './api';
import { mockCommentService } from './mockBackend';

// Use mock service for development until backend is ready
const useMock = true;

// Comment Service API
export const getTaskComments = async (taskId: number, page: number = 0, size: number = 10, sortOrder: 'newest' | 'oldest' = 'newest') => {
  if (useMock) {
    return mockCommentService.getTaskComments(taskId, page, size, sortOrder);
  }
  
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sort', sortOrder);
  
  return get<PagedResponse<Comment>>(`/tasks/${taskId}/comments?${params.toString()}`);
};

export const createComment = async (taskId: number, comment: CreateCommentRequest) => {
  if (useMock) {
    return mockCommentService.createComment(taskId, comment);
  }
  return post<Comment>(`/tasks/${taskId}/comments`, comment);
};

export const updateComment = async (commentId: number, content: string) => {
  if (useMock) {
    return mockCommentService.updateComment(commentId, content);
  }
  return put<Comment>(`/comments/${commentId}`, { content });
};

export const deleteComment = async (taskId: number, commentId: number) => {
  if (useMock) {
    return mockCommentService.deleteComment(taskId, commentId);
  }
  return del<{ success: boolean; message: string; data: null; timestamp: string }>(
    `/tasks/${taskId}/comments/${commentId}`
  );
}; 