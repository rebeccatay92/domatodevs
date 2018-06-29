import React, { Component } from 'react'

import { graphql, compose } from 'react-apollo'
import { getUserBucketList } from '../../../apollo/bucket'

import { connect } from 'react-redux'
import { initializeBucketList, selectCountryFilter, selectCategoryFilter, selectVisitedFilter, setFocusedBucketId } from '../../../actions/planner/bucketListActions'
import { setPopupToShow } from '../../../actions/planner/mapboxActions'

import Radium from 'radium'
import { BucketRightBarStyles as styles } from '../../../Styles/BucketRightBarStyles'

import BucketItem from './BucketItem'

class BucketRightBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  selectCountryFilter (id) {
    this.props.selectCountryFilter(id)
    this.props.setFocusedBucketId('')
  }

  selectCategoryFilter (category) {
    this.props.selectCategoryFilter(category)
    this.props.setFocusedBucketId('')
  }

  selectVisitedFilter (visited) {
    this.props.selectVisitedFilter(visited)
    this.props.setFocusedBucketId('')
  }

  toggleFocusedBucket (id) {
    if (this.props.plannerView.mapbox) {
      if (this.props.bucketList.focusedBucketId === id) {
        this.props.setFocusedBucketId('')
        this.props.setPopupToShow('')
      } else {
        this.props.setFocusedBucketId(id)
        this.props.setPopupToShow('bucket')
      }
    }
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>

    let { buckets, countries, selectedBucketCategory, selectedVisitedFilter, selectedCountryId } = this.props.bucketList

    let filteredByCountryArr
    let filteredByCategoryArr
    let filteredFinalArr

    if (selectedCountryId) {
      filteredByCountryArr = buckets.filter(e => {
        return e.location.CountryId === selectedCountryId
      })
    } else {
      filteredByCountryArr = buckets
    }

    if (selectedBucketCategory) {
      filteredByCategoryArr = filteredByCountryArr.filter(e => {
        return e.bucketCategory === selectedBucketCategory
      })
    } else {
      filteredByCategoryArr = filteredByCountryArr
    }

    if (selectedVisitedFilter) {
      filteredFinalArr = filteredByCategoryArr.filter(e => {
        if (selectedVisitedFilter === 'unvisited') {
          return e.visited === false
        } else if (selectedVisitedFilter === 'visited') {
          return e.visited === true
        }
      })
    } else {
      filteredFinalArr = filteredByCategoryArr
    }

    return (
      <div style={styles.mainAreaContainer}>
        {/* HEADER WITH FILTERS */}
        <div style={styles.headerSection}>
          <span style={styles.headerText}>BUCKET LIST</span>
          <div style={styles.filtersDiv}>
            <select value={selectedCountryId} onChange={e => this.selectCountryFilter(e.target.value)} style={styles.filtersDropdown}>
              <option value=''>All countries</option>
              {countries.map((country, i) => {
                return (
                  <option value={country.id} key={i}>{country.name}</option>
                )
              })}
            </select>
            <select value={selectedBucketCategory} onChange={e => this.selectCategoryFilter(e.target.value)} style={{...styles.filtersDropdown}}>
              <option value=''>All categories</option>
              <option value='Location'>Location</option>
              <option value='Activity'>Activity</option>
              <option value='Food'>Food</option>
              <option value='Lodging'>Lodging</option>
              <option value='Flight'>Flight</option>
              <option value='Transport'>Transport</option>
            </select>
            <select value={selectedVisitedFilter} onChange={e => this.selectVisitedFilter(e.target.value)} style={{...styles.filtersDropdown}}>
              <option value=''>All items</option>
              <option value='unvisited'>Unvisited</option>
              <option value='visited'>Visited</option>
            </select>
          </div>
        </div>

        <div style={styles.bucketListContainer}>
          {filteredFinalArr.length !== 0 && filteredFinalArr.map((bucket, i) => {
            return (
              <BucketItem key={i} index={i} focusedBucketId={this.props.bucketList.focfocusedBucketId} bucket={bucket} category={category} toggleFocusedBucket={(id) => this.toggleFocusedBucket(id)} />
            )
          })}
          {!filteredFinalArr.length &&
            <h4 style={styles.headerText}>No results</h4>
          }
        </div>
      </div>
    )
  }
}

const category = {
  'Activity': 'directions_run',
  'Food': 'restaurant',
  'Location': 'place',
  'Lodging': 'hotel',
  'Flight': 'flight',
  'Transport': 'directions_subway'
}

const mapStateToProps = (state) => {
  return {
    bucketList: state.bucketList,
    plannerView: state.plannerView,
    mapbox: state.mapbox
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeBucketList: (buckets, countries) => {
      dispatch(initializeBucketList(buckets, countries))
    },
    selectCountryFilter: (CountryId) => {
      dispatch(selectCountryFilter(CountryId))
    },
    selectCategoryFilter: (category) => {
      dispatch(selectCategoryFilter(category))
    },
    selectVisitedFilter: (visited) => {
      dispatch(selectVisitedFilter(visited))
    },
    setFocusedBucketId: (id) => {
      dispatch(setFocusedBucketId(id))
    },
    setPopupToShow: (name) => {
      dispatch(setPopupToShow(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserBucketList)
)(Radium(BucketRightBar)))
