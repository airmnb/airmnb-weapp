# Generic form

## Input type
* `control-group`: Control-group
* `input`: Input: readonly/editable
* `number`: Number
* `currency`: Currency
* `textarea`: Textarea: long description, multiple lines
* `timepicker`: Time picker
* `datepicker`: Date picker
* `checkbox`: Switch: no/off
* `select`: Options: 2-N options, dropdown
* `avatar`: Avatar: Single image, changable
* `pictures`: Pictures: Multiple choose and upload, deletable

```javascript
[
  [
    {
      type: "input",
      label: "姓名",
      value: this.fullName,
      readonly: false,
      bindchange: this.onFullNameChange
    }
  ],
  [],
  []
]

```
