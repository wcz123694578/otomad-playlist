import { NavLink, Route, Routes } from 'react-router-dom'
import VideoPlayer from './components/VideoPlayer'
import AddVideoPage from './components/AddVideoPage'

import './App.css'

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route 
          path='/'
          element={
            <VideoPlayer/>
          } />
        <Route
          path='/add'
          element={
            <AddVideoPage/>
          }/>
      </Routes>
    </div>
  )
}

export default App
