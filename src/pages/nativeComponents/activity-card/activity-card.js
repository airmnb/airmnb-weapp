import amb from '@/util/amb';
import favoriteService from '@/util/favoriteService';
import timeService from '@/util/timeService';

function displayLocalDate(activity) {
  const temp = activity;
  if (!temp) {
    return '';
  }
  const utcStartTime = `${temp.startDate} ${temp.startTime}`;
  return `${timeService.getLocalDate(utcStartTime)}`;
}

function displayLocalTime(activity) {
  const temp = activity;
  if (!temp) {
    return '';
  }
  const utcStartTime = `${temp.startDate} ${temp.startTime}`;
  const utcEndTime = `${temp.endDate} ${temp.endTime}`;
  return `${timeService.getLocalTime(
    utcStartTime
  )} - ${timeService.getLocalTime(utcEndTime)}`;
}

Component({
  properties: {
    activity: Object,
    url: String
  },
  data: {
    i: amb.pageI18nData
  },
  methods: {
    async toggleFavorite(e) {
      let favoriteId = this.data.activity.favoriteId;
      if (favoriteId) {
        favoriteService.delete(favoriteId);
        favoriteId = null;
      } else {
        const fav = await favoriteService.add(this.data.activity);
        favoriteId = fav.favoriteId;
      }
      this.triggerEvent('change', {value: favoriteId})
    }
  },
  attached() {
    const activity = this.data.activity;
    this.setData({
      displayLocalDate: displayLocalDate(activity),
      displayLocalTime: displayLocalTime(activity)
    })
  },
});
