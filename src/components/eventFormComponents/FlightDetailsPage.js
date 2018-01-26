import React, { Component } from 'react'
import EditFormFlightDetailsInstance from './EditFormFlightDetailsInstance'

const pStyle = {
  margin: '0'
}
const infoStyle = {...pStyle,
  ...{
    fontSize: '14px'
  }
}

class FlightDetailsPage extends Component {

  render () {
    console.log('PAGE', this.props.instances)

    var hasLayover = (this.props.instances.length === 2 && ((this.props.totalInstances === 2 && !this.props.isReturn) || (this.props.totalInstances === 4)))
    let layoverHours, layoverMins
    if (hasLayover) {
      // console.log('instances', this.props.instances)
      var firstInstance = this.props.instances[0]
      var secondInstance = this.props.instances[1]
      var firstInstanceUnix = firstInstance.endTime
      var secondInstanceUnix = (secondInstance.startDay - firstInstance.endDay) * 86400 + secondInstance.startTime
      var unixDifference = secondInstanceUnix - firstInstanceUnix
      // console.log('unix difference', unixDifference)
      layoverHours = Math.floor(unixDifference / 3600) ? Math.floor(unixDifference / 3600) : null
      layoverMins = unixDifference % 3600 / 60
      // console.log('hours', layoverHours, 'minutes', layoverMins)
    }
    return (
      <div style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>

        {this.props.instances.length === 1 &&
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <tbody>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[0]} />
            </tbody>
          </table>
        }

        {hasLayover &&
          <table style={{width: '100%', tableLayout: 'fixed', position: 'relative'}}>
            <tbody>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[0]} />
              <tr>
                <td style={{width: '100%', height: '90px'}}>
                  <p style={infoStyle}>layover {layoverHours}h {layoverMins}m</p>
                </td>
              </tr>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[1]} />
            </tbody>
          </table>
        }

        {this.props.instances.length === 2 && this.props.totalInstances === 2 && this.props.isReturn &&
          <table style={{width: '100%', tableLayout: 'fixed'}}>
            <tbody>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[0]} />
              <tr>
                <td style={{width: '100%', height: '90px'}}>
                  <p style={infoStyle}>Return Flight</p>
                </td>
              </tr>
              <EditFormFlightDetailsInstance dates={this.props.dates} instance={this.props.instances[1]} />
            </tbody>
          </table>
        }
      </div>
    )
  }
}

export default FlightDetailsPage
