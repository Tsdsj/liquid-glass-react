import type { CSSProperties } from 'react';
const paths: Record<string, string> = {
  play: 'M8 5l11 7-11 7z', pause: 'M8 5v14M16 5v14',
  next: 'M5 5l10 7-10 7zM19 5v14', previous: 'M19 5L9 12l10 7zM5 5v14',
  heart: 'M20.5 4.8a5.5 5.5 0 0 0-7.8 0L12 5.5l-.7-.7a5.5 5.5 0 0 0-7.8 7.8L12 21l8.5-8.4a5.5 5.5 0 0 0 0-7.8z',
  volume: 'M11 5L6 9H2v6h4l5 4zM16 8a6 6 0 0 1 0 8M19 4a11 11 0 0 1 0 16',
  tune: 'M4 7h16M4 17h16M8 4v6M16 14v6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  sun: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20 14.4A8.5 8.5 0 0 1 9.6 4a8.5 8.5 0 1 0 10.4 10.4z',
  code: 'M8 6l-6 6 6 6M16 6l6 6-6 6M14 3l-4 18',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  check: 'M5 12l4 4L19 6', close: 'M6 6l12 12M18 6L6 18',
  copy: 'M9 9h11v11H9zM15 5V3H3v12h2',
  download: 'M12 3v12M7 10l5 5 5-5M4 16v5h16v-5',
  expand: 'M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5',
  shrink: 'M3 8h5V3M16 3v5h5M21 16h-5v5M8 21v-5H3',
  layer: 'M12 3l10 6-10 6L2 9zM2 13l10 6 10-6M2 17l10 6 10-6',
  info: 'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  shield: 'M12 2l9 4v6c0 6-9 10-9 10S3 18 3 12V6zM8 12l3 3 5-6',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
};
export function Icon({ name, size = 20, style }: { name: string; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={name === 'more' ? 3.5 : 1.65} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={style}><path d={paths[name] ?? paths.layer} /></svg>;
}
