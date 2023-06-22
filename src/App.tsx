import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto max-w-screen-lg p-8">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  )
}

export default App
