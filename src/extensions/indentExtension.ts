import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType,
      outdent: () => ReturnType,
    }
  }
}

export interface IndentOptions {
  types: string[];
  indentSize: number;
  maxIndent: number;
}

export const IndentExtension = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      indentSize: 40, // pixels
      maxIndent: 10,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            renderHTML: attributes => {
              if (!attributes.indent || attributes.indent === 0) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indent * this.options.indentSize}px`,
              };
            },
            parseHTML: element => {
              const marginLeft = element.style.marginLeft;
              if (!marginLeft) return 0;
              const indent = parseInt(marginLeft) / this.options.indentSize;
              return Math.max(0, Math.min(this.options.maxIndent, indent));
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        const { from, to } = selection;
        let hasChange = false;

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            const currentIndent = node.attrs.indent || 0;
            if (currentIndent < this.options.maxIndent) {
              const attrs = { ...node.attrs, indent: currentIndent + 1 };
              tr.setNodeMarkup(pos, null, attrs);
              hasChange = true;
            }
          }
        });

        if (hasChange && dispatch) {
          dispatch(tr);
        }
        return hasChange;
      },

      outdent: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        const { from, to } = selection;
        let hasChange = false;

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            const currentIndent = node.attrs.indent || 0;
            if (currentIndent > 0) {
              const attrs = { ...node.attrs, indent: currentIndent - 1 };
              tr.setNodeMarkup(pos, null, attrs);
              hasChange = true;
            }
          }
        });

        if (hasChange && dispatch) {
          dispatch(tr);
        }
        return hasChange;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.indent();
      },
      'Shift-Tab': () => {
        return this.editor.commands.outdent();
      },
    };
  },
});