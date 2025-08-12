import { useParams } from 'react-router-dom'
import { useProjectNotifications, useClearCompletedNotifications } from '../../hooks/notification'
import NotificationComponent from './components/notificationComponent'
import { Loader2, CheckCircle } from 'lucide-react'

export default function Notification() {
  const { projectId } = useParams()
  const { data: notifications, isLoading, error } = useProjectNotifications(projectId || null)
  const clearCompletedMutation = useClearCompletedNotifications()

  const handleClearCompleted = () => {
    if (projectId) {
      clearCompletedMutation.mutate(projectId)
    }
  }

  const completedCount = notifications?.filter(n => n.status === 'completed').length || 0
  const activeCount = notifications?.filter(n => n.status === 'queued').length || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-5 h-5 animate-spin text-foreground-tertiary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-foreground-secondary">Failed to load notifications</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Progress</h3>
          {activeCount > 0 && (
            <p className="text-xs text-foreground-secondary mt-1">
              {activeCount} in progress
            </p>
          )}
        </div>
        {completedCount > 0 && (
          <button
            onClick={handleClearCompleted}
            disabled={clearCompletedMutation.isPending}
            className="text-xs text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Clear completed
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!notifications || notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-foreground-tertiary">No notifications yet</p>
            <p className="text-xs text-foreground-tertiary mt-1">
              Study set generation progress will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationComponent
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}