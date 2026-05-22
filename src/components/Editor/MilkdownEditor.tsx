import { useCallback, useRef, useEffect } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { editorViewCtx, prosePluginsCtx } from '@milkdown/core';
import { Milkdown, MilkdownProvider, useEditor, useInstance } from '@milkdown/react';
import { Plugin, PluginKey } from '@milkdown/prose/state';
import { Decoration, DecorationSet } from '@milkdown/prose/view';
import type { Node as ProseNode } from '@milkdown/prose/model';
import { editorPlugins, configureNord, listenerCtx } from './plugins';
import { saveImage } from '../../services/ipc';
import type { HeadingItem } from '../Sidebar/Outline';

interface MilkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  onHeadingsChange: (headings: HeadingItem[]) => void;
  currentFile: string | null;
}

const headingPluginKey = new PluginKey('heading-extraction');
const headingAttrKey = new PluginKey('heading-attr');

function extractHeadings(doc: ProseNode): HeadingItem[] {
  const headings: HeadingItem[] = [];
  let counter = 0;
  doc.descendants((node) => {
    if (node.type.name === 'heading') {
      counter++;
      const text = node.textContent;
      const level = node.attrs.level as number;
      const id = `heading-${counter}`;
      headings.push({ level, text, id });
    }
  });
  return headings;
}

function buildHeadingDecorations(doc: ProseNode): DecorationSet {
  const decorations: Decoration[] = [];
  let counter = 0;
  doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      counter++;
      const id = `heading-${counter}`;
      const deco = Decoration.node(pos, pos + node.nodeSize, {
        'data-heading-id': id,
      });
      decorations.push(deco);
    }
  });
  return DecorationSet.create(doc, decorations);
}

function MilkdownInner({ value, onChange, onHeadingsChange, currentFile }: MilkdownEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onHeadingsChangeRef = useRef(onHeadingsChange);
  onHeadingsChangeRef.current = onHeadingsChange;
  const currentFileRef = useRef(currentFile);
  currentFileRef.current = currentFile;
  const containerRef = useRef<HTMLDivElement>(null);

  const [, getInstance] = useInstance();

  const insertImageAtCursor = useCallback(async (blob: Blob, ext: string) => {
    if (!currentFileRef.current) return;
    const editor = getInstance();
    if (!editor) return;

    const view = editor.action((ctx) => ctx.get(editorViewCtx));
    if (!view) return;

    const buffer = await blob.arrayBuffer();
    const imageData = Array.from(new Uint8Array(buffer));

    try {
      const relativePath = await saveImage(currentFileRef.current, imageData, ext);
      const schema = view.state.schema;
      const node = schema.nodes.image?.create({ src: relativePath });
      if (node) {
        const tr = view.state.tr.replaceSelectionWith(node);
        view.dispatch(tr);
      }
    } catch {
      // Silently fail — image save errors should not disrupt the user
    }
  }, [getInstance]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          e.stopPropagation();
          const blob = item.getAsFile();
          if (!blob || !currentFileRef.current) return;
          const ext = item.type.split('/')[1] || 'png';
          insertImageAtCursor(blob, ext);
          return;
        }
      }
    };

    const handleDrop = (e: DragEvent) => {
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          e.stopPropagation();
          if (!currentFileRef.current) return;
          const ext = file.type.split('/')[1] || file.name.split('.').pop() || 'png';
          insertImageAtCursor(file, ext);
          return;
        }
      }
    };

    container.addEventListener('paste', handlePaste, true);
    container.addEventListener('drop', handleDrop, true);

    return () => {
      container.removeEventListener('paste', handlePaste, true);
      container.removeEventListener('drop', handleDrop, true);
    };
  }, [insertImageAtCursor]);

  const getEditor = useCallback(
    (container: HTMLElement) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, container);
          ctx.set(defaultValueCtx, value);
          configureNord(ctx);
          ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => {
            onChangeRef.current(markdown);
          });

          // Plugin 1: extract headings from the document
          const headingPlugin = new Plugin({
            key: headingPluginKey,
            state: {
              init: (_config, state) => extractHeadings(state.doc),
              apply: (_tr, _value, _oldState, newState) => extractHeadings(newState.doc),
            },
            view: () => ({
              update(view) {
                const pluginState = headingPluginKey.getState(view.state);
                if (pluginState) {
                  onHeadingsChangeRef.current(pluginState);
                }
              },
            }),
          });

          // Plugin 2: add data-heading-id attributes to heading DOM elements
          const headingAttrPlugin = new Plugin({
            key: headingAttrKey,
            state: {
              init: (_config, state) => buildHeadingDecorations(state.doc),
              apply: (tr, value) => {
                if (tr.docChanged) {
                  return buildHeadingDecorations(tr.doc);
                }
                return value.map(tr.mapping, tr.doc);
              },
            },
            props: {
              decorations: (state) => {
                const dec = headingAttrKey.getState(state) as DecorationSet | undefined;
                return dec ?? DecorationSet.empty;
              },
            },
          });

          const existingPlugins = ctx.get(prosePluginsCtx);
          ctx.set(prosePluginsCtx, [...existingPlugins, headingPlugin, headingAttrPlugin]);
        })
        .use(editorPlugins),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEditor(getEditor, [getEditor]);

  return (
    <div ref={containerRef} className="milkdown-editor">
      <Milkdown />
    </div>
  );
}

export default function MilkdownEditor({ value, onChange, onHeadingsChange, currentFile }: MilkdownEditorProps) {
  return (
    <MilkdownProvider>
      <MilkdownInner value={value} onChange={onChange} onHeadingsChange={onHeadingsChange} currentFile={currentFile} />
    </MilkdownProvider>
  );
}
