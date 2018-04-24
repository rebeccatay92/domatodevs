import React, { Component } from 'react'
// import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'

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
  render () {
    const { connectDropTarget, isOver, getItem } = this.props
    const subPostDisabled = (getItem && getItem.type === 'BlogHeading') || this.props.prevPageType !== 'Post'
    // if (getItem && getItem.type === 'BlogHeading' && this.props.nextPageType === 'Post') return null
    if (this.props.nested && !subPostDisabled) {
      return connectDropTarget(
        <div style={{display: 'inline-block', width: 'calc(100% - 24px)', height: '39px'}}>
          <div style={{width: '1px', borderLeft: isOver ? '1px solid black' : '', height: 'calc(100% - 16px)', marginBottom: '16px'}} />
        </div>
      )
    } else if (this.props.nested && subPostDisabled) {
      return null
    }
    return connectDropTarget(
      <div style={{display: 'inline-block', width: subPostDisabled ? '100%' : '24px', height: '39px'}}>
        <div style={{width: '1px', borderLeft: isOver ? '1px solid black' : '', marginLeft: getItem && getItem.type === 'BlogHeading' ? 0 : '8px', height: 'calc(100% - 16px)', marginBottom: '16px'}} />
      </div>
    )
  }
}

export default DropTarget(['page'], pageTarget, collectTarget)(EditorPostsListEmptyRow)
