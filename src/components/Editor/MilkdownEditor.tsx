import { useCallback, useRef } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { editorPlugins, nord, listenerCtx } from './plugins';

interface MilkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

function MilkdownInner({ value, onChange }: MilkdownEditorProps) {
  // Keep a ref to the latest onChange so the listener closure always calls
  // the current callback without needing to recreate the editor.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const getEditor = useCallback(
    (container: HTMLElement) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, container);
          ctx.set(defaultValueCtx, value);
          nord(ctx);
          ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => {
            onChangeRef.current(markdown);
          });
        })
        .use(editorPlugins),
    // We intentionally only depend on `value` for the initial default.
    // The onChange callback is accessed via ref so the editor is not
    // recreated on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEditor(getEditor, [getEditor]);

  return <Milkdown />;
}

export default function MilkdownEditor({ value, onChange }: MilkdownEditorProps) {
  return (
    <MilkdownProvider>
      <MilkdownInner value={value} onChange={onChange} />
    </MilkdownProvider>
  );
}
