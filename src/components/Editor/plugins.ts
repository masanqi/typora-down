import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { prism } from '@milkdown/plugin-prism';
import { history } from '@milkdown/plugin-history';
import { clipboard } from '@milkdown/plugin-clipboard';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { nord } from '@milkdown/theme-nord';

import type { MilkdownPlugin } from '@milkdown/ctx';

/**
 * Flat plugin list for the Milkdown editor.
 *
 * - `commonmark`, `gfm`, `prism`, `history` are `MilkdownPlugin[]`
 * - `clipboard`, `listener` are individual `MilkdownPlugin` (not arrays)
 * - `nord` is a theme config function `(ctx: Ctx) => void`, applied
 *   inside `.config()` — it is NOT a plugin and must not go in this array.
 */
export const editorPlugins: MilkdownPlugin[] = [
  ...commonmark,
  ...gfm,
  ...prism,
  ...history,
  clipboard,
  listener,
];

export { nord, listenerCtx };
