import React, { Component } from 'react'
import { connect } from 'react-redux'
import MouseHoverHOC from '../../hoc/MouseHoverHOC'
import ConfirmWindow from '../../misc/ConfirmWindow'
import { updateActivePage } from '../../../actions/blogEditorActivePageActions'

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

  render () {
    const { medium, mediumNum, index } = this.props
    return (
      <div style={{height: 'calc((100vh - 60px - 32px) / 7)', width: '100%', padding: '8px 24px'}}>
        <div style={{height: '100%', width: '20%', backgroundImage: `url(${medium.imageUrl})`, backgroundSize: 'cover', display: 'inline-block'}} />
        <div style={{height: '100%', width: '80%', padding: '8px 0 8px 8px', display: 'inline-block', verticalAlign: 'top', fontSize: '13px', position: 'relative'}}>
          {medium.type === 'Photo' && <span>Image {mediumNum}</span>}
          {medium.type === 'Youtube' && <span>Video {mediumNum}</span>}
          <input type='text' style={{width: 'calc(100% - 8px)', position: 'absolute', bottom: '8px', left: '8px', padding: '0 8px'}} placeholder='Caption' value={medium.caption} onChange={(e) => (this.handleCaptionChange(index, e.target.value))} />
          {this.props.hover && <i onClick={() => this.handleDeleteClick()} className='material-icons' style={{position: 'absolute', top: '8px', right: '0', fontSize: '18px', cursor: 'pointer'}} title={`Delete this ${medium.type === 'Photo' ? 'Image' : 'Video'}`}>highlight_off</i>}
        </div>
        {this.state.deletingMedia && <ConfirmWindow message={`Are you sure you want to delete this ${medium.type === 'Photo' ? 'Image' : 'Video'}?`} cancelFn={() => this.setState({deletingMedia: false})} confirmFn={() => this.handleMediaDelete(index)} confirmMessage={`Delete ${medium.type === 'Photo' ? 'Image' : 'Video'}`} />}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateActivePage: (property, value) => {
      dispatch(updateActivePage(property, value))
    }
  }
}

export default connect(null, mapDispatchToProps)(MouseHoverHOC(EditorMediaContentRow, 'div'))
