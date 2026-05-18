// composables/useInitialLoad.ts
export const useInitialLoad = () => {
  // useState persists between SSR and client hydration
  // so the server renders it as `true`, and the HTML already contains the overlay
  const isLoading = useState('initial-loading', () => true)

  const finish = () => {
    isLoading.value = false
  }

  return { isLoading, finish }
}