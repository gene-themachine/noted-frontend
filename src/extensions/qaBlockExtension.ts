import { Extension } from '@tiptap/core';
import { Paragraph } from '@tiptap/extension-paragraph';

export interface QABlockAttributes {
  id: string;
  question: string;
  answer: string;
  status: 'loading' | 'completed' | 'error';
  errorMessage?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    qaBlock: {
      insertQABlock: (question: string) => ReturnType;
      updateQABlock: (id: string, updates: Partial<QABlockAttributes>) => ReturnType;
    };
  }
}

// Extended paragraph that supports data-qa-id attribute
export const QAParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-qa-id': {
        default: null,
        parseHTML: element => element.getAttribute('data-qa-id'),
        renderHTML: attributes => {
          if (!attributes['data-qa-id']) {
            return {}
          }
          return {
            'data-qa-id': attributes['data-qa-id'],
          }
        },
      },
    }
  },
});

export const QABlockExtension = Extension.create({
  name: 'qaBlock',

  addCommands() {
    return {
      updateQABlock: (id: string, updates: Partial<QABlockAttributes>) => ({ editor }) => {
        console.log('🔄 updateQABlock called:', { id, updates });

        let foundPos: number | null = null;
        let nodeSize: number = 0;

        // Find the paragraph with the matching data-qa-id attribute
        editor.state.doc.descendants((node: any, pos: number) => {
          if (node.type.name === 'paragraph' && node.attrs && node.attrs['data-qa-id'] === id) {
            console.log('📍 Found paragraph with matching ID at position:', pos);
            foundPos = pos;
            nodeSize = node.nodeSize;
            return false; // Stop searching
          }
        });

        if (foundPos === null) {
          console.log('⚠️ No matching paragraph found for ID:', id);
          return false;
        }

        // Build the new answer text
        // If answer is explicitly undefined and status is 'completed', we're just marking complete without changing content
        if (updates.status === 'completed' && updates.answer === undefined) {
          console.log('📝 Marking Q&A as completed without changing answer content');
          // Just return success - we don't need to update the content, it's already complete from streaming
          return true;
        }

        let answerText = 'A: Generating answer...';
        if (updates.status === 'error') {
          answerText = `A: Error - ${updates.errorMessage || 'Failed to generate answer'}`;
        } else if (updates.answer) {
          answerText = `A: ${updates.answer}`;
        }

        console.log('📝 Updating paragraph with text:', answerText.substring(0, 50) + '...');

        // Helper function to parse a single line with markdown formatting
        const parseLineContent = (lineText: string): any[] => {
          const contentArray: any[] = [];
          const boldRegex = /\*\*(.+?)\*\*/g;
          let lastIndex = 0;
          let match;

          while ((match = boldRegex.exec(lineText)) !== null) {
            // Add text before the bold
            if (match.index > lastIndex) {
              const beforeText = lineText.substring(lastIndex, match.index);
              contentArray.push({
                type: 'text',
                text: beforeText,
              });
            }

            // Add bold text
            contentArray.push({
              type: 'text',
              text: match[1],
              marks: [{ type: 'bold' }],
            });

            lastIndex = match.index + match[0].length;
          }

          // Add remaining text after last bold
          if (lastIndex < lineText.length) {
            contentArray.push({
              type: 'text',
              text: lineText.substring(lastIndex),
            });
          }

          // If no content parsed, add plain text
          if (contentArray.length === 0 && lineText.length > 0) {
            contentArray.push({
              type: 'text',
              text: lineText,
            });
          }

          return contentArray;
        };

        // CRITICAL FIX: During streaming (status: 'loading'), keep everything in a SINGLE paragraph
        // to prevent duplication issues. Only split into multiple paragraphs when completed.
        const isStreaming = updates.status === 'loading';
        const paragraphs: any[] = [];

        if (isStreaming) {
          // Streaming: Keep as single paragraph, preserve newlines as text content
          console.log('🔄 Streaming mode: keeping single paragraph');
          const content = parseLineContent(answerText);
          paragraphs.push({
            type: 'paragraph',
            content: content.length > 0 ? content : [{ type: 'text', text: answerText }],
            attrs: { 'data-qa-id': id },
          });
        } else {
          // Completed or error: Split by newlines to create multiple paragraphs for better formatting
          console.log('✅ Completed mode: splitting into multiple paragraphs');
          const lines = answerText.split('\n');

          for (const line of lines) {
            const trimmedLine = line.trim();

            // Skip completely empty lines
            if (trimmedLine.length === 0) {
              continue;
            }

            const lineContent = parseLineContent(line);

            // Build paragraph for this line
            const paragraph: any = {
              type: 'paragraph',
              content: lineContent.length > 0 ? lineContent : [{ type: 'text', text: ' ' }],
            };

            // Only add data-qa-id to the first paragraph if not completed
            if (paragraphs.length === 0 && updates.status !== 'completed') {
              paragraph.attrs = { 'data-qa-id': id };
            }

            paragraphs.push(paragraph);
          }
        }

        // Ensure we have at least one paragraph
        if (paragraphs.length === 0) {
          paragraphs.push({
            type: 'paragraph',
            content: [{ type: 'text', text: answerText }],
            attrs: updates.status !== 'completed' ? { 'data-qa-id': id } : undefined,
          });
        }

        // Build content to insert (single paragraph or multiple)
        const paragraphContent = paragraphs.length === 1 ? paragraphs[0] : paragraphs;

        // Use TipTap's command API to replace content at position
        const fromPos = foundPos;
        const toPos = foundPos + nodeSize;

        console.log('🔄 Replacing content at position:', { fromPos, toPos });

        // Use editor.chain() with insertContentAt for proper state management
        const success = editor
          .chain()
          .insertContentAt(
            { from: fromPos, to: toPos },
            paragraphContent
          )
          .run();

        if (success) {
          console.log('✅ Paragraph updated successfully');
        } else {
          console.log('❌ Failed to update paragraph');
        }

        return success;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': ({ editor }) => {
        console.log('🔄 Cmd+Enter pressed - Q&A shortcut triggered');
        
        // Get the current selection
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        
        // Get the current line/paragraph
        const paragraph = $from.parent;
        
        // Only process if we're in a regular paragraph
        if (paragraph.type.name !== 'paragraph') {
          console.log('❌ Not in a paragraph, ignoring');
          return false;
        }
        
        // Get the text content of the current line
        const lineText = paragraph.textContent.trim();
        console.log('📝 Question text:', lineText);
        
        // Don't process empty lines
        if (!lineText) {
          console.log('❌ Empty line, ignoring');
          return false;
        }
        
        // Generate unique ID for this Q&A
        const qaId = `qa-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        console.log('🆔 Generated Q&A ID:', qaId);
        
        try {
          // Simple approach: select all text in current paragraph and replace
          const from = $from.start($from.depth);
          const to = $from.end($from.depth);
          
          console.log('📍 Selection range:', { from, to });
          
          // Replace current paragraph content with Q&A structure using proper paragraphs
          const success = editor.chain()
            .focus()
            .setTextSelection({ from, to })
            .insertContent([
              {
                type: 'paragraph',
                content: [{ type: 'text', text: `Q: ${lineText}` }]
              },
              {
                type: 'paragraph',
                content: []
              },
              {
                type: 'paragraph',
                attrs: { 'data-qa-id': qaId },
                content: [{ type: 'text', text: 'A: Generating answer...' }]
              },
              {
                type: 'paragraph',
                content: []
              }
            ])
            .run();
            
          console.log('✅ Content insertion result:', success);
          
          if (success) {
            // Trigger custom event for streaming
            const event = new CustomEvent('qa-block-inserted', {
              detail: {
                id: qaId,
                question: lineText,
              },
            });
            window.dispatchEvent(event);
            console.log('🚀 Event dispatched for streaming');
          }
          
          return success;
        } catch (error) {
          console.error('❌ Error in Q&A shortcut:', error);
          return false;
        }
      },
    };
  },
});