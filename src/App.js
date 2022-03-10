import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import AddMeeting from './Meeting/AddMeeting'
import FreeRooms from './Room/FreeRooms'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/addmeeting" element={<AddMeeting />} />
        <Route path="/freeRooms" element={<FreeRooms />} />

      </Routes>
    </Router>
  )
}

export default App
