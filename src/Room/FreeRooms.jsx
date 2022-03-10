import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Button } from '@mui/material';
import { URL, axiosHeader as config } from '../Utils/constants'

function FreeRooms() {
  let location = useLocation();
  let navigate = useNavigate();
  const { date, startTime, endTime, selectedBuilding, title } = location.state
  console.log({ date, startTime, endTime, selectedBuilding })
  const [rooms, setRooms] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState();
  const [selectedIndex, setSelectedIndex] = useState();

  const handleResponse = ({ data }) => {
    const { MeetingRooms = [] } = data;
    const availableRooms = [];
    MeetingRooms.forEach((meetingRoom) => {
      const {
        name: meetingRoomName,
        floor,
        building: { name: buildingName },
        meetings = [],
        id: meetingRoomId,
      } = meetingRoom;

      let isBooked = false;

      meetings.forEach((meeting) => {
        const { date: meetingDate } = meeting;
        const dateArr = meetingDate.split('/')
        if (new Date(date).toDateString() === new Date(dateArr[2], dateArr[0] - 1, dateArr[1]).toDateString()) {
          if ((startTime <= meeting.startTime && endTime >= meeting.startTime) ||
            (startTime >= meeting.startTime && endTime <= meeting.endTime) ||
            (startTime <= meeting.endTime && endTime >= meeting.endTime)
          ) {
            isBooked = true;
          }
        }
      });
      if (!isBooked) {
        availableRooms.push({
          meetingRoomId,
          meetingRoomName,
          floor,
          buildingName,
        });
      }
    });

    setRooms([...availableRooms]);
  };

  const query = `{
    MeetingRooms {
        id
        name
        floor
        building {
            name
        }
        meetings {
            id
            title
            date
            startTime
            endTime
        }
    }
  }`;


  const fetchMeetingRoomsData = async () => {
    const response = await axios.post(URL, { query }, config)
    handleResponse(response?.data)
  }

  const payload = ({ id, title, date, startTime, endTime, meetingRoomId }) => {
    return `
      mutation {
        Meeting(
        id: ${id}
        title: "${title}"
        date: "${date}"
        startTime: "${startTime}"
        endTime: "${endTime}"
        meetingRoomId: ${meetingRoomId}
        ) {
        id
        title
        }
      }`;
  };

  const handleSelectedRoom = (roomDetails, index) => {
    const data = {
      ...roomDetails,
      ...meetingDetails,
    };
    setMeetingDetails(data);
    setSelectedIndex(index);
  };
  const handleSave = async () => {
    const {
      id = 1,
      meetingRoomId,
    } = meetingDetails;

    if (id && date && startTime && endTime && meetingRoomId) {
      const query = payload({
        id,
        title,
        date,
        startTime,
        endTime,
        meetingRoomId,
      });

      const response = await axios.post(URL, { query }, config)
      if (response.status === 200) {
        navigate(`/`);
      }
    } else {
      alert("Kindly check the details of the meeting")
    }
  };

  useEffect(() => {
    fetchMeetingRoomsData()
  }, [])


  return (
    <>
      <div className='mainContainer'>
        {rooms.length > 0 ?
          <h1>Please select one of the Free Rooms</h1> :
          <h1>No meeting rooms available</h1>}
        {rooms.map((room, index) => (
          <div key={room.id}
            onClick={() => handleSelectedRoom(room, index)}
          >
            <div className='container'>
              <h4><b>{room.meetingRoomName}</b></h4>
              <p>{room.buildingName}</p>
              <p>floor:{room.floor}</p>
            </div>
          </div>
        ))
        }
        {rooms.length > 0 &&
          <Button
            variant='outlined'
            onClick={handleSave}
          >Save</Button>
        }
      </div>
    </>
  )
}

export default FreeRooms