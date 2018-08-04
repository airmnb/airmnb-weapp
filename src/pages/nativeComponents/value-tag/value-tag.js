Component({
  properties: {
    value: Number,
    definition: Array,
    readonly: Boolean
  },
  data: {
  },
  methods: {
    toggle(e) {
      if(this.data.readonly) return;
      const v = e.currentTarget.dataset.value;
      const newValue = this.data.value ^ v;
      this.setData({
        value: newValue
      });
      this.triggerEvent('change', {value:newValue});
    }
  },
  ready() {
    console.log('value-tag', this.data, this.data.readonly);
  }
})
