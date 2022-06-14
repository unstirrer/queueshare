const DateAsJsonValue = (date) => {

    return {time: date.getTime(), timezoneOffset: date.getTimezoneOffset()};

};

export default DateAsJsonValue;
