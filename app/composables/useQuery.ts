export function useQuery() {
  return useState<string>("query", () => "");
}
