import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import { getUserBucketList } from '../../apollo/bucket'

import { connect } from 'react-redux'
import { setStickyTabs, setStickySidebar } from '../../actions/userDashboardActions'

import { BucketTabStyles as styles } from '../../Styles/BucketTabStyles'

class BucketTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      focusedTabCountryId: ''
    }
    this.handleScrollBound = (e) => this.handleScroll(e)
  }

  componentDidMount () {
    if (this.props.data.getUserBucketList) {
      let countries = this.props.data.getUserBucketList.countries
      if (countries.length) {
        this.setState({
          focusedTabCountryId: countries[0].id
        })
      }
    }
    document.addEventListener('scroll', this.handleScrollBound)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.getUserBucketList !== this.props.data.getUserBucketList) {
      let countries = nextProps.data.getUserBucketList.countries
      if (countries.length) {
        this.setState({
          focusedTabCountryId: countries[0].id
        })
      }
    }
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScrollBound)
    this.props.setStickySidebar(false)
  }

  handleScroll (e) {
    const el = document.querySelector('.bucketTabComponent')
    if (!el) return
    const rect = el.getBoundingClientRect()
    const distFromTop = rect.top
    // console.log('component distFromTop', distFromTop)
    // 108 px is navbar + horizontal tabs
    if (distFromTop >= 108 && this.props.userDashboard.stickyTabs) {
      this.props.setStickyTabs(false)
      this.props.setStickySidebar(false)
    }
    if (distFromTop < 108 && !this.props.userDashboard.stickySidebar) {
      this.props.setStickySidebar(true)
    }
  }

  switchFocusedCountry (id) {
    this.setState({focusedTabCountryId: id})
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    let stickySidebar = this.props.userDashboard.stickySidebar

    let bucketList = this.props.data.getUserBucketList
    // console.log('bucketList', bucketList)
    let bucketsByCountry = bucketList.buckets.filter(e => {
      return e.location.CountryId === this.state.focusedTabCountryId
    })
    console.log('bucketsByCountry', bucketsByCountry)
    return (
      <div className='bucketTabComponent' style={styles.bucketTabContainer}>
        {stickySidebar &&
          <div style={{display: 'inline-block', width: '265px', height: 'calc(100vh - 108px)'}} />
        }
        <div style={stickySidebar ? styles.leftColumnSticky : styles.leftColumnNonSticky}>
          <h4 style={styles.countryListHeaderText}>Countries</h4>
          <div style={styles.countryListContainer}>
            {bucketList.countries.map((country, i) => {
              return (
                <h4 key={i} style={this.state.focusedTabCountryId === country.id ? styles.clickedTab : styles.unclickedTab} onClick={() => this.switchFocusedCountry(country.id)}>{country.name}</h4>
              )
            })}
          </div>
        </div>

        <div style={styles.rightColumn}>
          {bucketsByCountry.map((bucket, i) => {
            return (
              <div key={i}>
                {i !== 0 &&
                  <hr style={{margin: 0, borderTop: '1px solid rgba(60, 58, 68, 0.3)'}} />
                }
                <div style={styles.bucketContainer}>
                  <div style={{width: '100px'}}>
                    <i className='material-icons' style={{display: 'block'}}>restaurant</i>
                    <span style={{display: 'block'}}>10 adds</span>
                  </div>
                  <div style={{width: '100px'}}>
                    <img src={bucket.thumbnailUrl} style={{height: '70px', width: '70px', borderRadius: '50%', objectFit: 'cover'}} />
                  </div>
                  <div style={{width: '200px'}}>
                    <h6>{bucket.location.name}</h6>
                    <h6>{bucket.eventType}</h6>
                  </div>
                  <div style={{width: '600px'}}>
                    <span>{bucket.notes}</span>
                  </div>
                  <i className='material-icons'>clear</i>
                </div>
              </div>
            )
          })}
        </div>
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
    },
    setStickySidebar: (sticky) => {
      dispatch(setStickySidebar(sticky))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(getUserBucketList)(BucketTab))
