import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate  } from 'react-router-dom'
import { URL, axiosHeader as config } from '../Utils/constants'
import { dateEquals, checkIntervalLiesBtwGivenTimes } from '../Utils/utils'
import { Button } from '@mui/material'
function Home() {
  let history = useNavigate ()
  const [buildingName,setBuildingName] = useState([])
  const [buildingCount, setBuildingCount] = useState(0)
  const [totalMeetingRooms, setTotalMeetingRooms] = useState(0)
  const [availableMeetingRooms, setAvailableMeetingRooms] = useState(0)
  const [totalMeetingsToday, setTotalMeetingsToday] = useState(0)
  const [meetingInProgress, setMeetingInProgress] = useState(0)

  const query = `{
    Buildings {
    name
    id
    meetingRooms {
        id
        name
        meetings {
            title
            date
            startTime
            endTime
        }
    }
  }
  }`

  const handleBuildingData = (response) => {
    const buildingData = response?.data?.data
    let meetingRooms = 0,
      availableRooms = 0,
      meetingToday = 0,
      meetingInTransit = 0,
      buildingNames = []
    if (buildingData?.Buildings) {
      setBuildingCount(buildingData.Buildings.length)
      for (let i = 0; i < buildingData.Buildings.length; i++) {
        buildingNames.push(buildingData.Buildings[i].name)
        if (buildingData.Buildings[i].meetingRooms.length > 0) {
          meetingRooms += 1
          availableRooms += 1
          const { meetings = [] } = buildingData.Buildings[i].meetingRooms[i]
          if (meetings.length > 0) {
            for (let j = 0; j < meetings.length; j++) {
              const { date: meetingDate, endTime, startTime } = meetings[j]
              if (dateEquals(meetingDate, new Date())) {
                meetingToday += 1
                if (checkIntervalLiesBtwGivenTimes(startTime, endTime)) {
                  meetingInTransit += 1
                  availableRooms -= 1
                }
              }
            }
          }
        }
      }
      setBuildingName(buildingNames)
      setTotalMeetingRooms(meetingRooms)
      setAvailableMeetingRooms(availableRooms)
      setTotalMeetingsToday(meetingToday)
      setMeetingInProgress(meetingInTransit)
    }
  }

  const fetchMeetingDetails = async () => {
    const response = await axios.post(URL, { query }, config)
    handleBuildingData(response)
  }

  const addMeetingHandler = () => {
    history('/addmeeting', { state: buildingName })
  }

  useEffect(() => {
    fetchMeetingDetails()
  }, [])
  
  return (
    <div className="meeting-container">
      <div className='card'>
        <div className='card-details'>
          <h4>
            <b>Buildings</b>
          </h4>
          <p>Total: {buildingCount}</p>
        </div>
      </div>
      <div className='card'>
        <div className='card-details'>
          <h4>
            <b>Rooms</b>
          </h4>
          <p>Total: {totalMeetingRooms}</p>
          <p>Free Now: {availableMeetingRooms}</p>
        </div>
      </div>
      <div className='card'>
        <div className='card-details'>
          <h4>
            <b>Meetings</b>
          </h4>
          <p>Total: {totalMeetingsToday} today </p>
          <p>Total: {meetingInProgress} going on now</p>
        </div>
      </div>
      <Button variant='outlined' onClick={addMeetingHandler}>
        Add a Meeting
      </Button>
    </div>
  )
}

export default Home
