import type { UUID } from "crypto";
import type { Place } from "~~/shared/place.type";

export function useApi() {
  const user = useUser();

  // registers a new user
  async function register(email: string, username: string): Promise<void> {
    const _response = await $fetch(`/api/user`, {
      method: "POST",
      body: { email, username },
    });
  }

  // requests a otp token
  async function requestLogin(email: string): Promise<void> {
    const _response = await $fetch(`/api/user/requestLogin`, {
      method: "POST",
      body: { email },
    });
  }

  // gets token using otp and mail
  async function login(email: string, otp: string): Promise<void> {
    const response = await $fetch(`/api/user/login`, {
      method: "POST",
      body: { email, otp },
    });

    user.value = response;
  }

  // query places by location
  async function fetchPlaces(location: {
    latitude: number;
    longitude: number;
  }): Promise<Place[]> {
    const data = await $fetch<Place[]>(
      `/api/places?latitude=${location.latitude.toFixed(6)}&longitude=${location.longitude.toFixed(6)}`,
    );

    return data;
  }

  // query places by location and searchterm
  async function searchPlaces(
    location: {
      latitude: number;
      longitude: number;
    },
    query: string,
  ): Promise<Place[]> {
    const data = await $fetch<Place[]>(
      `/api/places/search?q=${query}&latitude=${location.latitude.toFixed(6)}&longitude=${location.longitude.toFixed(6)}`,
    );

    return data;
  }

  // query places by visited uuids array
  async function fetchVisitedPlaces(): Promise<Place[]> {
    if (!user.value) throw "must be logged in";

    const data = await $fetch<Place[]>("/api/places/visited", {
      method: "GET", headers: {
        authorization: `Bearer ${user.value?.token}`,
      },
    });
    return data;
  };

  // fetch own votes
  async function fetchVotes(): Promise<Map<UUID, boolean>> {
    if (!user.value) throw "must be logged in";

    const data = await $fetch<
      {
        placeid: UUID;
        vote: boolean;
      }[]
    >(`/api/votes`, {
      headers: {
        authorization: `Bearer ${user.value?.token}`,
      },
    });

    const result = new Map();

    for (const vote of data) {
      result.set(vote.placeid, vote.vote);
    }

    return result;
  }

  // sets a vote
  async function vote(placeId: UUID, vote: boolean | null): Promise<void> {
    if (!user.value) throw "must be logged in";

    const response = await $fetch(`/api/votes`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${user.value?.token}`,
      },
      body: {
        placeId,
        vote,
      },
    });
  }

  // gets the objectstorage bucket url
  async function fetchBucketUrl(): Promise<string> {
    const response = await $fetch(`/api/bucket`, {
      method: "GET"
    });

    if (!response) throw "error fetching bucket url";
    return response
  }

  return {
    register,
    requestLogin,
    login,
    fetchPlaces,
    searchPlaces,
    fetchVisitedPlaces,
    fetchVotes,
    vote,
    fetchBucketUrl
  };
}
