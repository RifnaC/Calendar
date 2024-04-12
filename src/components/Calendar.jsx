import  moment from 'moment';
import PropTypes from 'prop-types';
import {Events} from './Events';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";


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
    for(let segment of segments){
        currentWeek.push(segment.clone());
        if (segment.format("dddd")==='Saturday'){
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if(currentWeek.length > 0){
        weeks.push(currentWeek);
    }
    return weeks;
}

const padWeekFront = (week, padWidth = null) =>{
    return [...Array(7 - week.length).fill(padWidth), ...week];
}

const padWeekBack = (week, padWidth = null) =>{
    return [...week, ...Array(7 - week.length).fill(padWidth)];
}

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

export const Calendar = ({month, year, onPrev, onToday, onNext,}) => {
    const currentMonthMoment = moment(`${month}${year}`, 'MMYYYY');
    const today = moment(); 
    const weeks = segmentInToWeeks(getDays(currentMonthMoment));

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
                            {daysOfTheWeek.map((day) => <th  className=' p-5 border-2' key={day}>{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((week, index) => {
                            const displayWeek = index === 0 ? padWeekFront(week) : padWeekBack(week);
                            return (
                                <tr key={index}>
                                    {displayWeek.map((day, ind) => 
                                    day ? 
                                    <td key={day.format("D")} className={day.isSame(today, 'day') ? 'current-day border-2 p-5' : 'border-2 p-5'}  >
                                        {day.format("D")}
                                    </td>:
                                    <td key={`${index}${ind}`} className='border-2 p-5'></td>)}
                                </tr>
                            )
                        })}            
                    </tbody>
                </table>
            </div>
            <Events />
        </div>
    )
}

Calendar.propTypes = {
    month: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    onPrev: PropTypes.func.isRequired,
    onToday: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    // eventDate: PropTypes.func.isRequired,
}