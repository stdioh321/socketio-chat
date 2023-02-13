import moment from "moment";

export function toFormatedDate(date: Date){
  if(!date) return
  return moment(date).format("YYYY-MM-DD HH:mm:ss")
}