import amb from '@/util/amb';

Component({
  properties: {
    value: {
      type: Number,
      value: 0
    },
    readonly: {
      type: Boolean,
      value: false
    }
  },
  data: {
    definition: [
      {
        label: amb.pageI18nData.cat_edu,
        value: 2
      },
      {
        label: amb.pageI18nData.cat_public,
        value: 4
      },
      {
        label: amb.pageI18nData.cat_care,
        value: 8
      },
      {
        label: amb.pageI18nData.cat_playgroup,
        value: 16
      },
      {
        label: amb.pageI18nData.cat_coach,
        value: 32
      },
      {
        label: amb.pageI18nData.cat_entertainment,
        value: 64
      },
      {
        label: amb.pageI18nData.cat_health,
        value: 128
      },
      {
        label: amb.pageI18nData.cat_new,
        value: 256
      },
      {
        label: amb.pageI18nData.cat_stuff,
        value: 512
      },
      {
        label: amb.pageI18nData.cat_other,
        value: 1
      }
    ]
  },
  methods: {
    changeValue(e) {
      if (this.readonly) return;
      const v = e.detail.value;
      this.triggerEvent('change', { value: v });
    }
  }
});
