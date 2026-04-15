export function useVisitedPlaces() {
    return useState('visitedPlaces', () => {
        return new Set<string>()
            .add('06e69402-a025-4a09-b08e-f01877c245eb')
            .add('3eb59bcc-e6e0-4571-ba7b-97b1d6ff4275')
            .add('8c78f375-c41f-459a-bcc0-98a9e863b8de')
            .add('de4ec082-0be9-4181-af1f-9158144a9355')
            .add('a9b883fd-7949-4d21-82b9-7ca820a476c8')
            .add('74d139e2-7959-4d33-bc66-23e24ad8286f')
            .add('84f3a4a7-9aa8-484c-afb7-c8d3dbea27bc')
    });
}
