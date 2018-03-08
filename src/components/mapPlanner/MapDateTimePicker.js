import React, { Component } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import MapCustomDatePicker from './MapCustomDatePicker'

class MapDateTimePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: null, // moment obj
      endDate: null,
      startTime: '', // eg 10:00AM
      endTime: ''
    }
  }

  handleChange (e, field) {
    // console.log('field', field)
    if (field === 'startDay' || field === 'endDay') {
      var dayInt = parseInt(e.target.value, 10)
      this.props.handleChange(dayInt, field)
    }
    if (field === 'startDate' || field === 'endDate') {
      // set current state to moment obj
      this.setState({[field]: moment(e._d)})
      // find day int
      var dateUnix = moment(e._d).unix()
      dayInt = this.props.datesArr.indexOf(dateUnix) + 1

      if (field === 'startDate') {
        this.props.handleChange(dayInt, 'startDay')
        if (dateUnix > this.state.endDate.unix()) {
          this.setState({endDate: moment(e._d)})
          this.props.handleChange(dayInt, 'endDay')
        }
      } else if (field === 'endDate') {
        this.props.handleChange(dayInt, 'endDay')
      }
    }
    if (field === 'startTime' || field === 'endTime') {
      // calculate unix for parent state
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
        this.props.handleChange(unix, field)
      } else {
        // will time str be null?
      }
    }
  }

  componentDidMount () {
    // if form is of type create
    if (this.props.datesArr && this.props.formType !== 'edit') {
      this.setState({
        startDate: moment.unix(this.props.datesArr[0]),
        endDate: moment.unix(this.props.datesArr[0])
      })
    }

    // initialize dates / time for map planner popup
    if (this.props.formType === 'edit') {
      this.setState({
        startTime: moment.unix(this.props.startTimeUnix).utc().format('HH:mm'),
        endTime: moment.unix(this.props.endTimeUnix).utc().format('HH:mm')
      })
      if (this.props.datesArr) {
        this.setState({
          startDate: moment.unix(this.props.datesArr[this.props.startDay]),
          endDate: moment.unix(this.props.datesArr[this.props.endDay])
        })
      }
    }
  }

  // receive unix from parent. convert to HH:mm str for internal state
  componentWillReceiveProps (nextProps) {
    // set default start time string
    // receive startTime, endTime unix as props. set the str
    if (this.props.startTimeUnix !== nextProps.startTimeUnix) {
      var startTimeUnix = nextProps.startTimeUnix
      var momentObj = moment.unix(startTimeUnix).utc()
      var timestr = momentObj.format('HH:mm')
      this.setState({startTime: timestr})
    }
    if (this.props.endTimeUnix !== nextProps.endTimeUnix) {
      var endTimeUnix = nextProps.endTimeUnix
      momentObj = moment.unix(endTimeUnix).utc()
      timestr = momentObj.format('HH:mm')
      this.setState({endTime: timestr})
    }
  }

  render () {
    console.log(this.state)
    return (
      <div style={{width: '100%', marginTop: '10px', marginBottom: '10px'}}>

        {/* START DATE/DAY & TIME */}
        <div style={{width: '45%', display: 'inline-block', border: '2px solid blue'}}>

          {/* DATE/DAY */}
          <div style={{display: 'inline-block'}}>
            {!this.props.datesArr &&
              <select onChange={e => this.handleChange(e, 'startDay')} value={this.props.startDay} style={mapInfoBoxDayStyle}>
                {this.props.daysArr.map((day, i) => {
                  return (
                    <option value={day} key={i}>Day {day}</option>
                  )
                })}
              </select>
            }
            {this.props.datesArr &&
              <DatePicker customInput={<MapCustomDatePicker />} selected={this.state.startDate} dateFormat={'ddd DD/MM/YYYY'} minDate={moment.unix(this.props.datesArr[0])} maxDate={moment.unix(this.props.datesArr[this.props.datesArr.length - 1])} onSelect={e => this.handleChange(e, 'startDate')} />
            }
          </div>

          {/* TIME */}
          <div style={{display: 'inline-block'}}>
            <input type='time' style={mapInfoBoxTimeStyle} value={this.state.startTime} onChange={(e) => this.handleChange(e, 'startTime')} />
          </div>
        </div>

        <div style={{width: '10%', display: 'inline-block'}}>
          <span>TO</span>
        </div>

        {/* END DATE/DAY & TIME */}
        <div style={{width: '45%', display: 'inline-block', border: '2px solid red', textAlign: 'right'}}>

          {/* TIME */}
          <div style={{display: 'inline-block'}}>
            <input type='time' style={mapInfoBoxTimeStyle} value={this.state.endTime} onChange={(e) => this.handleChange(e, 'endTime')} />
          </div>

          {/* DATE/DAY */}
          <div style={{display: 'inline-block'}}>
            {!this.props.datesArr &&
              <select onChange={e => this.handleChange(e, 'endDay')} value={this.props.endDay} style={mapInfoBoxDayStyle}>
                {this.props.daysArr.map((day, i) => {
                  if (day >= this.props.startDay) {
                    return (
                      <option value={day} key={i}>Day {day}</option>
                    )
                  }
                })}
              </select>
            }
            {this.props.datesArr &&
              <DatePicker customInput={<MapCustomDatePicker />} selected={this.state.endDate} dateFormat={'ddd DD/MM/YYYY'} minDate={this.state.startDate} maxDate={moment.unix(this.props.datesArr[this.props.datesArr.length - 1])} onSelect={e => this.handleChange(e, 'endDate')} />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapInfoBoxDayStyle = {
  background: 'white', border: 'none', outline: '1px solid rgba(60, 58, 68, 0.2)', fontSize: '12px', fontWeight: 300, textAlign: 'center', padding: '6px', height: '30px', width: '80px', verticalAlign: 'middle'
}
const mapInfoBoxTimeStyle = {
  background: 'white', fontWeight: '300', fontSize: '12px', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', textAlign: 'center', padding: '6px', height: '30px', verticalAlign: 'middle', width: '80px'
}

export default MapDateTimePicker
