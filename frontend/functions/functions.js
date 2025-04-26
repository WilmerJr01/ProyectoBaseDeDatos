export function formDate(date){
    const fecha = date.toString()
    return `${fecha.substring(0, 4)}-${fecha.substring(4, 6)}-${fecha.substring(6, 8)}`
}