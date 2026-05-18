<script setup lang="ts">
import type { NuxtError } from '#app'
import { useMouse, useWindowSize } from '@vueuse/core'

const props = defineProps({
  error: Object as () => NuxtError,
})

/* ── Parallax ─────────────────────────────────────────────────── */
const { x, y }          = useMouse()
const { width, height } = useWindowSize()

const px = computed(() => (x.value / width.value  - 0.5) * 28)
const py = computed(() => (y.value / height.value - 0.5) * 28)

const layer = (depth: number) =>
  computed(() => ({
    transform: `translate(${px.value * depth}px, ${py.value * depth}px)`,
  }))

const l1 = layer(0.35)   // slow — background pins
const l2 = layer(0.65)   // mid  — main pin
const l3 = layer(1.0)    // fast — foreground accent

/* ── Error helpers ────────────────────────────────────────────── */
const code  = computed(() => props.error?.status ?? 500)
const is404 = computed(() => code.value === 404)

const headline = computed(() =>
  is404.value
    ? 'You wandered off the map.'
    : 'Something broke on our end.',
)

const subline = computed(() =>
  is404.value
    ? 'This spot hasn\'t been discovered yet — maybe you\'re the first explorer?'
    : 'Our crew is patching things up. Come back in a minute and try again.',
)
</script>

<!-- ═══════════════════════════════════════════════════════════════ -->
<template>
  <div class="relative min-h-dvh bg-(--ep-bg) text-(--ep-cream) [font-family:var(--f-body)] overflow-hidden flex items-center justify-center">

    <!-- ── Atmospheric background ──────────────────────────────── -->
    <div class="ep-bg-grid"  aria-hidden="true" />
    <div class="ep-bg-glow"  aria-hidden="true" />
    <div class="ep-bg-noise" aria-hidden="true" />

    <!-- ── Floating decorative pins ───────────────────────────── -->
    <span class="ep-deco ep-deco--a hidden sm:block" :style="l1" aria-hidden="true">
      <Icon name="twemoji:round-pushpin" class="ep-emoji-deco" />
    </span>
    <span class="ep-deco ep-deco--b hidden sm:block" :style="l1" aria-hidden="true">
      <Icon name="twemoji:world-map" class="ep-emoji-deco" />
    </span>
    <span class="ep-deco ep-deco--c" :style="l3" aria-hidden="true">
      <Icon name="twemoji:star" class="ep-emoji-deco" />
    </span>
    <span class="ep-deco ep-deco--d" :style="l3" aria-hidden="true">
      <Icon name="twemoji:direct-hit" class="ep-emoji-deco" />
    </span>
    <span class="ep-deco ep-deco--e" :style="l1" aria-hidden="true">
      <Icon name="twemoji:compass" class="ep-emoji-deco" />
    </span>

    <!-- ── Page shell ──────────────────────────────────────────── -->
    <div class="relative z-10 w-[min(680px,92vw)] flex flex-col items-center gap-8 pt-10 pb-2 min-h-screen">

      <!-- ── Header row: logo + app name ──────────────────────── -->
      <header class="ep-header gap-3 sm:gap-4">

        <!--
          ╔══════════════════════════════════════════════════════╗
          ║  LOGO AREA — swap the <img> below with your own      ║
          ║  1024 × 1024 asset via <NuxtImg> if preferred.       ║
          ║  The frame clips to a circle automatically.          ║
          ╚══════════════════════════════════════════════════════╝
        -->
        <div class="relative shrink-0 w-14 h-14 sm:w-[68px] sm:h-[68px]" aria-label="App logo">
          <div class="ep-logo-img-frame">
            <img src="/assets/placey-sad.webp" class="aspect-square" />
          </div>
          <!-- decorative ring pulse -->
          <span class="ep-logo-pulse" aria-hidden="true" />
        </div>

        <div class="flex flex-col gap-[0.15rem]">
          <span class="[font-family:var(--f-display)] text-[1.15rem] font-extrabold text-(--ep-cream) tracking-[-0.01em]">Placey</span>
          <span class="text-[0.72rem] font-medium text-(--ep-muted) tracking-[0.08em] uppercase">Discover · Collect · Connect</span>
        </div>
      </header>

      <!-- ── Main error content ─────────────────────────────── -->
      <main class="ep-main" :style="l2">

        <!-- Big lost-pin illustration -->
        <div class="relative flex items-end justify-center mb-2" aria-hidden="true">
          <div class="ep-shadow-blob" />
          <div class="ep-pin-wrap inline-flex">
            <Icon name="lucide:map-pin-off" class="ep-big-pin min-w-10 min-h-10" />
            <span class="absolute top-[-10px] right-[-18px] [font-family:var(--f-display)] text-[0.72rem] font-extrabold leading-none px-2 py-[3px] rounded-full bg-(--ep-amber) text-[#0B0F1A] tracking-[0.02em] [box-shadow:0_2px_10px_rgba(246,166,35,0.4)]">{{ code }}</span>
          </div>
        </div>

        <!-- Copy -->
        <h1 class="[font-family:var(--f-display)] text-[clamp(1.85rem,5.5vw,2.65rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-(--ep-cream) max-w-[520px]">
          {{ headline }}&nbsp;<Icon name="twemoji:world-map" class="inline-block w-[0.9em] h-[0.9em] align-[-0.1em]" />
        </h1>
        <p class="text-[clamp(0.88rem,2.2vw,1rem)] font-medium leading-[1.65] text-(--ep-muted) max-w-[440px]">{{ subline }}</p>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3 justify-center mt-2">
          <NuxtLink to="/" class="ep-btn ep-btn--primary">
            <Icon name="lucide:compass" class="ep-btn-icon" />
            Back to the map
          </NuxtLink>
          <button class="ep-btn ep-btn--ghost" @click="$router.go(-1)">
            <Icon name="lucide:arrow-left" class="ep-btn-icon" />
            Go back
          </button>
        </div>

        <!-- Fun collector nudge -->
        <p v-if="is404" class="ep-nudge">
          <Icon name="twemoji:sparkles" class="ep-nudge-emoji" />
          Found an uncharted spot? Add it and earn your first pin badge.
          <Icon name="twemoji:round-pushpin" class="ep-nudge-emoji" />
        </p>
      </main>

      <!-- ── Footer ─────────────────────────────────────────── -->
      <footer class="grow flex items-end">
        <div class="ep-footer">
          <span>Error&nbsp;{{ code }}</span>
          <span class="w-[3px] h-[3px] rounded-full bg-current shrink-0" aria-hidden="true" />
          <span>Made with care for your neighbourhood</span>
        </div>
      </footer>

    </div><!-- /shell -->
  </div><!-- /root -->
</template>

<!-- ═══════════════════════════════════════════════════════════════ -->
<style scoped>
/* ── Design tokens ─────────────────────────────────────────────── */
:root {
  --ep-bg:        #0B0F1A;
  --ep-surface:   #131824;
  --ep-border:    rgba(255 255 255 / 0.07);
  --ep-cream:     #F0E8D0;
  --ep-muted:     #8090A8;
  --ep-amber:     #F6A623;
  --ep-amber-dim: rgba(246, 166, 35, 0.12);
  --ep-coral:     #FF6B6B;
  --ep-coral-dim: rgba(255, 107, 107, 0.12);
  --ep-teal:      #4ECDC4;
  --ep-teal-dim:  rgba(78, 205, 196, 0.12);
  --ep-glow:      rgba(246, 166, 35, 0.18);

  --f-display: 'Syne', sans-serif;
  --f-body:    'Nunito', sans-serif;
}

/* ── Atmospheric layers ─────────────────────────────────────────── */
/* kept: multi-gradient / data-URI — unreadable as Tailwind arbitrary values */
.ep-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--ep-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--ep-border) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.ep-bg-glow {
  position: absolute; inset: 0;
  background: radial-gradient(
    ellipse 65% 55% at 52% 48%,
    var(--ep-glow) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.ep-bg-noise {
  position: absolute; inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* ── Floating deco pins ─────────────────────────────────────────── */
/* kept: each deco--* references the ep-bob @keyframes by name */
.ep-deco {
  position: absolute;
  will-change: transform;
  transition: transform 0.12s ease-out;
  pointer-events: none;
  user-select: none;
}

.ep-deco--a { top: 12%;    left: 8%;  animation: ep-bob 4.2s ease-in-out infinite; }
.ep-deco--b { top: 22%;   right: 7%; animation: ep-bob 3.8s ease-in-out infinite 0.6s; }
.ep-deco--c { bottom: 28%; left: 12%; animation: ep-bob 5s   ease-in-out infinite 1.1s; }
.ep-deco--d { bottom: 16%; right: 9%; animation: ep-bob 4.6s ease-in-out infinite 0.3s; }
.ep-deco--e { top: 55%;    left: 4%;  animation: ep-bob 3.5s ease-in-out infinite 1.7s; }

@keyframes ep-bob {
  0%, 100% { translate: 0   0;    }
  50%       { translate: 0  -10px; }
}

/* ── Twemoji icons ──────────────────────────────────────────────── */
/* kept: ep-emoji-deco used on 5 elements, ep-nudge-emoji on 2 */
.ep-emoji-deco {
  display: block;
  width: 30px;
  height: 30px;
  opacity: 0.72;
  filter: drop-shadow(0 2px 6px rgba(0 0 0 / 0.4));
}

.ep-nudge-emoji {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.12em;
  flex-shrink: 0;
}

/* ── Header ─────────────────────────────────────────────────────── */
/* kept: references ep-fadein @keyframes */
.ep-header {
  width: 100%;
  display: flex;
  align-items: center;
  animation: ep-fadein 0.6s ease both;
}

/* ── Logo frame ─────────────────────────────────────────────────── */
/* kept: has a :deep(img) child selector for the logo <img> */
.ep-logo-img-frame {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--ep-amber);
  background: var(--ep-surface);
  box-shadow:
    0 0 0 4px var(--ep-amber-dim),
    0 4px 20px rgba(0 0 0 / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ep-logo-img-frame :deep(img),
.ep-logo-img-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  display: block;
}

/* kept: animation + prefers-reduced-motion */
.ep-logo-pulse {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1.5px solid var(--ep-amber);
  opacity: 0;
  animation: ep-pulse-ring 2.8s ease-out infinite 1s;
  pointer-events: none;
}

@keyframes ep-pulse-ring {
  0%   { opacity: 0.5; transform: scale(1);    }
  100% { opacity: 0;   transform: scale(1.38); }
}

/* ── Main content ───────────────────────────────────────────────── */
/* kept: animation + will-change + prefers-reduced-motion */
.ep-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
  will-change: transform;
  transition: transform 0.1s ease-out;
  animation: ep-fadein 0.7s ease 0.1s both;
}

/* ── Illustration ───────────────────────────────────────────────── */
/* kept: animation + prefers-reduced-motion */
.ep-shadow-blob {
  position: absolute;
  bottom: -8px;
  width: 90px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%);
  animation: ep-blob 3.2s ease-in-out infinite;
}

@keyframes ep-blob {
  0%, 100% { transform: scaleX(1);    opacity: 0.5; }
  50%       { transform: scaleX(0.75); opacity: 0.3; }
}

/* kept: animation + prefers-reduced-motion */
.ep-pin-wrap {
  position: relative;
  animation: ep-pin-drop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}

@keyframes ep-pin-drop {
  from { opacity: 0; transform: translateY(-30px) scale(0.7); }
  to   { opacity: 1; transform: translateY(0)     scale(1);   }
}

/* kept: animation + filter + prefers-reduced-motion */
.ep-big-pin {
  color: var(--ep-coral);
  filter: drop-shadow(0 0 24px rgba(255, 107, 107, 0.45));
  animation: ep-pin-tilt 4s ease-in-out infinite 0.8s;
}

@keyframes ep-pin-tilt {
  0%, 100% { rotate: -4deg; }
  50%       { rotate:  4deg; }
}

/* ── Action buttons ─────────────────────────────────────────────── */
/* kept: ep-btn shared across 3 elements; ep-btn--primary/:ghost have
   :hover and :active pseudo-selectors */
.ep-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  border-radius: 99px;
  font-family: var(--f-body);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  user-select: none;
}

.ep-btn:active { transform: scale(0.96); }

.ep-btn--primary {
  background: var(--ep-amber);
  color: #0B0F1A;
  box-shadow: 0 4px 20px rgba(246, 166, 35, 0.35);
}

.ep-btn--primary:hover {
  background: #F9B93A;
  box-shadow: 0 6px 28px rgba(246, 166, 35, 0.5);
  transform: translateY(-1px);
}

.ep-btn--ghost {
  background: var(--ep-border);
  color: var(--ep-cream);
  border: 1.5px solid rgba(255 255 255 / 0.1);
}

.ep-btn--ghost:hover {
  background: rgba(255 255 255 / 0.07);
  border-color: rgba(255 255 255 / 0.2);
  transform: translateY(-1px);
}

.ep-btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ── Discovery nudge ────────────────────────────────────────────── */
/* kept: references ep-nudge-in @keyframes */
.ep-nudge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ep-teal);
  background: var(--ep-teal-dim);
  border: 1px solid rgba(78, 205, 196, 0.18);
  border-radius: 99px;
  padding: 0.45rem 1rem;
  margin-top: 0.25rem;
  animation: ep-nudge-in 0.5s ease 0.9s both;
}

@keyframes ep-nudge-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

/* ── Footer ─────────────────────────────────────────────────────── */
/* kept: references ep-fadein @keyframes */
.ep-footer {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.73rem;
  font-weight: 500;
  color: rgba(128, 144, 168, 0.55);
  letter-spacing: 0.03em;
  animation: ep-fadein 0.6s ease 0.4s both;
}

/* ── Shared animations ──────────────────────────────────────────── */
@keyframes ep-fadein {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .ep-deco,
  .ep-big-pin,
  .ep-pin-wrap,
  .ep-shadow-blob,
  .ep-logo-pulse { animation: none !important; }

  .ep-main { transition: none !important; }
}
</style>