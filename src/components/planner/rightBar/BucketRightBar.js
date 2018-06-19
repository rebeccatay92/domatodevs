import React, { Component } from 'react'

import { graphql, compose } from 'react-apollo'
import { getUserBucketList } from '../../../apollo/bucket'

import { connect } from 'react-redux'

import { BucketRightBarStyles as styles } from '../../../Styles/BucketRightBarStyles'

class BucketRightBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    console.log('did mount')
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    let bucketList = this.props.data.getUserBucketList.buckets
    let countriesArr = this.props.data.getUserBucketList.countries
    console.log('buckets', bucketList, 'countries', countriesArr)
    return (
      <div style={styles.mainAreaContainer}>
         BUCKET
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    //
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserBucketList)
)(BucketRightBar))
