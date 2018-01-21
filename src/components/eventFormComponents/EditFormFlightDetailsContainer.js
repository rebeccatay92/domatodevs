import React, { Component } from 'react'
import EditFormFlightDetailsPage from './EditFormFlightDetailsPage'

class EditFormFlightDetailsContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isReturn: false,
      totalPages: 1,
      currentPage: 1,
      page1: [],
      page2: []
    }
  }

  nextPage () {
    this.setState({currentPage: 2})
  }
  previousPage () {
    this.setState({currentPage: 1})
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.flightInstances !== nextProps.flightInstances) {
      console.log('NEXT PROPS', nextProps)
      var isReturn = nextProps.returnTrip
      var flightInstances = nextProps.flightInstances
      if (isReturn) {
        if (flightInstances.length === 2) {
          // var page1 = flightInstances.slice(0, 1)
          // var page2 = flightInstances.slice(1)
          var page1 = flightInstances
          var page2 = []
          this.setState({totalPages: 1, isReturn: true, page1: page1, page2: page2})
        } else if (flightInstances.length === 4) {
          page1 = flightInstances.slice(0, 2)
          page2 = flightInstances.slice(2)
          this.setState({totalPages: 2, isReturn: true, page1: page1, page2: page2})
        }
      } else {
        // one way
        if (flightInstances.length === 4) {
          page1 = flightInstances.slice(0, 2)
          page2 = flightInstances.slice(2)
          this.setState({totalPages: 2, isReturn: false, page1: page1, page2: page2})
        } else {
          page1 = flightInstances
          this.setState({totalPages: 1, isReturn: false, page1: page1, page2: []})
        }
      }
    }
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        {/* DEPART/RETURN HEADER */}
        {this.state.currentPage === 1 &&
        <p style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>Departing Flights</p>
        }
        {this.state.currentPage === 2 &&
        <p style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>Returning Flights</p>
        }
        {/* {!this.state.isReturn && this.state.currentPage === 2 &&
        <p style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>Departing Flights (pg 2)</p>
        } */}

        {/* FLIGHT INSTANCE PAGE COMPONENT */}
        <EditFormFlightDetailsPage dates={this.props.dates} isReturn={this.state.isReturn} totalInstances={this.props.flightInstances.length} instances={this.state[`page${this.state.currentPage}`]} />

        {/* NEXT PAGE / PREVIOUS PAGE ARROWS */}
        {this.state.totalPages === 2 && this.state.currentPage === 1 &&
        <i onClick={() => this.nextPage()} className='material-icons' style={{cursor: 'pointer', position: 'absolute', top: '172px', right: '10px', fontSize: '50px'}}>chevron_right</i>
        }
        {this.state.totalPages === 2 && this.state.currentPage === 2 &&
        <i onClick={() => this.previousPage()} className='material-icons' style={{cursor: 'pointer', position: 'absolute', top: '172px', left: '10px', fontSize: '50px'}}>chevron_left</i>
        }
      </div>
    )
  }
}

export default EditFormFlightDetailsContainer
