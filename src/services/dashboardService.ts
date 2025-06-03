import { Activity, DashboardStats, MyTaskSummary } from '../types';
import { get } from './api';
import { mockDashboardService } from './mockBackend';

// Use mock service for development until backend is ready
const useMock = true;

// Dashboard & Reports Service API
export const getDashboardStats = async () => {
  if (useMock) {
    return mockDashboardService.getDashboardStats();
  }
  return get<DashboardStats>('/dashboard/stats');
};

export const getMyTasks = async () => {
  if (useMock) {
    return mockDashboardService.getMyTasks();
  }
  return get<MyTaskSummary>('/dashboard/my-tasks');
};

export const getTeamProgress = async () => {
  if (useMock) {
    return mockDashboardService.getTeamProgress();
  }
  return get<{ [key: string]: number }>('/dashboard/team-progress');
};

export const getTaskSummaryReport = async () => {
  return get<any>('/reports/task-summary');
};

export const getUserActivityReport = async (userId?: number) => {
  const params = userId ? `?userId=${userId}` : '';
  return get<any>(`/reports/user-activity${params}`);
};

export const getActivities = async (page = 0, size = 10) => {
  if (useMock) {
    return mockDashboardService.getActivities(page, size);
  }
  
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  return get<Activity[]>(`/activities?${params.toString()}`);
};

export const getMyActivities = async (page = 0, size = 10) => {
  if (useMock) {
    return mockDashboardService.getMyActivities(page, size);
  }
  
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  return get<Activity[]>(`/activities/my?${params.toString()}`);
};

export const search = async (query: string) => {
  if (useMock) {
    return mockDashboardService.search(query);
  }
  return get<any>(`/search?query=${encodeURIComponent(query)}`);
}; 