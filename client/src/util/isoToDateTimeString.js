export function isoStrToIndianDateStr(dateStr) {
    return new Date(dateStr).toDateString() + " , " +
        new Date(dateStr).getHours() + ":" +
        new Date(dateStr).getMinutes() + ":" +
        new Date(dateStr).getSeconds()
}