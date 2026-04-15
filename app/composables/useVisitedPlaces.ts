export function useVisitedPlaces() {
    return useState('visitedPlaces', () => {
        return new Set<string>()
            .add('06e69402-a025-4a09-b08e-f01877c245eb')
            .add('de4ec082-0be9-4181-af1f-9158144a9355')
            .add('a9b883fd-7949-4d21-82b9-7ca820a476c8')
            .add('84f3a4a7-9aa8-484c-afb7-c8d3dbea27bc')
    });
}
