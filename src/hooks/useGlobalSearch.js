import { useQuery } from '@tanstack/react-query';
import { search } from '../services/searchService';

export default function useGlobalSearch(query) {
    return useQuery({
        queryKey: ['search', query],
        queryFn: () => search(query),
        enabled: !!query,
        staleTime: 30 * 1000,
        placeholderData: (previousData) => previousData, // keepPreviousData replacement in v5
    });
}
