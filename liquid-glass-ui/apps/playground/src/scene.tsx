import { useEffect, useId, useRef } from 'react';
/** Original vector study, included as source; no Apple imagery or font assets. */
export function AlpineScene({ warm = false, className = '' }: { warm?: boolean; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" role="img" aria-label="原创湖泊与山脉矢量场景">
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor={warm ? '#cad3cb' : '#cddcdc'}/><stop offset=".58" stopColor={warm ? '#f7d2b7' : '#ede8d4'}/><stop offset="1" stopColor="#c8d5c9"/></linearGradient>
      <linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#abbfb2"/><stop offset=".42" stopColor="#608e82"/><stop offset="1" stopColor="#164c49"/></linearGradient>
      <linearGradient id={`${id}-mountain`} x2="1" y2="1"><stop stopColor="#74938d"/><stop offset="1" stopColor="#294f4c"/></linearGradient>
      <linearGradient id={`${id}-rock`} x2="1" y2="1"><stop stopColor="#b9c7ba"/><stop offset=".6" stopColor="#608276"/><stop offset="1" stopColor="#366159"/></linearGradient>
      <linearGradient id={`${id}-mist`} x2="0" y2="1"><stop stopColor="#f0e9d6" stopOpacity="0"/><stop offset=".7" stopColor="#e1e2cb" stopOpacity=".44"/><stop offset="1" stopColor="#e1e2cb" stopOpacity="0"/></linearGradient>
      <radialGradient id={`${id}-sun`}><stop stopColor="#fff7df" stopOpacity=".8"/><stop offset="1" stopColor="#fff7df" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="1200" height="720" fill={`url(#${id}-sky)`}/><ellipse cx="820" cy="182" rx="380" ry="270" fill={`url(#${id}-sun)`}/>
    <path d="M-20 392L80 296 132 332 232 216 303 259 371 207 488 306 543 282 649 346 721 306 822 351 898 293 955 306 1100 236 1220 299V467H-20Z" fill="#a8b9ad"/>
    <path d="M-30 399L82 320 139 352 233 237 297 280 353 240 480 355 547 320 623 369 731 332 811 389 960 323 1199 336V464H-30Z" fill="#849f94"/>
    <path d="M-40 5L40 14 172 129 220 187 294 235 307 272 420 360 423 411 498 455H-40Z" fill={`url(#${id}-mountain)`}/>
    <path d="M-20 33L152 144 210 220 278 255 316 331 382 374 339 394 278 376 242 310 191 277 128 206 72 183 30 118Z" fill="#91a399" opacity=".54"/>
    <path d="M8 31L99 155 114 237 174 266 202 352 253 373 280 430 18 445Z" fill="#325852" opacity=".6"/>
    <path d="M739 434L789 348 883 307 927 233 976 246 1009 196 1064 94 1131 77 1230 146V474Z" fill={`url(#${id}-rock)`}/>
    <path d="M912 352L952 247 979 278 1038 197 1074 98 1122 86 1104 161 1130 206 1110 271 1174 235 1210 285 1200 380Z" fill="#d6d7c1" opacity=".66"/>
    <path d="M1067 107L1043 221 996 283 982 348 919 405 1107 420 1210 348 1134 302 1161 226 1107 209 1139 115Z" fill="#4e7567" opacity=".6"/>
    <rect y="438" width="1200" height="282" fill={`url(#${id}-water)`}/>
    <path d="M0 441L300 451 503 473 480 512 350 548 274 605 164 621 113 696 0 720Z" fill="#2c6258" opacity=".33"/>
    <path d="M762 443L820 474 899 524 966 545 1037 592 1091 700 1200 720V444Z" fill="#ccceb2" opacity=".16"/>
    <g stroke="#dfe6d2" strokeWidth="1" opacity=".18"><path d="M275 484H773M440 493H984M107 513H691M612 528H1140M297 548H600M629 574H888M141 610H377M451 640H898M789 682H1200"/></g>
    <path d="M0 426Q94 405 172 429T315 439L450 448 0 471Z" fill="#245348"/>
    <path d="M1200 399Q1165 410 1129 409T1016 429L831 444 1200 467Z" fill="#385f4c"/>
    <g fill="#3a604d"><path d="M1026 435l10-40 10 40h-20M1064 430l14-64 14 64h-28M1114 422l15-72 15 72h-30M1155 419l13-59 13 59h-26M1178 415l18-85 18 85h-36"/></g>
    <rect y="357" width="1200" height="147" fill={`url(#${id}-mist)`}/>
    <path d="M0 694L53 677 118 689 141 681 215 708 235 720H0Z" fill="#173f38"/>
    <path d="M837 720L960 696 1021 708 1064 682 1128 699 1200 658V720Z" fill="#204c3e"/>
  </svg>;
}
/** Synthetic live video fixture, not a codec or device-GPU performance claim. */
export function SyntheticVideo({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!playing || !ref.current) return;
    const video = ref.current; const canvas = document.createElement('canvas'); canvas.width = 960; canvas.height = 540;
    const ctx = canvas.getContext('2d'); if (!ctx || !canvas.captureStream) return;
    let frame = 0, start = performance.now();
    const draw = (now: number) => {
      const phase = (now - start) / 1000;
      const gradient = ctx.createLinearGradient(0, 0, 960, 540); gradient.addColorStop(0, '#193f39'); gradient.addColorStop(.5 + Math.sin(phase / 3) * .2, '#b6c3a8'); gradient.addColorStop(1, '#648c78');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, 960, 540);
      for (let i = 0; i < 15; i++) { ctx.fillStyle = `rgba(249,243,210,${.05 + (i % 3) * .025})`; ctx.beginPath(); ctx.ellipse(100 + i * 75 + Math.sin(phase + i) * 80, 80 + (i % 4) * 120, 160, 60, phase / 12, 0, Math.PI * 2); ctx.fill(); }
      frame = requestAnimationFrame(draw);
    };
    draw(start); const stream = canvas.captureStream(30); video.srcObject = stream; void video.play().catch(() => {});
    return () => { cancelAnimationFrame(frame); video.pause(); stream.getTracks().forEach(track => track.stop()); video.srcObject = null; };
  }, [playing]);
  return playing ? <video ref={ref} muted autoPlay playsInline className="synthetic-video" aria-label="合成动态图案视频测试背景" /> : null;
}
