export function useBucketUrl() {
    const { fetchBucketUrl } = useApi();

    const { data: bucketUrl, pending, error, refresh } = useAsyncData(
        "bucketUrl",
        fetchBucketUrl
    );

    return { bucketUrl, pending, error, refresh };
}