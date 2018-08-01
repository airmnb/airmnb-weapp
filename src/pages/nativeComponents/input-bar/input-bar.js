Component({
  properties: {
    label: String,
    required: {
      type: Boolean,
      value: false
    },
    type: {
      type: String,
      value: 'text'
    },
    value: {
      type: String,
      value: ''
    }
  },
  data: {
    focus: false
  },
  methods: {
    focusInput: function() {
      console.log('set focus');
      this.setData({
        focus: true
      })
    },
    update: function(e){
      const value = e.detail.value;
      this.setData({
        value: value
      })
      this.triggerEvent('change', {value: value});
    }
  }
})
