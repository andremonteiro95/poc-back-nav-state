import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import { useEffect } from 'react'
import { SESSION_STORAGE_KEY } from './constants'

const router = createBrowserRouter([
  {
    path: '/',
    element: <SearchPage />,
  },
  {
    path: '/:id',
    element: <ProfilePage />,
  },
])

const queryClient = new QueryClient()

const clearSessionStorage = () => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
}

function App() {
  // Clear session storage on page refresh
  useEffect(() => {
    window.addEventListener('beforeunload', clearSessionStorage)

    return () => {
      window.removeEventListener('beforeunload', clearSessionStorage)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto max-w-screen-lg p-8">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  )
}

export default App
