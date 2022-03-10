import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuItem, Button, TextField } from '@mui/material';
import axios from 'axios'
import { URL, axiosHeader as config } from '../Utils/constants'

function AddMeeting() {
  let location = useLocation();
  let history = useNavigate()

  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('00:00')
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [title, setTitle] = useState('')
  const [buildingData, setBuildingData] = useState([])

  const query = `{
    Buildings {
    name
    id
  }
  }`

  const fetchBuildingData = async () => {
    const response = await axios.post(URL, { query }, config)
    const data = response?.data?.data
    setBuildingData(data.Buildings.reduce((acc, curr) => { acc.push(curr.name); return acc }, []))
  }


  useEffect(() => {
    if (location.state) {
      setBuildingData(location.state)
    } else {
      fetchBuildingData()
    }
  }, [])

  const addMeetingHandler = () => {
    history('/freeRooms', {
      state: {
        date, startTime, endTime, selectedBuilding, title
      }
    })
  }


  return (
    <div className="meeting-container">
      <TextField
        id='date'
        value={date}
        label='Date'
        variant='outlined'
        type='date'
        onChange={(e) => setDate(e.target.value)}
        className='mb-20'
      />
      <TextField
        id="startTime"
        value={startTime}
        type="time"
        label='StartTime'
        onChange={(e) => setStartTime(e.target.value)}
        className='mb-20'

      />
      <TextField
        id="endTime"
        value={endTime}
        type="time"
        label='endTime'
        onChange={(e) => setEndTime(e.target.value)}
        className='mb-20'

      />
      <TextField
        id="title"
        value={title}
        type="text"
        label='Title'
        onChange={(e) => setTitle(e.target.value)}
        className='mb-20'

      />
      <TextField
        id="outlined-select-currency"
        select
        label="Select"
        value={selectedBuilding}
        onChange={(e) => setSelectedBuilding(e.target.value)}
        helperText="Please select your building"
        className='mb-20'

      >
        {buildingData.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Button variant='outlined' onClick={addMeetingHandler}>
        Next
      </Button>
    </div>
  )
}

export default AddMeeting
