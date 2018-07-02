import React, { Component } from 'react'

import { graphql, compose } from 'react-apollo'
import { getUserBucketList } from '../../../apollo/bucket'

import { connect } from 'react-redux'
import { initializeBucketList, selectCountryFilter, selectCategoryFilter, setFocusedBucketId } from '../../../actions/planner/bucketListActions'
import { setPopupToShow } from '../../../actions/planner/mapboxActions'

import Radium from 'radium'
import { BucketRightBarStyles as styles } from '../../../Styles/BucketRightBarStyles'

import BucketItem from './BucketItem'

class BucketRightBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  // BUCKET LIST IS ALREADY INITIALIZED IN PLANNERPAGE.
  // componentDidMount () {
  //   if (this.props.data.getUserBucketList) {
  //     this.props.initializeBucketList(this.props.data.getUserBucketList.buckets, this.props.data.getUserBucketList.countries)
  //   }
  // }
  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.data.getUserBucketList !== this.props.data.getUserBucketList) {
  //     // console.log('receiveprops intialize bucket', nextProps.data.getUserBucketList)
  //     this.props.initializeBucketList(nextProps.data.getUserBucketList.buckets, nextProps.data.getUserBucketList.countries)
  //   }
  // }

  selectCountryFilter (id) {
    // console.log('country id', id)
    this.props.selectCountryFilter(id)
    this.props.setFocusedBucketId('')
  }

  selectCategoryFilter (category) {
    this.props.selectCategoryFilter(category)
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

    let { buckets, countries, selectedBucketCategory, selectedCountryId } = this.props.bucketList

    let filteredByCountryArr
    let filteredFinalArr

    if (selectedCountryId) {
      filteredByCountryArr = buckets.filter(e => {
        return e.location.CountryId === selectedCountryId
      })
    } else {
      filteredByCountryArr = buckets
    }

    if (selectedBucketCategory) {
      filteredFinalArr = filteredByCountryArr.filter(e => {
        return e.bucketCategory === selectedBucketCategory
      })
    } else {
      filteredFinalArr = filteredByCountryArr
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
            <select value={selectedBucketCategory} onChange={e => this.selectCategoryFilter(e.target.value)} style={{...styles.filtersDropdown, marginTop: '8px'}}>
              <option value=''>All categories</option>
              <option value='Location'>Location</option>
              <option value='Activity'>Activity</option>
              <option value='Food'>Food</option>
              <option value='Lodging'>Lodging</option>
              <option value='Flight'>Flight</option>
              <option value='Transport'>Transport</option>
            </select>
          </div>
        </div>

        <div style={styles.bucketListContainer}>
          {filteredFinalArr.length !== 0 && filteredFinalArr.map((bucket, i) => {
            return (
              <BucketItem key={i} index={i} focusedBucketId={this.props.bucketList.focusedBucketId} bucket={bucket} category={category} toggleFocusedBucket={(id) => this.toggleFocusedBucket(id)} />
              // <div style={{width: '100%'}} key={i}>
              //   {i !== 0 &&
              //     <hr style={styles.horizontalDivider} />
              //   }
              //   <div style={this.props.bucketList.focusedBucketId === bucket.id ? styles.bucketRowFocused : styles.bucketRowUnfocused} key={`bucketItem${i}`} onClick={() => this.toggleFocusedBucket(bucket.id)}>
              //     <img src={bucket.thumbnailUrl} style={styles.thumbnailImage} />
              //     <div style={styles.contentContainer}>
              //       <div style={styles.locationAndCategoryDiv}>
              //         <span style={styles.locationName}>{bucket.location.name}</span>
              //         <i className='material-icons' style={styles.categoryIcon}>{category[bucket.bucketCategory]}</i>
              //       </div>
              //       <div style={styles.notesContainer}>
              //         <span style={styles.notes}>{bucket.notes}</span>
              //       </div>
              //     </div>
              //   </div>
              // </div>
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
