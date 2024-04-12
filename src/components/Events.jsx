import { useEffect, useState } from "react";
import { FaEdit, FaPlus} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Events = () => {
  const [events, setEvents] = useState(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    return savedEvents;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [showInput, setShowInput] = useState(false);  
  const addEvent = () => {
    if (selectedDate && eventTitle.trim() !== "") {
      const newEvent = {
        id: Date.now(),
        title: eventTitle,
        date: selectedDate.toISOString() 
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
      setSelectedDate(null);
      setEventTitle("");
      setShowInput(false);
    }
  };
  const deleteEvent = (id) => {
    const updateEvents = events.filter((event) => event.id !== id);
    setEvents(updateEvents);
  }
  useEffect(() => {
      localStorage.setItem("events", JSON.stringify(events));
    },[events]);
  return (
    <>
      <div className="border-2 w-screen">
      <div className="flex justify-between border-b-2 p-1">
        <h2 className="text-xl font-bold mt-3">Events</h2>
        <button className="text-xl font-bold px-3" onClick={() => setShowInput(true)}> <FaPlus /> </button>
      </div>
      {
        showInput && (
          <div className="flex border-b-2 m-2 py-4" >
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            placeholderText="Select Date"
            className="mr-3 p-2 bg-white"
          />
          <input
            type="text"
            value={eventTitle}
            onChange={e => setEventTitle(e.target.value)}
            placeholder="Event Title"
            className="border px-2 py-1 bg-white"
          />
          <button className="border-1 font-bold" onClick={addEvent}> Submit </button>
      </div>
        )
      }
      <ul>

        {events.map((event, index) => (
          <li className="flex justify-between border-b-2 p-3" key={index}>
            <div>
              <span>{event.title}</span>
              <span>{event.date}</span>
            </div>
            <div className="flex">
              <div className="p-1"><FaEdit /></div>
              <div className="p-1" onClick={() => deleteEvent(event.id)}><MdDelete /></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
   
  )
}