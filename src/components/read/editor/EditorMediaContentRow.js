import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropTarget, DragSource } from 'react-dnd'

import MouseHoverHOC from '../../hoc/MouseHoverHOC'

import { updateActivePage } from '../../../actions/blogEditorActivePageActions'
import { openConfirmWindow, resetConfirmWindow } from '../../../actions/confirmWindowActions'

const mediumSource = {
  beginDrag (props) {
    return props.medium
  },
  endDrag (props, monitor) {
    const indexOfEmptyGap = props.mediaArr.findIndex(medium => medium.isEmpty)
    const newMediaArr = [...props.mediaArr.slice(0, indexOfEmptyGap), ...[monitor.getItem()], ...props.mediaArr.slice(indexOfEmptyGap + 1)].map((medium, i) => {
      return {...medium, ...{loadSequence: i + 1}}
    })
    props.updateActivePage('media', newMediaArr)
  }
}

const mediumTarget = {
  hover (props, monitor) {
    if (props.medium.isEmpty) return
    const draggedMedium = monitor.getItem()
    const newMediaArrWithoutGap = props.mediaArr.filter(medium => {
      return medium.id
    })
    const newMediaArr = [...newMediaArrWithoutGap.slice(0, props.index), ...[{...draggedMedium, ...{id: null, isEmpty: true}}], ...newMediaArrWithoutGap.slice(props.index)].filter(medium => {
      return medium.id !== draggedMedium.id
    })
    props.updateActivePage('media', newMediaArr)
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
    getItem: monitor.getItem()
  }
}

class EditorMediaContentRow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      deletingMedia: false
    }
  }
  handleCaptionChange (index, newCaption) {
    const newMediaArr = this.props.mediaArr.map((medium, i) => {
      if (i === index) {
        return {...medium, ...{caption: newCaption}}
      } else {
        return medium
      }
    })
    this.props.updateActivePage('media', newMediaArr)
  }

  handleDeleteClick () {
    this.setState({deletingMedia: true})
    this.props.openConfirmWindow({
      message: `Are you sure you want to remove this ${this.props.medium.type === 'Photo' ? 'Image' : 'Video'} from the blog?`,
      confirmMessage: `Remove ${this.props.medium.type === 'Photo' ? 'Image' : 'Video'}`
    })
    this.props.removeHover()
  }

  handleMediaDelete (index) {
    const newMediaArr = this.props.mediaArr.filter((medium, i) => {
      return i !== index
    }).map((medium, i) => {
      return {...medium, ...{loadSequence: i + 1}}
    })
    this.props.updateActivePage('media', newMediaArr)
    this.setState({deletingMedia: false})
    this.props.removeHover()
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.deletingMedia && nextProps.confirmWindow.confirmClicked && !this.props.confirmWindow.confirmClicked) {
      this.handleMediaDelete(this.props.index)
      this.props.resetConfirmWindow()
    }

    if (this.state.deletingMedia && !nextProps.confirmWindow.open && this.props.confirmWindow.open && !nextProps.confirmWindow.confirmClicked) {
      this.setState({deletingMedia: false})
    }
  }

  render () {
    const { medium, mediumNum, index, connectDropTarget, connectDragSource, connectDragPreview, getItem } = this.props
    if (medium.isEmpty) {
      return connectDropTarget(
        <div style={{height: 'calc((100vh - 60px - 32px) / 7)', width: '100%', padding: '8px 24px'}}>
          <div style={{height: '100%', width: '20%', borderLeft: '1px solid black', display: 'inline-block'}} />
        </div>
      )
    }
    return connectDropTarget(connectDragPreview(
      <div style={{height: 'calc((100vh - 60px - 32px) / 7)', width: '100%', padding: '8px 24px'}}>
        {this.props.hover && connectDragSource(<i className='material-icons' style={{position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', cursor: 'move', opacity: getItem ? '0' : '1'}}>unfold_more</i>)}
        <div style={{height: '100%', width: '20%', backgroundImage: `url(${medium.imageUrl})`, backgroundSize: 'cover', display: 'inline-block'}} />
        <div style={{height: '100%', width: '80%', padding: '8px 0 8px 8px', display: 'inline-block', verticalAlign: 'top', fontSize: '13px', position: 'relative'}}>
          {medium.type === 'Photo' && <span>Image {mediumNum}</span>}
          {medium.type === 'Youtube' && <span>Video {mediumNum}</span>}
          <input type='text' style={{width: 'calc(100% - 8px)', position: 'absolute', bottom: '8px', left: '8px', padding: '0 8px'}} placeholder='Caption' value={medium.caption} onChange={(e) => (this.handleCaptionChange(index, e.target.value))} />
          {this.props.hover && !getItem && <i onClick={() => this.handleDeleteClick()} className='material-icons' style={{position: 'absolute', top: '8px', right: '0', fontSize: '18px', cursor: 'pointer'}} title={`Remove this ${medium.type === 'Photo' ? 'Image' : 'Video'}`}>highlight_off</i>}
        </div>
        {/* {this.state.deletingMedia && <ConfirmWindow message={`Are you sure you want to remove this ${medium.type === 'Photo' ? 'Image' : 'Video'} from the blog?`} cancelFn={() => this.setState({deletingMedia: false})} confirmFn={() => this.handleMediaDelete(index)} confirmMessage={`Remove ${medium.type === 'Photo' ? 'Image' : 'Video'}`} />} */}
      </div>
    ))
  }
}

const mapStateToProps = (state) => {
  return {
    confirmWindow: state.confirmWindow
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateActivePage: (property, value) => {
      dispatch(updateActivePage(property, value))
    },
    openConfirmWindow: (input) => {
      dispatch(openConfirmWindow(input))
    },
    resetConfirmWindow: () => {
      dispatch(resetConfirmWindow())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DragSource('medium', mediumSource, collectSource)(DropTarget(['medium'], mediumTarget, collectTarget)(MouseHoverHOC(EditorMediaContentRow, 'div'))))
