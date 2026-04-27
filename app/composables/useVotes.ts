import type { UUID } from "crypto";

export function useVotes() {
  const votes = useState("votes", () => {
    return new Map<UUID, boolean>();
  });

  const api = useApi();
  const places = usePlacesRaw();

  async function fetch(): Promise<void> {
    const result = await api.fetchVotes();
    votes.value = result;
  }

  async function vote(placeId: UUID, vote: boolean | null): Promise<void> {
    // cache old vote
    const oldVote = votes.value.get(placeId) ?? null;

    // update vote
    await api.vote(placeId, vote);
    if (vote != null) votes.value.set(placeId, vote);
    else votes.value.delete(placeId);

    // update places for direct feedback
    places.value = places.value.map((el) => {
      if (el.id === placeId) {
        const oldVoteValue = oldVote === null ? 0 : oldVote ? 1 : -1;
        const newVoteValue = vote === null ? 0 : vote ? 1 : -1;

        return {
          ...el,
          votes: el.votes - oldVoteValue + newVoteValue,
        };
      } else {
        return el;
      }
    });
  }

  return {
    votes: readonly(votes),
    vote,
    fetch,
  };
}
