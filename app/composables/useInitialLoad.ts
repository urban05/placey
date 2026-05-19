// composables/useInitialLoad.ts
export const useInitialLoad = () => {
  // useState persists between SSR and client hydration
  // so the server renders it as `true`, and the HTML already contains the overlay
  const _mapReady = useState('il-map', () => false);
  const _tailwindReady = useState('il-tailwind', () => false);

  const isLoading = computed(() => !_mapReady.value && !_tailwindReady.value);

  // AI claims this can detect when tailwind finished loading
  function watchTailwind() {
    const el = document.createElement('div');
    el.className = 'hidden';
    el.style.position = 'absolute';
    document.body.appendChild(el);

    function check() {
      if (window.getComputedStyle(el).display === 'none') {
        document.body.removeChild(el);
        finishTailwind();
      } else {
        requestAnimationFrame(check);
      }
    }
    requestAnimationFrame(check);
  }

  function finishMap() { _mapReady.value = true; }
  function finishTailwind() { _tailwindReady.value = true; }

  return { isLoading, watchTailwind, finishMap, finishTailwind }
}