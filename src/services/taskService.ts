import { CreateTaskRequest, PagedResponse, Task, TaskStatus } from '../types';
import { get, post, put, del, patch } from './api';
import { mockTaskService } from './mockBackend';

// Use mock service for development until backend is ready
const useMock = false;

// Task Management Service API
export const getTasks = async (page = 0, size = 10, status?: TaskStatus, search?: string, assigneeId?: number) => {
  if (useMock) {
    return mockTaskService.getTasks(page, size, status, search, assigneeId);
  }
  
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  if (assigneeId) params.append('assigneeId', assigneeId.toString());
  
  return get<PagedResponse<Task>>(`/tasks?${params.toString()}`);
};

export const getTaskById = async (id: number) => {
  if (useMock) {
    return mockTaskService.getTaskById(id);
  }
  return get<Task>(`/tasks/${id}`);
};

export const createTask = async (task: CreateTaskRequest) => {
  if (useMock) {
    return mockTaskService.createTask(task);
  }
  return post<Task>('/tasks', task);
};

export const updateTask = async (id: number, task: Partial<Task>) => {
  if (useMock) {
    return mockTaskService.updateTask(id, task);
  }
  return put<Task>(`/tasks/${id}`, task);
};

export const deleteTask = async (id: number) => {
  if (useMock) {
    return mockTaskService.deleteTask(id);
  }
  return del<void>(`/tasks/${id}`);
};

export const updateTaskStatus = async (id: number, status: TaskStatus) => {
  if (useMock) {
    return mockTaskService.updateTaskStatus(id, status);
  }
  return patch<Task>(`/tasks/${id}/status`, { status });
};

export const searchTasks = async (query: string, page = 0, size = 10) => {
  if (useMock) {
    return mockTaskService.searchTasks(query, page, size);
  }
  
  const params = new URLSearchParams();
  params.append('query', query);
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  return get<PagedResponse<Task>>(`/tasks/search?${params.toString()}`);
}; 