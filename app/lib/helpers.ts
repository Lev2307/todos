export function DueTimeValidation(due_time: string) {
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