import React from 'react';

interface ToDoListComponentProps {
    text: string;
}

export default function ToDoListComponent({ text }: ToDoListComponentProps) {
    return (
        <div className="bg-surface-hover hover:bg-surface-pressed transition-colors duration-200 p-4 rounded-xl border border-border-light">
            <p className="text-sm text-foreground-secondary">{text}</p>
        </div>
    );
}