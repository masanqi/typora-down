import { $prose } from '@milkdown/utils';
import { Plugin, PluginKey } from '@milkdown/prose/state';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'default' });

const key = new PluginKey('mermaid-renderer');

export const mermaidPlugin = $prose(() => {
  return new Plugin({
    key,
    view: () => ({
      update(view) {
        const codeBlocks = view.dom.querySelectorAll('pre code.language-mermaid');
        codeBlocks.forEach(async (block) => {
          const pre = block.parentElement;
          if (!pre || pre.dataset.mermaidRendered) return;
          pre.dataset.mermaidRendered = 'true';
          try {
            const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const { svg, bindFunctions } = await mermaid.render(id, block.textContent || '');
            const container = document.createElement('div');
            container.className = 'mermaid-output';
            container.innerHTML = svg;
            bindFunctions?.(container);
            pre.replaceWith(container);
          } catch {
            // leave as raw code on parse error
          }
        });
      },
    }),
  });
});
