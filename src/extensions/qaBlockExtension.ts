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
      updateQABlock: (id: string, updates: Partial<QABlockAttributes>) => ({ state, dispatch, editor }) => {
        console.log('🔄 updateQABlock called:', { id, updates });
        
        const { tr } = state;
        let updated = false;

        // Find the paragraph with the matching data-qa-id attribute
        state.doc.descendants((node: any, pos: number) => {
          console.log('🔍 Checking node:', { 
            type: node.type.name, 
            attrs: node.attrs, 
            content: node.textContent?.substring(0, 50) 
          });
          
          if (node.type.name === 'paragraph' && node.attrs && node.attrs['data-qa-id'] === id) {
            console.log('📍 Found paragraph with matching ID:', id);
            
            // Build the new answer text
            let answerText = 'A: Generating answer...';
            if (updates.status === 'error') {
              answerText = `A: Error - ${updates.errorMessage || 'Failed to generate answer'}`;
            } else if (updates.answer) {
              answerText = `A: ${updates.answer}`;
            }
            
            console.log('📝 Updating paragraph with text:', answerText.substring(0, 50) + '...');
            
            // Create new text node with updated content
            const textNode = editor.schema.text(answerText);
            const newParagraph = editor.schema.nodes.paragraph.create(
              { 'data-qa-id': id },
              [textNode]
            );
            
            // Replace the paragraph
            tr.replaceWith(pos, pos + node.nodeSize, newParagraph);
            updated = true;
            return false; // Stop searching
          }
        });

        if (updated && dispatch) {
          console.log('✅ Dispatching paragraph update');
          dispatch(tr);
        } else {
          console.log('⚠️ No matching paragraph found for ID:', id);
        }

        return updated;
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