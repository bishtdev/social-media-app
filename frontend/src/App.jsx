import { useSelector } from 'react-redux'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CreatePost from './pages/CreatePost'
import SinglePost from './pages/SinglePost'
import EditPost from './pages/EditPost'
import UserProfile from './pages/UserProfile'
import SearchUser from './pages/SearchUser'
import Bookmark from './pages/Bookmark'

function App() {
  
  const ProtectedRoute = ({children}) =>{
    const {token} = useSelector((state) => state.auth)
    return token ? children : <Navigate to="/login"/>
  }

  return (
 
     <Router>
    
      <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts/:id" element={<SinglePost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path='/users/:id' element={<UserProfile/>}/>
        <Route path="/search" element={<SearchUser   />} />
        <Route path="/bookmarks" element={<Bookmark   />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }/>
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>    
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
