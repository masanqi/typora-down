import { $prose } from '@milkdown/utils';
import { Plugin, PluginKey } from '@milkdown/prose/state';

const key = new PluginKey('footnote-nav');

export const footnotePlugin = $prose(() => {
  return new Plugin({
    key,
    props: {
      handleDOMEvents: {
        click(view, event) {
          const target = event.target as HTMLElement;
          if (target.classList.contains('footnote-ref') || target.className === 'footnote-ref') {
            const id = target.getAttribute('data-footnote-id') || target.getAttribute('href')?.slice(1);
            if (id) {
              const def = view.dom.querySelector(`[data-footnote-id="${id}"]`);
              if (def) {
                def.scrollIntoView({ behavior: 'smooth' });
                return true;
              }
            }
          }
          return false;
        },
      },
    },
  });
});
