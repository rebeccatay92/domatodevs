import React, { Component } from 'react'

import LeftBarEventRow from './LeftBarEventRow'

import moment from 'moment'

class LeftBarDateBox extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    let dateString = moment.unix(this.props.date).format('ddd DD MMM YYYY')
    let dateStringUpcase = dateString.toUpperCase()

    return (
      <div>
        <table style={{width: '100%'}}>
          <thead>
            <tr style={{width: '100%', height: '40px'}}>
              {/* APPROX 35PX SPACER FOR ICON */}
              <th style={{width: '35px'}} />
              <th colSpan={2}>
                <div style={{borderBottom: '1px solid rgba(60, 58, 68, 0.3)'}}>
                  <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, color: 'rgba(60, 58, 68, 1)', fontSize: '24px', margin: '0 8px'}}>Day {this.props.day}</span>
                  <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, color: 'rgba(60, 58, 68, 1)', fontSize: '16px'}}>{dateStringUpcase}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.events.map((event, i) => {
              return <LeftBarEventRow key={i} event={event} />
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default LeftBarDateBox
