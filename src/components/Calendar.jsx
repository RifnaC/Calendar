import moment from 'moment';
import PropTypes from 'prop-types';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import {  FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



export const getDays = (monthMoment) => {
    const monthCopy = monthMoment.clone();
    monthCopy.startOf('month');
    const days = [];
    while (monthCopy.month() === monthMoment.month()) {
        days.push(monthCopy.clone());
        monthCopy.add(1, 'days');
    }
    return days;
}

export const segmentInToWeeks = (segments) => {
    const weeks = [];
    let currentWeek = [];
    for (let segment of segments) {
        currentWeek.push(segment.clone());
        if (segment.format("dddd") === 'Saturday') {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }
    return weeks;
}

const padWeekFront = (week, padWidth = null) => {
    return [...Array(7 - week.length).fill(padWidth), ...week];
}

const padWeekBack = (week, padWidth = null) => {
    return [...week, ...Array(7 - week.length).fill(padWidth)];
}

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];


export const Calendar = ({ month, year, onPrev, onToday, onNext, }) => {
    const currentMonthMoment = moment(`${month}${year}`, 'MMYYYY');
    const today = moment();
    const weeks = segmentInToWeeks(getDays(currentMonthMoment));

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
                date: selectedDate
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
    }, [events]);


    return (
        <div className='flex'>
            <div>
                <div className="flex justify-between border-2 mx-3 py-1">
                    <h5 className='text-xl font-bold p-2'>{currentMonthMoment.format("MMMM YYYY")}</h5>
                    <div className='flex px-3'>
                        <button onClick={onPrev} className=''><FaAngleLeft /></button>
                        <button onClick={onToday} className='mx-3'>Today</button>
                        <button onClick={onNext} className=''><FaAngleRight /></button>
                    </div>
                </div>
                <table className='mx-3'>
                    <thead>
                        <tr>
                            {daysOfTheWeek.map((day) => <th className=' p-5 border-2' key={day}>{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((week, index) => {
                            const displayWeek = index === 0 ? padWeekFront(week) : padWeekBack(week);
                            return (
                                <tr key={index}>
                                    {displayWeek.map((day, ind) =>
                                        day ?
                                            <td key={day.format("D")} className={day.isSame(today, 'day') ? 'current-day border-2 p-5' : 'border-2 p-5'} onClick={() =>{
                                                setSelectedDate(day.format("MM/DD/YYYY"))
                                                setShowInput(true)
                                            }}>
                                                {day.format("D")}
                                                
                                            </td> :
                                            <td key={`${index}${ind}`} className='border-2 p-5'></td>)}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="border-2 w-screen">
                <div className="flex justify-between border-b-2 p-1">
                    <h2 className="text-xl font-bold mt-3">Events</h2>
                    <button className="text-xl font-bold px-3" onClick={() => setShowInput(true)}> <FaPlus /> </button>
                </div>
                {
                    showInput && (
                        <div className="flex justify-between border-b-2 m-2 py-4" >
                            <div>
                            <input
                            // type="date"
                               value={ selectedDate}
                               onChange={e => setSelectedDate(e.target.value)}
                                className="mr-3 p-2 bg-white "
                            />
                            <input
                                type="text"
                                value={eventTitle}
                                onChange={e => setEventTitle(e.target.value)}
                                placeholder="Event Title"
                                className="border p-2  bg-white"
                            />
                            </div>
                            <button className="border-0 font-bold bg-white m-1 p-2" onClick={addEvent}> Save </button>
                        </div>
                    )
                }
                <ul>
                    {events.map((event, index) => (
                        <li className="flex justify-between border-b-2 p-3" key={index}>
                            <div>
                                <span className='px-2'>{event.date}</span>
                                <span>{event.title}</span>
                                
                            </div>
                            <div className="flex">
                                {/* <div className="p-1"><FaEdit /></div> */}
                                <div className="p-1" onClick={() => deleteEvent(event.id)}><MdDelete /></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    )
}

Calendar.propTypes = {
    month: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    onPrev: PropTypes.func.isRequired,
    onToday: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
}