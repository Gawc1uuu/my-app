import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import { Navbar } from './components/Navbar'
import useAuthContext from './hooks/useAuthContext'
function App() {

  const { user } = useAuthContext()

  console.log(user)

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignupForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
