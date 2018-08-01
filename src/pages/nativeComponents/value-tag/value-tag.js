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
      if(this.readonly) return;
      const v = e.currentTarget.dataset.value;
      const newValue = this.data.value ^ v;
      this.setData({
        value: newValue
      });
      this.triggerEvent('change', {value:newValue});
    }
  }
})
