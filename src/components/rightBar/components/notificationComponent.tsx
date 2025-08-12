import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, AlertCircle, Clock, X } from 'lucide-react'
import { NotificationItem } from '../../../hooks/notification'
import { useDeleteNotification } from '../../../hooks/notification'

interface NotificationComponentProps {
  notification: NotificationItem
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ notification }) => {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const deleteNotificationMutation = useDeleteNotification()

  const getStatusIcon = () => {
    switch (notification.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'queued':
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getTypeLabel = () => {
    switch (notification.type) {
      case 'flashcard_generation':
        return 'Flashcards'
      case 'multiple_choice_generation':
        return 'Quiz'
    }
  }

  const handleNavigate = () => {
    if (notification.status === 'completed' && notification.studySetId && projectId) {
      if (notification.type === 'flashcard_generation') {
        navigate(`/project/${projectId}/study-sets/flashcards/${notification.studySetId}`)
      } else if (notification.type === 'multiple_choice_generation') {
        navigate(`/project/${projectId}/study-sets/multiple-choice/${notification.studySetId}`)
      }
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNotificationMutation.mutate(notification.id)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div 
      className={`bg-surface-hover rounded-lg p-3 mb-2 cursor-pointer hover:bg-surface-pressed transition-colors ${
        notification.status === 'completed' ? 'hover:shadow-sm' : ''
      }`}
      onClick={handleNavigate}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-foreground-secondary">
                {getTypeLabel()}
              </span>
              <span className="text-xs text-foreground-tertiary">
                {formatTime(notification.createdAt)}
              </span>
            </div>
            <h4 className="text-sm font-medium text-foreground truncate">
              {notification.studySetName}
            </h4>
            <p className="text-xs text-foreground-secondary mt-1">
              {notification.message}
            </p>
            {notification.status === 'queued' && notification.progress > 0 && (
              <div className="mt-2">
                <div className="w-full bg-surface rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${notification.progress}%` }}
                  />
                </div>
              </div>
            )}
            {notification.status === 'failed' && notification.errorMessage && (
              <p className="text-xs text-red-500 mt-1">
                {notification.errorMessage}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="ml-2 p-1 hover:bg-surface-raised rounded transition-colors"
          aria-label="Delete notification"
        >
          <X className="w-3 h-3 text-foreground-tertiary" />
        </button>
      </div>
    </div>
  )
}

export default NotificationComponent