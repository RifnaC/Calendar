import { Calendar } from "./Calendar";
import { useState } from "react";
import  moment from 'moment';

export const CalendarController = () => {
    const today = moment();
    const [currentMonthMoment, setCurrentMonthMoment] = useState(today.clone());
    const incrementMonth = ()=>{
        setCurrentMonthMoment(currentMonthMoment.clone().add(1, 'months'));
    }

    const currentDay = ()=>{
        setCurrentMonthMoment(today.clone());
    }
    const decrementMonth = ()=>{
        setCurrentMonthMoment(currentMonthMoment.clone().subtract(1, 'months'));
    }
    return (
        <div>
            <Calendar  month={currentMonthMoment.format("MM")} year={currentMonthMoment.format("YYYY")}
             onPrev={decrementMonth} onToday={currentDay} onNext={incrementMonth}/>
        </div>
    )
}