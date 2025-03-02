import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import { Navbar } from './components/Navbar'
import useAuthContext from './hooks/useAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import PublicRoute from './components/PublicRoute'
function App() {

  const { user } = useAuthContext()

  console.log(user)

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/login' element={<PublicRoute><LoginForm /></PublicRoute>} />
          <Route path='/signup' element={<PublicRoute><SignupForm /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
