import { SESSION_STORAGE_KEY } from '@/constants'
import { useInfiniteQuery } from '@tanstack/react-query'
import ky from 'ky'
import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigationType } from 'react-router-dom'
import { useSessionStorage, useSet } from 'react-use'

const PAGE_SIZE = 20

const SearchPage = () => {
  const navigationType = useNavigationType()
  const { state } = useLocation()

  const shouldRestoreState = navigationType === 'POP' || state?.backLinkPressed

  const [storage, setStorage] = useSessionStorage<string[]>(SESSION_STORAGE_KEY)

  const [selectedPokemon, { toggle: toggleSelectedPokemon }] = useSet<string>(
    shouldRestoreState && storage ? new Set(storage) : undefined
  )

  useEffect(() => {
    setStorage(Array.from(selectedPokemon))
  }, [selectedPokemon, setStorage])

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['search'],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await ky.get('https://pokeapi.co/api/v2/pokemon', {
        searchParams: {
          limit: PAGE_SIZE,
          offset: PAGE_SIZE * (pageParam - 1),
        },
      })
      return await data.json<{
        count: number
        next: string | null
        previous: string | null
        results: any[]
      }>()
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined
    },
  })

  const pokemonList = useMemo(() => {
    return data?.pages.map((page) => page.results).flat()
  }, [data])

  return (
    <div className="mx-auto">
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div className="grid grid-cols-3 gap-8">
          {pokemonList?.map((pokemon) => (
            <div
              key={pokemon.name}
              className="card bg-neutral text-neutral-content"
            >
              <div className="card-body">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox mr-2"
                    checked={selectedPokemon.has(pokemon.name)}
                    onChange={() => {
                      toggleSelectedPokemon(pokemon.name)
                    }}
                  />

                  <Link to={pokemon.name} className="card-title capitalize">
                    {pokemon.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            className="btn btn-primary"
            disabled={isLoading}
            onClick={() => {
              fetchNextPage()
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}

export default SearchPage
