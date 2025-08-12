import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as notificationApi from '../api/notification'

export interface NotificationItem {
  id: string
  userId: string
  projectId: string
  type: 'flashcard_generation' | 'multiple_choice_generation'
  title: string
  message: string
  status: 'queued' | 'completed' | 'failed'
  progress: number
  studySetId: string | null
  studySetName: string
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

// Get notifications for a specific project
export const useProjectNotifications = (projectId: string | null, limit: number = 50) => {
  return useQuery({
    queryKey: ['notifications', 'project', projectId, limit],
    queryFn: () => projectId ? notificationApi.getProjectNotifications(projectId, limit) : [],
    enabled: !!projectId,
    refetchInterval: 30000, // Refetch every 30 seconds (static updates only)
    staleTime: 10000, // Consider data stale after 10 seconds
  })
}

// Get all notifications for the current user
export const useUserNotifications = (limit: number = 50) => {
  return useQuery({
    queryKey: ['notifications', 'user', limit],
    queryFn: () => notificationApi.getUserNotifications(limit),
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

// Delete a specific notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate all notification queries to refetch
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

// Clear all completed notifications for a project
export const useClearCompletedNotifications = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (projectId: string) => notificationApi.clearCompletedNotifications(projectId),
    onSuccess: (_, projectId) => {
      // Invalidate project notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', 'project', projectId] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'user'] })
    },
  })
}