### Datashop Date-range Directive.

###### Usage:

```
This directive will appear as a HTML element with the following Attributes:
Example:
  <range-handler clock="12" mode="range" callback="dpcb" default-start-date="" default-end-date="" format="MMM dd, yyyy" timerange="timerange" timepicker="true"></range-handler>
```

###### Attributes:

- mode - single or range.
- callback - callback to be called on date submitDate.
- format - format in which the date is to be displayed and returned.
- default-start-date - if mode is range.
- default-end-date - if mode is range.
- timepicker - true if needed/ default is false.
- clock - 12/24 hour time selection, if timepicker is set to true, default is 24.
- default-date - if mode is single.
