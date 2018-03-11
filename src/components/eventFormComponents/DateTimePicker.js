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
  background: 'rgba(245, 245, 245, 0.1)', border: 'none', outline: 'none', fontSize: '16px', fontWeight: 300, textAlign: 'center', padding: '8px', height: '35px', width: '83px', borderRadius: '2px', borderBottom: '1px solid white'
}

const timeStyle = {
  background: 'rgba(245, 245, 245, 0.1)', marginLeft: '8px', fontWeight: '300', fontSize: '16px', outline: 'none', border: 'none', textAlign: 'center', padding: '8px', height: '35px', verticalAlign: 'top', width: '83px', letterSpacing: '-1px', borderRadius: '2px', borderBottom: '1px solid white'
}

class DateTimePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // THESE ARE FOR RENDER PURPOSES ONLY. DAY AND TIME(UNIX) STILL KEPT IN PARENT COMPONENT FOR FORM SUBMISSION
      dates: [],
      date: '',
      startDate: null, // moment obj
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
      // convert time in '10:00AM' string to unix

      // this.setState({
      //   [field]: e.target.value
      // })
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

  // converting time props (unix) into str
  componentWillReceiveProps (nextProps) {
    if (this.props.startTimeUnix !== nextProps.startTimeUnix) {
      var startTimeUnix = nextProps.startTimeUnix
      console.log('starttimeunix', startTimeUnix)
      var momentObj = moment.unix(startTimeUnix).utc()
      var timestr = momentObj.format('HH:mm')
      console.log('starttime str', timestr)
      this.setState({startTime: timestr})
    }
    if (this.props.endTimeUnix !== nextProps.endTimeUnix) {
      var endTimeUnix = nextProps.endTimeUnix
      console.log('endTimeUnix', endTimeUnix)
      momentObj = moment.unix(endTimeUnix).utc()
      timestr = momentObj.format('HH:mm')
      console.log('endtime str', timestr)
      this.setState({endTime: timestr})
    }
  }

  // INTUITIVEINPUTS NO LONGER USE DATETIMEPICKER. IE. THIS.PROPS.TYPES NOT NEEDED.
  componentDidMount () {
    // only set up state with dates if this.props.dates is present
    console.log('this.props', this.props)
    // start and end day are defaulted to day form is opened in (for create), and db days (for edit)
    if (this.props.dates) {
      this.setState({
        dates: this.props.dates.map(e => {
          return moment(e).unix()
        }),
        startDate: moment(new Date(this.props.dates[this.props.startDay - 1])),
        endDate: moment(new Date(this.props.dates[this.props.endDay - 1]))
      })
    }
  }

  // INTUITIVE INPUT NO LONGER USE DATETIMEPICKER. NO MORE CHECKINTIME, PROPS.TYPE
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
          <div className='planner-date-picker' style={{display: 'inline-block', marginRight: '21px'}}>
            <p style={{fontWeight: '300', fontSize: '16px', margin: '0 0 16px 0'}}>Start Time</p>
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

          <div className='planner-date-picker' style={{display: 'inline-block', marginRight: '32px'}}>
            <p style={{fontWeight: '300', fontSize: '16px', margin: '0 0 16px 0'}}>End Time</p>
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
