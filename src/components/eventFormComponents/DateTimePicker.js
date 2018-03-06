import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// package css
import CustomDatePicker from './CustomDatePicker'
// custom input style

import { dateTimePickerContainerStyle } from '../../Styles/styles'

import moment from 'moment'
import Radium from 'radium'

const dayStyle = {
  background: 'rgba(245, 245, 245, 0.1)', border: 'none', borderBottom: '1px solid white', outline: 'none', fontSize: '1.48148148148vh', fontWeight: 300, textAlign: 'center', padding: '0.74074074074vh 0.41666666666vw', height: '3.24074074074vh', width: '4.32291666667vw', borderRadius: '2px'
}

const timeStyle = {
  background: 'rgba(245, 245, 245, 0.1)', marginLeft: '0.41666666666vw', fontWeight: '300', fontSize: '1.48148148148vh', outline: 'none', border: 'none', borderBottom: '1px solid white', textAlign: 'center', padding: '0.74074074074vh 0.41666666666vw', height: '3.24074074074vh', verticalAlign: 'top', width: '4.32291666667vw', letterSpacing: '-1px', borderRadius: '2px'
}

class DateTimePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // THESE ARE FOR RENDER PURPOSES ONLY. DAY AND TIME(UNIX) STILL KEPT IN PARENT COMPONENT FOR FORM SUBMISSION
      dates: [],
      date: '',
      startDate: null,
      endDate: null,
      startTime: '', // '10:00AM'
      endTime: ''
    }
  }

  handleChange (e, field) {
    // HANDLING TIME INPUT
    if (field === 'checkInTime' || field === 'checkOutTime') {
      if (field === 'checkInTime') this.setState({startDate: (moment.utc(e._d))})
      if (field === 'checkOutTime') this.setState({endDate: (moment.utc(e._d))})
      console.log(Math.floor(moment.utc(e._d).unix() / 86400) * 86400)
      const time = moment.utc(e._d).unix() % 86400
      const day = this.props.dates.map(date => moment(date).unix()).indexOf(Math.floor(moment.utc(e._d).unix() / 86400) * 86400) + 1
      this.props.handleSelect(field, day, time)
    }
    if (field === 'startTime' || field === 'endTime') {
      // convert time in '10:00AM' string to Int
      // time is relative to 1970 1st jan

      // console.log('value', e.target.value, 'type', typeof (e.target.value))

      this.setState({
        [field]: e.target.value
      })

      if (e.target.value) {
        var timeStr = e.target.value
        if (field === 'startTime') {
          var hours = timeStr.split(':')[0]
          var mins = timeStr.split(':')[1]
          var unix = (hours * 60 * 60) + (mins * 60)
        }
        if (field === 'endTime') {
          if (timeStr === '00:00') {
            timeStr = '24:00'
          }
          hours = timeStr.split(':')[0]
          mins = timeStr.split(':')[1]
          unix = (hours * 60 * 60) + (mins * 60)
        }
        this.props.updateDayTime(field, unix)
      } else {
        this.props.updateDayTime(field, null)
      }
    }

    // HANDLING DAY INPUT
    if (field === 'startDay' || field === 'endDay') {
      var newUnix = this.state.dates[e.target.value - 1]
      var newDate = moment.unix(newUnix)

      if (field === 'startDay') {
        this.props.updateDayTime('startDay', parseInt(e.target.value, 10))
        this.setState({startDate: newDate})
        if (e.target.value > this.props.endDay) {
          this.props.updateDayTime('endDay', parseInt(e.target.value, 10))
          this.setState({endDate: newDate})
        }
      }
      if (field === 'endDay') {
        this.props.updateDayTime('endDay', parseInt(e.target.value, 10))
        this.setState({endDate: newDate})
      }
    }

    // HANDLING DATE INPUT
    if (field === 'startDate' || field === 'endDate') {
      // set the new start/end date
      this.setState({
        [field]: moment(e._d)
      })

      var selectedUnix = moment(e._d).unix()
      var newDay = this.state.dates.indexOf(selectedUnix) + 1

      if (field === 'startDate') {
        this.props.updateDayTime('startDay', newDay)
        if (selectedUnix > this.state.endDate.unix()) {
          this.setState({endDate: moment(e._d)})
          this.props.updateDayTime('endDay', newDay)
        }
      } else if (field === 'endDate') {
        this.props.updateDayTime('endDay', newDay)
      }
    }
  }

  // updating state '' for start/end time with default time props
  componentWillReceiveProps (nextProps) {
    // default time props was passed down as a string
    // DEFAULT TIME FOR CREATE FORM
    if (this.props.defaultTime !== nextProps.defaultTime) {
      this.setState({startTime: nextProps.defaultTime, endTime: nextProps.defaultTime})
    }

    // DEFAULT START/END TIME FOR EDIT FORM
    if (this.props.defaultStartTime !== nextProps.defaultStartTime) {
      this.setState({startTime: nextProps.defaultStartTime})
    }
    if (this.props.defaultEndTime !== nextProps.defaultEndTime) {
      this.setState({endTime: nextProps.defaultEndTime})
    }

    // if (this.props.formType === 'edit') {
    //   console.log('props', nextProps)
    // }
  }

  componentDidMount () {
    // only set up state with dates if this.props.dates is present
    console.log('this.props', this.props)
    // if dates are present in create form/smart input, default start and end day to the date form is opened.
    if (this.props.dates && this.props.formType !== 'edit') {
      this.setState({
        dates: this.props.dates.map(e => {
          return moment(e).unix()
        }),
        date: (new Date(this.props.date)).toISOString().substring(0, 10),
        // this.props.types === checkInTime / checkOutTime from IntuitiveLodgingInput
        startDate: this.props.type ? moment.utc(new Date(this.props.date)) : moment(new Date(this.props.date)),
        endDate: this.props.type ? moment.utc(new Date(this.props.date)) : moment(new Date(this.props.date))
      })
    } else if (this.props.dates && this.props.formType === 'edit') {
      // if dates are present and edit form is opened
      this.setState({
        dates: this.props.dates.map(e => {
          return moment(e).unix()
        }),
        date: (new Date(this.props.date)).toISOString().substring(0, 10),
        startDate: moment(new Date(this.props.dates[this.props.startDay - 1])),
        endDate: moment(new Date(this.props.dates[this.props.endDay - 1]))
      })
    }
  }

  render () {
    if (this.props.intuitiveInput) {
      return (
        <DatePicker
          selected={this.props.type === 'checkInTime' ? this.state.startDate : this.state.endDate}
          onChange={(e) => this.handleChange(e, this.props.type)}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          dateFormat='LLL'
          minDate={moment.unix(this.state.dates[0])} maxDate={moment.unix(this.state.dates[this.state.dates.length - 1])}
        />
      )
    } else {
      return (
        <div style={dateTimePickerContainerStyle}>
          <div className='planner-date-picker' style={{display: 'inline-block', marginRight: '1.09375vw'}}>
            <p style={{fontWeight: '300', fontSize: '1.48148148148vh', margin: '0 0 1.48148148148vh 0'}}>Start Time</p>
            {!this.props.dates &&
              <select key={'startDaySelect'} name='startDay' onChange={(e) => this.handleChange(e, 'startDay')} value={this.props.startDay} style={dayStyle}>
                {this.props.daysArr.map((day, i) => {
                  return <option style={{background: '#6D6A7A'}} value={day} key={i}>Day {day}</option>
                })}
              </select>
            }
            {this.props.dates &&
              <div>
                <DatePicker customInput={<CustomDatePicker />} selected={this.state.startDate} dateFormat={'ddd, DD/MM/YYYY'} minDate={moment.unix(this.state.dates[0])} maxDate={moment.unix(this.state.dates[this.state.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'startDate')} />
              </div>
            }
            <input key='startTime' style={timeStyle} type='time' name='startTime' value={this.state.startTime} onChange={(e) => this.handleChange(e, 'startTime')} />
          </div>

          <div className='planner-date-picker' style={{display: 'inline-block', marginRight: '1.66666666667vw'}}>
            <p style={{fontWeight: '300', fontSize: '1.48148148148vh', margin: '0 0 1.48148148148vh 0'}}>End Time</p>
            {!this.props.dates &&
              <select key={'endDaySelect'} name='endDay' onChange={(e) => this.handleChange(e, 'endDay')} value={this.props.endDay} style={dayStyle}>
                {this.props.daysArr.map((day, i) => {
                  if (day >= this.props.startDay) {
                    return <option style={{background: '#6D6A7A'}} value={day} key={i}>Day {day}</option>
                  }
                })}
              </select>
            }
            {this.props.dates &&
              <div>
                <DatePicker customInput={<CustomDatePicker />} selected={this.state.endDate} dateFormat={'ddd, DD/MM/YYYY'} minDate={this.state.startDate} maxDate={moment.unix(this.state.dates[this.state.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'endDate')} />
              </div>
            }
            <input key='endTime' style={timeStyle} type='time' name='endTime' value={this.state.endTime} onChange={(e) => this.handleChange(e, 'endTime')} />
          </div>
        </div>
      )
    }
  }
}

export default Radium(DateTimePicker)
