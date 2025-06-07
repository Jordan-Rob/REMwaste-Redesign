import { useQuery } from "@tanstack/react-query";
import { Skip, LocationParams } from "@/lib/types";

export function useSkips(params: LocationParams = {}) {
  return useQuery<Skip[]>({
    queryKey: ["/api/skips/by-location", params.postcode, params.area],
    queryFn: async () => {
      if (!params.postcode) {
        throw new Error("Postcode is required");
      }
      
      const searchParams = new URLSearchParams();
      searchParams.append('postcode', params.postcode);
      if (params.area) {
        searchParams.append('area', params.area);
      }
      
      const response = await fetch(`/api/skips/by-location?${searchParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!params.postcode,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
