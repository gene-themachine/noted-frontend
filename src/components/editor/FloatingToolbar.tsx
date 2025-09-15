import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Hash, ChevronDown } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface FloatingToolbarProps {
  onInsertFormat: (formatType: string) => void;
  editor: Editor | null;
}

export default function FloatingToolbar({ onInsertFormat, editor }: FloatingToolbarProps) {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [, forceUpdate] = useState({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Force re-render when editor state changes
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      forceUpdate({});
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowHeadingDropdown(false);
      }
    };

    if (showHeadingDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showHeadingDropdown]);

  const toolbarButtons = [
    {
      icon: <Bold className="w-4 h-4" />,
      title: 'Bold (Cmd+B)',
      onClick: () => onInsertFormat('bold'),
      isActive: editor?.isActive('bold'),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      title: 'Italic (Cmd+I)',
      onClick: () => onInsertFormat('italic'),
      isActive: editor?.isActive('italic'),
    },
    {
      icon: <Underline className="w-4 h-4" />,
      title: 'Underline (Cmd+U)',
      onClick: () => onInsertFormat('underline'),
      isActive: editor?.isActive('underline'),
    },
  ];

  const headingOptions = [
    { label: 'Normal', value: 'paragraph', level: 0 },
    { label: 'Heading 1', value: 'h1', level: 1 },
    { label: 'Heading 2', value: 'h2', level: 2 },
    { label: 'Heading 3', value: 'h3', level: 3 },
  ];

  const getCurrentHeading = () => {
    if (editor?.isActive('heading', { level: 1 })) return 'Heading 1';
    if (editor?.isActive('heading', { level: 2 })) return 'Heading 2';
    if (editor?.isActive('heading', { level: 3 })) return 'Heading 3';
    return 'Normal';
  };

  const handleHeadingSelect = (value: string) => {
    if (value === 'paragraph') {
      editor?.chain().focus().setParagraph().run();
    } else {
      onInsertFormat(value);
    }
    setShowHeadingDropdown(false);
  };

  return (
    <div className="floating-toolbar">
      <div className="floating-toolbar-content">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            title={button.title}
            type="button"
            className={button.isActive ? 'active' : ''}
          >
            {button.icon}
          </button>
        ))}
        
        <div className="heading-dropdown-container" ref={dropdownRef}>
          <button
            onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
            className="heading-dropdown-button"
            type="button"
            title="Heading"
          >
            <Hash className="w-4 h-4" />
            <span>{getCurrentHeading()}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showHeadingDropdown && (
            <div className="heading-dropdown-menu">
              {headingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleHeadingSelect(option.value)}
                  className={`heading-option ${getCurrentHeading() === option.label ? 'active' : ''}`}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}