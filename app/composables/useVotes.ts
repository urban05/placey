export function useVotes() {
    return useState('votes', () => {
        return new Map<string, boolean>();
    });
}
