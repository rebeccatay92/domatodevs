import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import Radium from 'radium'

import { itinerariesByUser } from '../../apollo/itinerary'
import { setStickyTabs } from '../../actions/userDashboardActions'

import { ItinerariesTabStyles as styles } from '../../Styles/ItinerariesTabStyles'

class ItinerariesTab extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleScrollBound = (e) => this.handleScroll(e)
  }
  componentDidMount () {
    document.addEventListener('scroll', this.handleScrollBound)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScrollBound)
  }

  handleScroll (e) {
    const el = document.querySelector('.itinerariesTabComponent')
    if (!el) return
    const rect = el.getBoundingClientRect()
    const distFromTop = rect.top
    // console.log('component distFromTop', distFromTop)
    // 108 px is navbar + horizontal tabs
    if (distFromTop >= 108 && this.props.userDashboard.stickyTabs) {
      this.props.setStickyTabs(false)
    }
  }

  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    // console.log('itineraries', this.props.data.itinerariesByUser)
    let itineraries = this.props.data.itinerariesByUser
    return (
      <div className='itinerariesTabComponent' style={styles.itinerariesTabContainer}>
        {itineraries.map((itinerary, i) => {
          return (
            <div key={i} style={styles.itineraryContainer}>
              <div style={styles.daysDatesCountriesContainer}>
                <div>
                  <span style={styles.daysNumber}>{itinerary.days} </span>
                  <span style={styles.daysCountriesText}>Days</span>
                </div>
                {itinerary.countries.map((country, i) => {
                  return <span style={styles.daysCountriesText}>{country.name}</span>
                })}
              </div>
              <div style={styles.itineraryDetailsContainer}>
                <h1 style={styles.itineraryName}>{itinerary.name}</h1>
                <h4 style={styles.itineraryDescription}>{itinerary.description}</h4>
                <div style={styles.itineraryTagsRow}>
                  {['Adventure', 'Korea', 'Budget', '2018', 'City'].map((hashtag, i) => {
                    return (
                      <div key={`itineraryHashtagDiv${i}`}>
                        {i !== 0 &&
                          <span style={styles.itineraryTagsSpacer}>&#8226;</span>
                        }
                        <span style={styles.itineraryTags}>{hashtag}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={styles.budgetContainer}>
                <span style={styles.budgetText}>SGD 1000 / pax</span>
              </div>
              <div style={styles.timeSinceCreatedContainer}>
                <span style={styles.timeSinceCreated}>2 years ago</span>
              </div>
              <div style={styles.privacyToggleContainer}>
                {/* <i className='material-icons'>visibility</i> */}
                <i className='material-icons'>lock_outline</i>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userDashboard: state.userDashboard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setStickyTabs: (sticky) => {
      dispatch(setStickyTabs(sticky))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(itinerariesByUser)(Radium(ItinerariesTab)))
