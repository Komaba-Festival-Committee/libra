import {
  Noto_Sans_JP,
  Shippori_Mincho,
  Zen_Old_Mincho,
} from 'next/font/google';

export const zen = Zen_Old_Mincho({
  weight: ['400', '700'],
  variable: '--font-zen',
  preload: false,
});

export const sippori = Shippori_Mincho({
  weight: ['400', '700'],
  variable: '--font-sippori',
  preload: false,
});

export const noto = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  variable: '--font-noto',
  preload: false,
});
