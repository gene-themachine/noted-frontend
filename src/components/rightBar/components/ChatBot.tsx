import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function ChatBot() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-primary-blue" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">AI Chat Assistant</h3>
          <p className="text-sm text-foreground-secondary mb-6 max-w-xs mx-auto">
            Chat with AI about your notes and get study help. Coming soon!
          </p>
          <div className="w-full max-w-xs mx-auto">
            <div className="bg-surface border border-border-light rounded-xl p-4 text-center">
              <span className="text-xs text-foreground-tertiary">Feature in development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}