import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { prism, prismConfig } from '@milkdown/plugin-prism';
import { history } from '@milkdown/plugin-history';
import { clipboard } from '@milkdown/plugin-clipboard';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { nord } from '@milkdown/theme-nord';

import type { MilkdownPlugin, Ctx } from '@milkdown/ctx';
import type { Refractor } from 'refractor/core';

import { mermaidPlugin } from './mermaidPlugin';
import { footnotePlugin } from './footnotePlugin';

function configureNord(ctx: Ctx) {
  nord(ctx);
  ctx.set(prismConfig.key, {
    configureRefractor: (refractor: Refractor) => refractor,
  });
}

export const editorPlugins: MilkdownPlugin[] = [
  ...commonmark,
  ...gfm,
  ...prism,
  ...history,
  clipboard,
  listener,
  mermaidPlugin,
  footnotePlugin,
];

export { configureNord, listenerCtx };
