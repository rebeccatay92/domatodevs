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
            <tr style={{width: '100%', height: '40px', border: '1px solid red'}}>
              <th style={{width: '35px', border: '1px solid black'}}>spacer</th>
              <th>Day {this.props.day} {dateStringUpcase}</th>
            </tr>
          </thead>
          {/* <thead style={{width: '100%', height: '40px', border: '1px solid red'}}>
            <div style={{display: 'inline-block'}}>
              <h3 style={{margin: '0 0 0 16px'}}>Day {this.props.day}</h3>
            </div>
            <div style={{display: 'inline-block'}}>
              {dateStringUpcase}
            </div>
          </thead> */}
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
