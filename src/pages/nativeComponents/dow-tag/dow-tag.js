import amb from '@/util/amb';

Component({
  properties: {
    value: {
      type: Number,
      value: 127
    },
    readonly: {
      type: Boolean,
      value: false
    }
  },
  data: {
    definition: [
      {
        label: amb.pageI18nData.dow_mon_s,
        value: 1
      },
      {
        label: amb.pageI18nData.dow_tue_s,
        value: 2
      },
      {
        label: amb.pageI18nData.dow_wed_s,
        value: 4
      },
      {
        label: amb.pageI18nData.dow_thu_s,
        value: 8
      },
      {
        label: amb.pageI18nData.dow_fri_s,
        value: 16
      },
      {
        label: amb.pageI18nData.dow_sat_s,
        value: 32
      },
      {
        label: amb.pageI18nData.dow_sun_s,
        value: 64
      }
    ]
  },
  methods: {
    changeValue(e) {
      if (this.readonly) return;
      const v = e.detail.value;
      this.triggerEvent('change', {value: v});
    }
  }
});
