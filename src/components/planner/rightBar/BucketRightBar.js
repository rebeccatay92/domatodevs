import React, { Component } from 'react'

import { graphql, compose } from 'react-apollo'
import { getUserBucketList } from '../../../apollo/bucket'

import { connect } from 'react-redux'
import { initializeBucketList, selectCountryFilter, selectCategoryFilter } from '../../../actions/planner/bucketListActions'

import Radium from 'radium'
import { BucketRightBarStyles as styles } from '../../../Styles/BucketRightBarStyles'

class BucketRightBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    if (this.props.data.getUserBucketList) {
      console.log('did mount intiialize bucket')
      this.props.initializeBucketList(this.props.data.getUserBucketList.buckets, this.props.data.getUserBucketList.countries)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.getUserBucketList !== this.props.data.getUserBucketList) {
      console.log('receiveprops intialize bucket', nextProps.data.getUserBucketList)
      this.props.initializeBucketList(nextProps.data.getUserBucketList.buckets, nextProps.data.getUserBucketList.countries)
    }
  }

  selectCountryFilter (id) {
    console.log('country id', id)
    this.props.selectCountryFilter(id)
  }

  selectCategoryFilter (category) {
    this.props.selectCategoryFilter(category)
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    // let bucketList = this.props.data.getUserBucketList.buckets
    // let countriesArr = this.props.data.getUserBucketList.countries
    // console.log('buckets', bucketList, 'countries', countriesArr)
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
        <div style={{width: '100%', height: '64px', display: 'flex', alignItems: 'center', paddingLeft: '16px'}}>
          <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '24px', color: 'rgb(60, 58, 68)'}}>BUCKET LIST</span>
          <div style={{display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '16px'}}>
            <select value={selectedCountryId} onChange={e => this.selectCountryFilter(e.target.value)} style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '13px', color: 'rgb(60, 58, 68)'}}>
              <option value=''>All countries</option>
              {countries.map((country, i) => {
                return (
                  <option value={country.id} key={i}>{country.name}</option>
                )
              })}
            </select>
            <select value={selectedBucketCategory} onChange={e => this.selectCategoryFilter(e.target.value)} style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '13px', color: 'rgb(60, 58, 68)', marginTop: '8px'}}>
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

        <div style={{width: '100%', height: 'calc(100% - 64px)', overflow: 'scroll'}}>
          {filteredFinalArr.length !== 0 && filteredFinalArr.map((bucket, i) => {
            return (
              <div style={{width: '100%'}} key={i}>
                {i !== 0 &&
                  <hr style={{width: 'calc(100% - 32px)', height: '1px', margin: '0 16px', borderTop: '1px solid rgba(60, 58, 68, 0.3)'}} />
                }
                <div style={{width: '100%', height: '100px', display: 'flex', alignItems: 'center', padding: '0 16px', cursor: 'pointer', ':hover': {background: 'rgb(250, 250, 250)'}}} key={`bucketItem${i}`}>
                  <img src={bucket.thumbnailUrl} style={{width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginRight: '16px'}} />
                  <div style={{width: 'calc(100% - 80px - 16px)', height: '80px', display: 'flex', flexDirection: 'column'}}>
                    <div style={{height: '24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(67, 132, 150)', width: 'calc(100% - 24px)', height: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{bucket.location.name}</span>
                      <i className='material-icons' style={{color: 'rgb(199, 130, 131)', fontSize: '24px'}}>{category[bucket.bucketCategory]}</i>
                    </div>
                    <div style={{height: 'calc(80px - 24px)', width: '100%', overflow: 'hidden', dispay: 'flex', alignContent: 'flex-start'}}>
                      <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '13px', lineHeight: '19px'}}>{bucket.notes}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {!filteredFinalArr.length &&
            <h4 style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '24px', color: 'rgb(60, 58, 68)'}}>No results</h4>
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
    bucketList: state.bucketList
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserBucketList)
)(Radium(BucketRightBar)))
