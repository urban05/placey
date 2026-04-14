export function useUserLocation() {
  return useState('userLocation', () => {
    return {
      latitude: 53.499555,
      longitude: 10.003277,
      heading: 0
    }
  })
}