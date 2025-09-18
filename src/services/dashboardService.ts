import { Activity, DashboardStats, MyTaskSummary, PagedResponse } from '../types';
import { get } from './api';
import { mockDashboardService } from './mockBackend';

// Use mock service for development until backend is ready
const useMock = false;

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
  
  return get<PagedResponse<Activity>>(`/activities?${params.toString()}`);
};

export const getMyActivities = async (page = 0, size = 10) => {
  if (useMock) {
    return mockDashboardService.getMyActivities(page, size);
  }
  
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  return get<PagedResponse<Activity>>(`/activities/my?${params.toString()}`);
};

export const search = async (query: string) => {
  if (useMock) {
    return mockDashboardService.search(query);
  }
  return get<any>(`/search?query=${encodeURIComponent(query)}`);
};

// 주간 작업 추세 데이터 (임시 - 실제 API 구현 대기)
export const getWeeklyTrend = async () => {
  if (useMock) {
    return mockDashboardService.getWeeklyTrend();
  }
  // TODO: 실제 백엔드 API 구현 필요
  return get<any>('/dashboard/weekly-trend');
}; 