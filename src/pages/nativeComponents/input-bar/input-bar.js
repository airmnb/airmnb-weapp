Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
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
    // 这里是一些组件内部数据
    focus: false
  },
  methods: {
    // 这里是一个自定义方法
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
