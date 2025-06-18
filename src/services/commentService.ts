import { Comment, CreateCommentRequest, PagedResponse } from '../types';
import { get, post, put, del } from './api';
import { mockCommentService } from './mockBackend';

// Use mock service for development until backend is ready
const useMock = false;

// Comment Service API
export const getTaskComments = async (taskId: number) => {
  if (useMock) {
    return mockCommentService.getTaskComments(taskId);
  }
  return get<PagedResponse<Comment>>(`/tasks/${taskId}/comments`);
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

export const deleteComment = async (commentId: number) => {
  if (useMock) {
    return mockCommentService.deleteComment(commentId);
  }
  return del<void>(`/comments/${commentId}`);
}; 