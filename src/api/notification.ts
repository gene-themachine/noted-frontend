import { api } from './apiUtils'
import { NotificationItem } from '../hooks/notification'

// Get notifications for a specific project
export const getProjectNotifications = async (
  projectId: string, 
  limit: number = 50
): Promise<NotificationItem[]> => {
  const response = await api.get(`/projects/${projectId}/notifications`, {
    params: { limit }
  })
  return response.data.data
}

// Get all notifications for the current user
export const getUserNotifications = async (
  limit: number = 50
): Promise<NotificationItem[]> => {
  const response = await api.get('/notifications', {
    params: { limit }
  })
  return response.data.data
}

// Delete a specific notification
export const deleteNotification = async (
  notificationId: string
): Promise<void> => {
  await api.delete(`/notifications/${notificationId}`)
}

// Clear all completed notifications for a project
export const clearCompletedNotifications = async (
  projectId: string
): Promise<{ deletedCount: number }> => {
  const response = await api.delete(`/projects/${projectId}/notifications/completed`)
  return response.data
}