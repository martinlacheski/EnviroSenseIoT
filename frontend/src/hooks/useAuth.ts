import { getUser } from '@/api/auth/AuthAPI'
import { useQuery } from '@tanstack/react-query'

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
        refetchOnWindowFocus: false
    })

    return { data, isError, isLoading }
}