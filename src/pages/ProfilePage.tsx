import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import { Link, useParams } from 'react-router-dom'

const ProfilePage = () => {
  const { id } = useParams()

  const { data: pokemon, isLoading } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: async () => {
      const data = await ky.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      return await data.json<any>()
    },
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link to="/" state={{ backLinkPressed: true }}>
              Home
            </Link>
          </li>
          <li className="capitalize">{pokemon.name}</li>
        </ul>
      </div>
      <div className="flex">
        <div className="avatar">
          <div className="w-48 rounded">
            <img src={pokemon.sprites.front_default} />
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center">
          <p className="text-gray-500 text-sm">
            #{pokemon.id.toString().padStart(3, '0')}
          </p>
          <h1 className="text-4xl capitalize">{pokemon.name}</h1>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
