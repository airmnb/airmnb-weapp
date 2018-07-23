import {apiClient} from "./restClient";
import moment from "moment";

class TimeService {
  constructor() {}

  getLocalDay(utcTime) {
    return moment.utc(utcTime).local().weekday();
  }

  getLocalTime(utcTime){
    return moment.utc(utcTime).local().format('hh:mm A');
  }

  getLocalDate(utcTime){
    return moment.utc(utcTime).local().format('YYYY-MM-DD');
  }
}

const timeService = new TimeService();
export default timeService;
