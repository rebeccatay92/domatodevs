import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { DropTarget, DragSource } from 'react-dnd'
import { connect } from 'react-redux'

import Radium from 'radium'
import { BucketRightBarStyles as styles } from '../../../Styles/BucketRightBarStyles'

import { getUserBucketList } from '../../../apollo/bucket'

import { initializeBucketList } from '../../../actions/planner/bucketListActions'

const bucketItemSource = {
  beginDrag (props) {
    console.log(props.bucket);
    return {...props.bucket, ...{index: props.index}}
  },
  endDrag (props, monitor) {
    if (!monitor.didDrop()) {
      initializeBucketList(props.getUserBucketList.getUserBucketList.buckets, props.getUserBucketList.getUserBucketList.countries)
    }
  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    getItem: monitor.getItem(),
    isDragging: monitor.isDragging()
  }
}

class BucketItem extends Component {
  render () {
    const { connectDropTarget, connectDragSource, connectDragPreview, isDragging } = this.props
    return connectDragSource(
      <div style={{width: '100%'}}>
        {this.props.index !== 0 &&
          <hr style={styles.horizontalDivider} />
        }
        <div style={this.props.focusedBucketId === this.props.bucket.id ? styles.bucketRowFocused : styles.bucketRowUnfocused} key={`bucketItem${this.props.index}`} onClick={() => this.props.toggleFocusedBucket(this.props.bucket.id)}>
          <img src={this.props.bucket.thumbnailUrl} style={styles.thumbnailImage} />
          <div style={styles.contentContainer}>
            <div style={styles.locationAndCategoryDiv}>
              <span style={styles.locationName}>{this.props.bucket.location.name}</span>
              <i className='material-icons' style={styles.categoryIcon}>{this.props.category[this.props.bucket.bucketCategory]}</i>
            </div>
            <div style={styles.notesContainer}>
              <span style={styles.notes}>{this.props.bucket.notes}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeBucketList: (buckets, countries) => {
      dispatch(initializeBucketList(buckets, countries))
    }
  }
}

export default connect(null, mapDispatchToProps)(compose(
  graphql(getUserBucketList, {name: 'getUserBucketList'})
)(DragSource('bucketItem', bucketItemSource, collectSource)(Radium(BucketItem))))
