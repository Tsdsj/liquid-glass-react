import { useEffect, useId, useRef } from 'react';

/** The two ridges and the two headlands, kept in one place because the lake reflects them. */
const RIDGE_A = 'M-20 392L80 296 132 332 232 216 303 259 371 207 488 306 543 282 649 346 721 306 822 351 898 293 955 306 1100 236 1220 299V467H-20Z';
const RIDGE_B = 'M-30 399L82 320 139 352 233 237 297 280 353 240 480 355 547 320 623 369 731 332 811 389 960 323 1199 336V464H-30Z';
const PEAK_LEFT = 'M-40 5L40 14 172 129 220 187 294 235 307 272 420 360 423 411 498 455H-40Z';
const PEAK_RIGHT = 'M739 434L789 348 883 307 927 233 976 246 1009 196 1064 94 1131 77 1230 146V474Z';

/**
 * How far the reflection is squashed. A viewer standing at the shore sees a reflection very
 * nearly as tall as the thing itself; the slight squash is what stops it reading as a mirror
 * laid flat. It also decides how deep into the lake the ridge edges reach, and those edges are
 * the contrast — `y' = 438 + REFLECT · (438 − y)`.
 */
const REFLECT = 0.92;

/**
 * The near water, where the reflection has nothing left in it.
 *
 * A mirror lake is smooth exactly where the controls float — the reflected ridges are up by the
 * shoreline and below them is an even wash. These are the catches of light on the swell in the
 * foreground: long, thin, wildly uneven, and pushed through the same ripple filter as the
 * reflection, so they come out as wavering lines rather than the row of dashes an evenly
 * spaced version of this looked like on the first attempt.
 *
 * Integer mixing, not `Math.sin`: the only thing these must not do is come out differently in
 * Node and in the browser, and every step here is exact in 32 bits.
 */
/** Deterministic everywhere. Node and the browser have to draw the same lake, to the pixel. */
const mix = (n: number) => {
  let h = Math.imul(n + 1, 2654435761) >>> 0;
  h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
};
const round = (value: number) => Math.round(value * 10) / 10;

/**
 * The conifers along the far shore, as one path.
 *
 * Alpine lakes have them and the scene did not — it had five, in the right-hand corner. They
 * are also the sharpest thing in the picture and they sit exactly on the waterline, which is
 * the band the floating glass crosses. Fifty thin dark triangles against a pale lake is the
 * kind of backdrop that makes refraction legible: a rim passing over them visibly kinks the
 * trunks, where over a gradient it has nothing to kink.
 */
const TREES = (() => {
  let d = '';
  let x = -14;
  for (let i = 0; x < 1214; i++) {
    const wide = mix(i * 5 + 1), tall = mix(i * 5 + 2), gap = mix(i * 5 + 3);
    /* Taller and denser toward the middle distance, thinning out at the two headlands where
       the rock comes down to the water. */
    const middle = 1 - Math.min(1, Math.abs(x - 560) / 760);
    const w = round(3.4 + wide * 5.2 + middle * 2.4);
    const h = round(13 + tall * 34 + middle * 20);
    const base = round(439 + mix(i * 5 + 4) * 2);
    d += `M${round(x - w)} ${base}L${round(x)} ${round(base - h)}L${round(x + w)} ${base}Z`;
    x = round(x + w * (0.85 + gap * 1.5) + 2);
  }
  return d;
})();

const SWELL = (() => {
  const out: { x: number; y: number; w: number; h: number; lit: boolean; o: number }[] = [];
  /* Laid out in rows so that every part of the near water gets some, then jittered in both
     axes and bent by the filter. Purely random placement left whole stretches empty — including,
     on the first go, the stretch the controls happen to float over. */
  for (let row = 0; row < 17; row++) {
    const depth = row / 16;                        // 0 at the reflected shore, 1 at the near edge
    const band = 492 + depth * depth * 226;
    for (let i = 0; i < 5; i++) {
      const seed = row * 23 + i * 7;
      const w = round((110 + mix(seed + 5) * 190) * (.55 + depth * .8));
      out.push({
        x: round(-70 + ((i + mix(seed + 3) * .9 - .45) / 4.4) * 1290),
        y: round(band + (mix(seed + 1) - .5) * 15),
        w, h: round(1.2 + depth * 2.6 + mix(seed + 9) * 1.3),
        lit: (row + i) % 3 !== 2,                  // two catches of light to every trough
        o: round(.19 + depth * .32 + mix(seed + 2) * .16),
      });
    }
  }
  return out;
})();

/** Original vector study, included as source; no Apple imagery or font assets. */
export function AlpineScene({ warm = false, className = '' }: { warm?: boolean; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" role="img" aria-label="原创湖泊与山脉矢量场景">
    <defs>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor={warm ? '#cad3cb' : '#cddcdc'}/><stop offset=".58" stopColor={warm ? '#f7d2b7' : '#ede8d4'}/><stop offset="1" stopColor="#c8d5c9"/></linearGradient>
      <linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#abbfb2"/><stop offset=".42" stopColor="#4f8478"/><stop offset="1" stopColor="#164c49"/></linearGradient>
      <linearGradient id={`${id}-mountain`} x2="1" y2="1"><stop stopColor="#74938d"/><stop offset="1" stopColor="#294f4c"/></linearGradient>
      <linearGradient id={`${id}-rock`} x2="1" y2="1"><stop stopColor="#b9c7ba"/><stop offset=".6" stopColor="#608276"/><stop offset="1" stopColor="#366159"/></linearGradient>
      <linearGradient id={`${id}-mist`} x2="0" y2="1"><stop stopColor="#f0e9d6" stopOpacity="0"/><stop offset=".7" stopColor="#e1e2cb" stopOpacity=".44"/><stop offset="1" stopColor="#e1e2cb" stopOpacity="0"/></linearGradient>
      <radialGradient id={`${id}-sun`}><stop stopColor="#fff7df" stopOpacity=".8"/><stop offset="1" stopColor="#fff7df" stopOpacity="0"/></radialGradient>
      <clipPath id={`${id}-lake`}><rect y="438" width="1200" height="282"/></clipPath>
      {/* Ripples, as one filter rather than a few hundred little rectangles. The noise is
          stretched wide and short — a long wavelength across, a short one down — so each thin
          horizontal slice of the reflection is pushed a different way and the mountains come
          apart into bands, which is what a reflection on moving water does. `feTurbulence`
          has a specified generator, so this is the same lake in every engine. */}
      <filter id={`${id}-ripple`} x="-4%" y="-2%" width="108%" height="104%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.055" numOctaves="2" seed="7" result="swell"/>
        <feDisplacementMap in="SourceGraphic" in2="swell" scale="24" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
    <rect width="1200" height="720" fill={`url(#${id}-sky)`}/><ellipse cx="820" cy="182" rx="380" ry="270" fill={`url(#${id}-sun)`}/>
    <path d={RIDGE_A} fill="#a8b9ad"/>
    <path d={RIDGE_B} fill="#849f94"/>
    <path d={PEAK_LEFT} fill={`url(#${id}-mountain)`}/>
    <path d="M-20 33L152 144 210 220 278 255 316 331 382 374 339 394 278 376 242 310 191 277 128 206 72 183 30 118Z" fill="#91a399" opacity=".54"/>
    <path d="M8 31L99 155 114 237 174 266 202 352 253 373 280 430 18 445Z" fill="#325852" opacity=".6"/>
    <path d={PEAK_RIGHT} fill={`url(#${id}-rock)`}/>
    <path d="M912 352L952 247 979 278 1038 197 1074 98 1122 86 1104 161 1130 206 1110 271 1174 235 1210 285 1200 380Z" fill="#d6d7c1" opacity=".66"/>
    <path d="M1067 107L1043 221 996 283 982 348 919 405 1107 420 1210 348 1134 302 1161 226 1107 209 1139 115Z" fill="#4e7567" opacity=".6"/>
    <rect y="438" width="1200" height="282" fill={`url(#${id}-water)`}/>
    {/**
      * The lake reflects what is above it, and then the ripples take the reflection apart.
      *
      * This is the whole of the water's texture — there is no second system of drawn ripple
      * lines, because a reflection broken by a swell already *is* ripples, and it is the one
      * that has the mountains' edges in it. Those edges are also what the overview page's
      * refraction switch needs: bending a smooth vertical gradient bends nothing, and that is
      * what the lake used to be below the shoreline. Measured, before and after: throwing the
      * switch moves the pixels under the floating bar by 4.8/255 per channel, against 0.97 when
      * the water was a wash. `docs.spec.ts` holds that floor.
      *
      * The sun is reflected too, and its broken column is the glitter — the same primitive as
      * the sun itself rather than a second invention that has to be kept in step with it. It is
      * dimmer than the sun proper: a brighter lake pushed the white glyphs on the glass down to
      * 4.99:1, and the floor for those is 4.5. The two numbers are tuned against each other.
      *
      * Clipped by a wrapper rather than on the transformed group: with both on one element the
      * clip would have to be reasoned about in whichever space the renderer applies it in.
      */}
    <g clipPath={`url(#${id}-lake)`}>
      <g transform={`translate(0 ${438 * (1 + REFLECT)}) scale(1 -${REFLECT})`}
        filter={`url(#${id}-ripple)`}>
        <ellipse cx="820" cy="182" rx="400" ry="250" fill={`url(#${id}-sun)`} opacity=".38"/>
        <path d={RIDGE_A} fill="#a8b9ad" opacity=".62"/>
        <path d={RIDGE_B} fill="#849f94" opacity=".66"/>
        <path d={PEAK_LEFT} fill={`url(#${id}-mountain)`} opacity=".6"/>
        <path d={PEAK_RIGHT} fill={`url(#${id}-rock)`} opacity=".58"/>
        {/* Upside down with everything else, and the ripple takes them apart into the band of
            broken dark just under the shore. */}
        <path d={TREES} fill="#1e4740" opacity=".7"/>
      </g>
    </g>
    <g clipPath={`url(#${id}-lake)`} filter={`url(#${id}-ripple)`}>
      {SWELL.map((streak, index) => <rect key={index} x={streak.x} y={streak.y}
        width={streak.w} height={streak.h} rx={streak.h / 2}
        fill={streak.lit ? '#f4f8ea' : '#0a3634'} opacity={streak.o}/>)}
    </g>
    {/* Depth over the top of it: the water darkens toward the near shore whatever it reflects. */}
    <path d="M0 441L300 451 503 473 480 512 350 548 274 605 164 621 113 696 0 720Z" fill="#2c6258" opacity=".42"/>
    <path d="M762 443L820 474 899 524 966 545 1037 592 1091 700 1200 720V444Z" fill="#ccceb2" opacity=".12"/>
    <path d="M0 426Q94 405 172 429T315 439L450 448 0 471Z" fill="#245348"/>
    <path d="M1200 399Q1165 410 1129 409T1016 429L831 444 1200 467Z" fill="#385f4c"/>
    <rect y="357" width="1200" height="147" fill={`url(#${id}-mist)`}/>
    {/* After the mist, not before it. Atmosphere would be the honest order and it costs the one
        thing this line is here for: the tree line is the crispest edge in the picture, and a
        crisp edge is what a glass rim has to bend for anyone to see that it bends at all. */}
    <path d={TREES} fill="#1c4239"/>
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
