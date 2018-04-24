import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

import { togglePost, toggleSubpost } from '../../../actions/editorPostsListDragDropActions'

const pageTarget = {
  hover (props, monitor) {

  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    getItem: monitor.getItem()
  }
}

class EditorPostsListEmptyRow extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.isOver !== this.props.isOver && nextProps.isOver && nextProps.nested) {
      this.props.toggleSubpost()
    } else if (nextProps.isOver !== this.props.isOver && nextProps.isOver && !nextProps.nested) {
      this.props.togglePost()
    }
  }

  render () {
    const { connectDropTarget, getItem, dragDropType } = this.props
    const subPostDisabled = (getItem && getItem.type === 'BlogHeading') || this.props.prevPageType !== 'Post'
    // if (getItem && getItem.type === 'BlogHeading' && this.props.nextPageType === 'Post' && this.props.nextPageIsSubpost) return null
    if (this.props.nested && !subPostDisabled) {
      return connectDropTarget(
        <div style={{display: 'inline-block', width: 'calc(100% - 24px)', height: '39px'}}>
          <div style={{width: '1px', borderLeft: getItem && dragDropType === 'subpost' ? '1px solid black' : '', height: 'calc(100% - 16px)', marginBottom: '16px'}} />
        </div>
      )
    } else if (this.props.nested && subPostDisabled) {
      return null
    }
    return connectDropTarget(
      <div style={{display: 'inline-block', width: subPostDisabled ? '100%' : '24px', height: '39px'}}>
        <div style={{width: '1px', borderLeft: getItem && dragDropType === 'post' ? '1px solid black' : '', marginLeft: getItem && getItem.type === 'BlogHeading' ? 0 : '8px', height: 'calc(100% - 16px)', marginBottom: '16px'}} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dragDropType: state.editorPostsListDragDrop
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    togglePost: () => {
      dispatch(togglePost())
    },
    toggleSubpost: () => {
      dispatch(toggleSubpost())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(['page'], pageTarget, collectTarget)(EditorPostsListEmptyRow))
