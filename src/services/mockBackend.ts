import { Task, User, Team, Comment, Activity, TaskStatus, TaskPriority, UserRole, DashboardStats, MyTaskSummary } from '../types';
import { ApiResponse, PagedResponse } from '../types';
import { subDays, addDays, format } from 'date-fns';

// Mock data
const users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    name: '관리자',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'johndoe',
    email: 'john@example.com',
    name: '김철수',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    username: 'janedoe',
    email: 'jane@example.com',
    name: '이영희',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
  },
];

const teams: Team[] = [
  {
    id: 1,
    name: '개발팀',
    description: '프론트엔드 및 백엔드 개발자들',
    createdAt: new Date().toISOString(),
    members: [users[0], users[1]],
  },
  {
    id: 2,
    name: '디자인팀',
    description: 'UI/UX 디자이너들',
    createdAt: new Date().toISOString(),
    members: [users[2]],
  },
];

const tasks: Task[] = [
  {
    id: 1,
    title: '사용자 인증 구현',
    description: 'API용 JWT 인증 시스템을 구현합니다',
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    assigneeId: 1,
    assignee: users[0],
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
    dueDate: subDays(new Date(), 2).toISOString(),
  },
  {
    id: 2,
    title: '대시보드 UI 디자인',
    description: '대시보드를 위한 와이어프레임을 제작합니다',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    assigneeId: 3,
    assignee: users[2],
    createdAt: subDays(new Date(), 7).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
    dueDate: addDays(new Date(), 2).toISOString(),
  },
  {
    id: 3,
    title: '작업 보드 구현',
    description: '드래그 앤 드롭 기능이 있는 작업 보드 컴포넌트를 만듭니다',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    assigneeId: 2,
    assignee: users[1],
    createdAt: subDays(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
    dueDate: addDays(new Date(), 5).toISOString(),
  },
  {
    id: 4,
    title: 'API 문서화',
    description: '모든 API 엔드포인트에 대한 문서를 작성합니다',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    assigneeId: 1,
    assignee: users[0],
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
    dueDate: addDays(new Date(), 10).toISOString(),
  },
  {
    id: 5,
    title: '로그인 버그 수정',
    description: '모바일 디바이스에서 로그인 문제를 해결합니다',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    assigneeId: 2,
    assignee: users[1],
    createdAt: subDays(new Date(), 1).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: addDays(new Date(), 1).toISOString(),
  },
];

const comments: Comment[] = [
  {
    id: 1,
    taskId: 1,
    userId: 1,
    user: users[0],
    content: '인증 서비스 구현을 완료했습니다',
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: 2,
    taskId: 1,
    userId: 2,
    user: users[1],
    content: '좋은 작업입니다! 인증이 완벽하게 작동하고 있네요.',
    createdAt: subDays(new Date(), 4).toISOString(),
    updatedAt: subDays(new Date(), 4).toISOString(),
  },
  {
    id: 3,
    taskId: 2,
    userId: 3,
    user: users[2],
    content: '와이어프레임 작업 중입니다. 곧 공유하겠습니다.',
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
];

const activities: Activity[] = [
  {
    id: 1,
    userId: 1,
    user: users[0],
    action: 'created_task',
    targetType: 'task',
    targetId: 1,
    description: '"사용자 인증 구현" 작업을 생성했습니다',
    createdAt: subDays(new Date(), 10).toISOString(),
  },
  {
    id: 2,
    userId: 1,
    user: users[0],
    action: 'updated_status',
    targetType: 'task',
    targetId: 1,
    description: '"사용자 인증 구현"을 완료로 이동했습니다',
    createdAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: 3,
    userId: 3,
    user: users[2],
    action: 'created_task',
    targetType: 'task',
    targetId: 2,
    description: '"대시보드 UI 디자인" 작업을 생성했습니다',
    createdAt: subDays(new Date(), 7).toISOString(),
  },
  {
    id: 4,
    userId: 2,
    user: users[1],
    action: 'added_comment',
    targetType: 'comment',
    targetId: 2,
    description: '"사용자 인증 구현"에 댓글을 작성했습니다',
    createdAt: subDays(new Date(), 4).toISOString(),
  },
];

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: '성공',
  data,
  timestamp: new Date().toISOString(),
});

const createPagedResponse = <T>(items: T[], page: number, size: number): PagedResponse<T> => {
  const start = page * size;
  const end = start + size;
  const content = items.slice(start, end);
  
  return {
    content,
    page,
    size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
  };
};

// Mock API handlers
export const mockAuthService = {
  login: async (username: string, password: string) => {
    await delay(500);
    const user = users.find(u => u.username === username);
    
    if (user && password === 'password') {
      return createSuccessResponse({
        token: 'mock-jwt-token',
      });
    }
    
    return {
      success: false,
      message: '잘못된 사용자명 또는 비밀번호입니다',
      data: null,
      timestamp: new Date().toISOString(),
    } as ApiResponse<null>;
  },
  
  register: async (userData: { username: string; email: string; password: string; name: string }) => {
    await delay(700);
    // Check if username or email already exists
    if (users.some(u => u.username === userData.username)) {
      return {
        success: false,
        message: '이미 존재하는 사용자명입니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    if (users.some(u => u.email === userData.email)) {
      return {
        success: false,
        message: '이미 존재하는 이메일입니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    // Create new user
    const newUser: User = {
      id: users.length + 1,
      username: userData.username,
      email: userData.email,
      name: userData.name,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    
    return createSuccessResponse(newUser);
  },
  
  getCurrentUser: async () => {
    await delay(300);
    return createSuccessResponse(users[0]);
  },
  
  getUsers: async () => {
    await delay(500);
    return createSuccessResponse(users);
  },
  
  updateUser: async (id: number, userData: Partial<User>) => {
    await delay(500);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    
    return createSuccessResponse(users[userIndex]);
  },
};

export const mockTaskService = {
  getTasks: async (page = 0, size = 10, status?: TaskStatus, search?: string, assigneeId?: number) => {
    await delay(500);
    
    let filteredTasks = [...tasks];
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        task.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (assigneeId) {
      filteredTasks = filteredTasks.filter(task => task.assigneeId === assigneeId);
    }
    
    return createSuccessResponse(createPagedResponse(filteredTasks, page, size));
  },
  
  getTaskById: async (id: number) => {
    await delay(300);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      return {
        success: false,
        message: '작업을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    return createSuccessResponse(task);
  },
  
  createTask: async (taskData: any) => {
    await delay(700);
    
    const newTask: Task = {
      id: tasks.length + 1,
      title: taskData.title,
      description: taskData.description || '',
      status: TaskStatus.TODO,
      priority: taskData.priority,
      assigneeId: taskData.assigneeId,
      assignee: users.find(u => u.id === taskData.assigneeId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: taskData.dueDate || addDays(new Date(), 7).toISOString(),
    };
    
    tasks.push(newTask);
    
    // Create an activity for the new task
    activities.push({
      id: activities.length + 1,
      userId: 1, // Assuming current user is admin
      user: users[0],
      action: 'created_task',
      targetType: 'task',
      targetId: newTask.id,
      description: `"${newTask.title}" 작업을 생성했습니다`,
      createdAt: new Date().toISOString(),
    });
    
    return createSuccessResponse(newTask);
  },
  
  updateTask: async (id: number, taskData: any) => {
    await delay(500);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return {
        success: false,
        message: '작업을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString(),
    };
    
    tasks[taskIndex] = updatedTask;
    
    // Create an activity for the task update
    activities.push({
      id: activities.length + 1,
      userId: 1, // Assuming current user is admin
      user: users[0],
      action: 'updated_task',
      targetType: 'task',
      targetId: id,
      description: `"${updatedTask.title}" 작업을 수정했습니다`,
      createdAt: new Date().toISOString(),
    });
    
    return createSuccessResponse(updatedTask);
  },
  
  updateTaskStatus: async (id: number, status: TaskStatus) => {
    await delay(400);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return {
        success: false,
        message: '작업을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
    
    tasks[taskIndex] = updatedTask;
    
    // Create an activity for the status change
    const statusMap = {
      [TaskStatus.TODO]: '할 일',
      [TaskStatus.IN_PROGRESS]: '진행 중',
      [TaskStatus.DONE]: '완료'
    };
    
    activities.push({
      id: activities.length + 1,
      userId: 1, // Assuming current user is admin
      user: users[0],
      action: 'updated_status',
      targetType: 'task',
      targetId: id,
      description: `"${updatedTask.title}"을 ${statusMap[status]}로 이동했습니다`,
      createdAt: new Date().toISOString(),
    });
    
    return createSuccessResponse(updatedTask);
  },
  
  deleteTask: async (id: number) => {
    await delay(600);
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return {
        success: false,
        message: '작업을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    
    // Remove associated comments
    const taskComments = comments.filter(c => c.taskId === id);
    for (const comment of taskComments) {
      const commentIndex = comments.findIndex(c => c.id === comment.id);
      if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
      }
    }
    
    // Create an activity for the task deletion
    activities.push({
      id: activities.length + 1,
      userId: 1, // Assuming current user is admin
      user: users[0],
      action: 'deleted_task',
      targetType: 'task',
      targetId: id,
      description: `"${deletedTask.title}" 작업을 삭제했습니다`,
      createdAt: new Date().toISOString(),
    });
    
    return createSuccessResponse(null);
  },
  
  searchTasks: async (query: string, page = 0, size = 10) => {
    await delay(400);
    
    const searchLower = query.toLowerCase();
    const filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) || 
      task.description.toLowerCase().includes(searchLower)
    );
    
    return createSuccessResponse(createPagedResponse(filteredTasks, page, size));
  },
};

export const mockCommentService = {
  getTaskComments: async (taskId: number) => {
    await delay(300);
    
    const taskComments = comments.filter(c => c.taskId === taskId);
    
    return createSuccessResponse(taskComments);
  },
  
  createComment: async (taskId: number, commentData: { content: string }) => {
    await delay(500);
    
    if (!tasks.some(t => t.id === taskId)) {
      return {
        success: false,
        message: '작업을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    const newComment: Comment = {
      id: comments.length + 1,
      taskId,
      userId: 1, // Assuming current user is admin
      user: users[0],
      content: commentData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    comments.push(newComment);
    
    // Create an activity for the new comment
    activities.push({
      id: activities.length + 1,
      userId: 1, // Assuming current user is admin
      user: users[0],
      action: 'added_comment',
      targetType: 'comment',
      targetId: newComment.id,
      description: `작업 #${taskId}에 댓글을 작성했습니다`,
      createdAt: new Date().toISOString(),
    });
    
    return createSuccessResponse(newComment);
  },
  
  updateComment: async (commentId: number, content: string) => {
    await delay(400);
    
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
      return {
        success: false,
        message: '댓글을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    const updatedComment = {
      ...comments[commentIndex],
      content,
      updatedAt: new Date().toISOString(),
    };
    
    comments[commentIndex] = updatedComment;
    
    return createSuccessResponse(updatedComment);
  },
  
  deleteComment: async (commentId: number) => {
    await delay(400);
    
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
      return {
        success: false,
        message: '댓글을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    comments.splice(commentIndex, 1);
    
    return createSuccessResponse(null);
  },
};

export const mockTeamService = {
  getTeams: async () => {
    await delay(300);
    return createSuccessResponse(teams);
  },
  
  getTeamById: async (id: number) => {
    await delay(300);
    const team = teams.find(t => t.id === id);
    
    if (!team) {
      return {
        success: false,
        message: '팀을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    return createSuccessResponse(team);
  },
  
  getTeamMembers: async (teamId: number) => {
    await delay(300);
    const team = teams.find(t => t.id === teamId);
    
    if (!team) {
      return {
        success: false,
        message: '팀을 찾을 수 없습니다',
        data: null,
        timestamp: new Date().toISOString(),
      } as ApiResponse<null>;
    }
    
    return createSuccessResponse(team.members || []);
  },
};

export const mockDashboardService = {
  getDashboardStats: async () => {
    await delay(400);
    
    const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO).length;
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const totalTasks = tasks.length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && t.status !== TaskStatus.DONE;
    }).length;
    
    const stats: DashboardStats = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      teamProgress: Math.round((completedTasks / totalTasks) * 100),
      myTasksToday: tasks.filter(t => t.assigneeId === 1).length,
      completionRate: Math.round((completedTasks / totalTasks) * 100),
    };
    
    return createSuccessResponse(stats);
  },
  
  getMyTasks: async () => {
    await delay(500);
    
    const myTasks = tasks.filter(t => t.assigneeId === 1);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTasks = myTasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
    
    const upcomingTasks = myTasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate > today && t.status !== TaskStatus.DONE;
    });
    
    const overdueTasks = myTasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && t.status !== TaskStatus.DONE;
    });
    
    const summary: MyTaskSummary = {
      todayTasks,
      upcomingTasks,
      overdueTasks,
    };
    
    return createSuccessResponse(summary);
  },
  
  getTeamProgress: async () => {
    await delay(400);
    
    const teamProgress: { [key: string]: number } = {};
    
    for (const team of teams) {
      const memberIds = team.members?.map(m => m.id) || [];
      const teamTasks = tasks.filter(t => memberIds.includes(t.assigneeId));
      const completedTasks = teamTasks.filter(t => t.status === TaskStatus.DONE).length;
      const progress = teamTasks.length > 0 
        ? Math.round((completedTasks / teamTasks.length) * 100)
        : 0;
      
      teamProgress[team.name] = progress;
    }
    
    return createSuccessResponse(teamProgress);
  },
  
  getActivities: async (page = 0, size = 10) => {
    await delay(300);
    
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return createSuccessResponse(createPagedResponse(sortedActivities, page, size));
  },
  
  getMyActivities: async (page = 0, size = 10) => {
    await delay(300);
    
    const myActivities = activities.filter(a => a.userId === 1);
    const sortedActivities = [...myActivities].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return createSuccessResponse(createPagedResponse(sortedActivities, page, size));
  },
  
  search: async (query: string) => {
    await delay(500);
    
    const searchLower = query.toLowerCase();
    
    const matchedTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) || 
      task.description.toLowerCase().includes(searchLower)
    );
    
    const matchedUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchLower) || 
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
    
    const matchedTeams = teams.filter(team => 
      team.name.toLowerCase().includes(searchLower) || 
      team.description.toLowerCase().includes(searchLower)
    );
    
    return createSuccessResponse({
      tasks: matchedTasks,
      users: matchedUsers,
      teams: matchedTeams,
    });
  },
}; 