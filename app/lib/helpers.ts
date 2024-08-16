export function DueTimeValidation(due_time: string) {
    // check if due_time is not in the past
    const due_time_validation = new Date(due_time);
    const now = new Date();
    if (!due_time_validation) {
        return false;
    }
    if (due_time_validation > now) {
        return true;
    }
    return false;
}

export function getISOStringWithoutSecsAndMillisecs(date: Date) {
    // format date to input datetime-local default value type
    const dateAndTime = date.toISOString().split('T')
    const time = dateAndTime[1].split(':')
    
    return dateAndTime[0]+'T'+time[0]+':'+time[1]
  }