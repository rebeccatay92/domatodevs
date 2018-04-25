import React, { Component } from 'react'
import { connect } from 'react-redux'

import EditorMediaContentRow from './EditorMediaContentRow'

import { updateActivePage } from '../../../actions/blogEditorActivePageActions'
import { openMediaConsole } from '../../../actions/mediaConsoleActions'

class EditorMediaContent extends Component {
  openMediaConsole () {
    this.props.openMediaConsole('editor')
  }

  render () {
    let imageNo = 0, videoNo = 0
    // if (this.props.pages.activePostIndex === 'home') {
    //   mediaArr = this.props.blogMedia
    // } else if (this.props.pages.activePostIndex !== 'fin') {
    //   mediaArr = this.props.page.media
    // }
    const mediaArr = this.props.page.media
    return (
      <div style={{position: 'fixed', zIndex: 1, left: '15vw', width: '45vw', height: 'calc(100vh - 56px)', display: 'inline-block', verticalAlign: 'top', backgroundColor: '#F5F5F5'}}>
        <div style={{position: 'relative', width: '100%', padding: '16px 0', overflow: 'hidden'}}>
          <div style={{maxHeight: 'calc((100vh - 60px - 32px) / 7 * 6)', overflowY: 'scroll', width: 'calc(100% + 17px)', paddingRight: '17px', overscrollBehaviorY: 'contain'}}>
            <div style={{width: '45vw'}}>
              {mediaArr.map((medium, i) => {
                if (medium.type === 'Photo') imageNo++
                else if (medium.type === 'Youtube') videoNo++
                const mediumNum = medium.type === 'Photo' ? imageNo : videoNo
                return <EditorMediaContentRow medium={medium} key={i} index={i} mediumNum={mediumNum} mediaArr={mediaArr} />
              })}
            </div>
          </div>
          <div style={{height: 'calc((100vh - 60px - 32px) / 7)', width: '100%', padding: '8px 24px'}}>
            <div style={{border: '1px solid rgba(60, 58, 68, 0.2)', height: '100%', cursor: 'pointer'}} onClick={() => this.openMediaConsole()}>
              <span style={{textAlign: 'center', display: 'block', width: '100%', position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>Add/Remove image(s) and video(s)</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    page: state.blogEditorActivePage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateActivePage: (property, value) => {
      dispatch(updateActivePage(property, value))
    },
    openMediaConsole: (openedFrom) => {
      dispatch(openMediaConsole(openedFrom))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorMediaContent)
