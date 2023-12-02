import ScheduleButton from "./ScheduleButton";

const ScheduleItem = ({ times, key, setVisitDate }) => {

  return times.map((value) => {
    let dateTime = new Date(value * 1000);

    let visitTime = dateTime.getHours().toLocaleString() + " : " + (dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes() : dateTime.getMinutes());

    return<>
      <ScheduleButton visitTime={visitTime} key={key} value = {value} setVisitDate = {setVisitDate}/>
    </>
  });

};

export default ScheduleItem;