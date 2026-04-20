import type { Place } from "~~/shared/place.type";

export function useApi() {
    const user = useUser()

    // registers a new user
    async function register(email: string, username: string): Promise<void> {
        const _response = await $fetch(
            `/api/user`, { method: "POST", body: { email, username } }
        );
    }

    // requests a otp token
    async function requestLogin(email: string): Promise<void> {
        const _response = await $fetch(
            `/api/user/requestLogin`, { method: "POST", body: { email } }
        );
    }

    // gets token using otp and mail
    async function login(email: string, otp: string): Promise<void> {
        const response = await $fetch(
            `/api/user/login`, { method: "POST", body: { email, otp } }
        );

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

        return data
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

        return data
    }

    return {
        register,
        requestLogin,
        login,
        fetchPlaces,
        searchPlaces
    }
}
