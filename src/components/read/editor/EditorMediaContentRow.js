import React, { Component } from 'react'
import { connect } from 'react-redux'
import MouseHoverHOC from '../../hoc/MouseHoverHOC'
import { updateActivePage } from '../../../actions/blogEditorActivePageActions'

class EditorMediaContentRow extends Component {
  render () {
    const { medium, mediumNum } = this.props
    return (
      <div style={{height: 'calc((100vh - 60px - 32px) / 7)', width: '100%', padding: '8px 24px'}}>
        <div style={{height: '100%', width: '20%', backgroundImage: `url(${medium.imageUrl})`, backgroundSize: 'cover', display: 'inline-block'}} />
        <div style={{height: '100%', width: '80%', padding: '8px 0 8px 8px', display: 'inline-block', verticalAlign: 'top', fontSize: '13px', position: 'relative'}}>
          {medium.type === 'Photo' && <span>Image {mediumNum}</span>}
          {medium.type === 'Youtube' && <span>Video {mediumNum}</span>}
          <input type='text' style={{width: 'calc(100% - 8px)', position: 'absolute', bottom: '8px', left: '8px', padding: '0 8px'}} placeholder='Caption' value={medium.caption} />
          {this.props.hover && <i className='material-icons' style={{position: 'absolute', top: '8px', right: '0', fontSize: '18px', cursor: 'pointer'}}>highlight_off</i>}
        </div>
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
