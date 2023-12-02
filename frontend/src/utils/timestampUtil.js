import moment from "moment";

export const dateToTimestamp = (date) => {
  return date / 1000;
};

export const timestampToDate = (timestamp) => {
  return new Date(timestamp * 1000);
};

export const prettyDate = (date) => {
  return moment(date).format("HH:mm:ss DD.MM.YYYY");
};

export const prettyTimestamp = (date) => {
  return prettyDate(timestampToDate(date));
};