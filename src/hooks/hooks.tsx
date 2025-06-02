import { useQuery } from "@tanstack/react-query";

type FetchFn<T> = (id: string) => Promise<T[]>;

export function useGistListQuery<T>(
  key: string,
  id?: string,
  fetchFn?: FetchFn<T>
) {
  return useQuery<T[]>({
    queryKey: [key, id],
    queryFn: () => fetchFn!(id!),
    enabled: !!id && !!fetchFn,
  });
}
