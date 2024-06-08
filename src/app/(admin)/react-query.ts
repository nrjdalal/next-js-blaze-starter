import { useQuery } from '@tanstack/react-query'

export const QueryUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/db/users')
      return response.json()
    },
  })
}
