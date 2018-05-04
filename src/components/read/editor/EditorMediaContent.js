import React, { Component } from 'react'
import { connect } from 'react-redux'

import EditorMediaContentRow from './EditorMediaContentRow'
import FullScreenMedia from '../FullScreenMedia'

import { updateActivePage } from '../../../actions/blogEditorActivePageActions'
import { openMediaConsole } from '../../../actions/mediaConsoleActions'

class EditorMediaContent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      activePhotoIndex: 0,
      activePhotoPage: 0,
      fullScreen: false,
      editMode: false
    }
  }

  openMediaConsole () {
    this.props.openMediaConsole('editor')
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.page.media.length === 0 && !this.state.editMode) {
      this.setState({editMode: true})
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.activePhotoIndex === this.state.activePhotoIndex) return
    if (this.state.activePhotoIndex > this.state.activePhotoPage * 5 + 4) {
      let newPageNo = this.state.activePhotoPage
      while (this.state.activePhotoIndex > newPageNo * 5 + 4) {
        newPageNo++
      }
      this.setState({
        activePhotoPage: newPageNo
      })
    } else if (this.state.activePhotoIndex < this.state.activePhotoPage * 5) {
      let newPageNo = this.state.activePhotoPage
      while (this.state.activePhotoIndex < newPageNo * 5) {
        newPageNo--
      }
      this.setState({
        activePhotoPage: newPageNo
      })
    }

    if (prevState.activePhotoIndex !== this.state.activePhotoIndex) {
      this.setState({
        justChangedMedia: true
      })

      setTimeout(() => {
        this.setState({
          justChangedMedia: false
        })
      }, 4000)
    }
  }

  render () {
    let imageNo = 0, videoNo = 0
    // if (this.props.pages.activePostIndex === 'home') {
    //   mediaArr = this.props.blogMedia
    // } else if (this.props.pages.activePostIndex !== 'fin') {
    //   mediaArr = this.props.page.media
    // }
    const mediaArr = this.props.page.media
    if (this.state.editMode && mediaArr.length > 0) return (
      <div style={{position: 'fixed', zIndex: 1, left: '15vw', width: '45vw', height: 'calc(100vh - 56px)', display: 'inline-block', verticalAlign: 'top', backgroundColor: '#F5F5F5'}}>
        <div style={{position: 'relative', width: '100%', padding: '16px 0', overflow: 'hidden'}}>
          <i className='material-icons read-navigation' style={{position: 'absolute', top: '4px', right: '8px', fontSize: '20px', cursor: 'pointer', opacity: '0.4', zIndex: '3'}} onClick={() => this.setState({editMode: false})} >keyboard_backspace</i>
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
    else if (!this.state.editMode && mediaArr.length > 0) return (
      <React.Fragment>
        {this.state.fullScreen &&
          <div style={{zIndex: 999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.9)'}}>
            <FullScreenMedia url={mediaArr[this.state.activePhotoIndex].imageUrl} toggleFullScreen={() => this.setState({fullScreen: false})} />
          </div>
        }
        <div style={{position: 'fixed', left: '15vw', width: '45vw', height: 'calc(100vh - 56px)', display: 'inline-block', verticalAlign: 'top', backgroundColor: '#F5F5F5'}}>
          <div style={{height: '75vh', position: 'relative', width: '100%'}}>
            <i className='material-icons read-navigation' style={{position: 'absolute', top: '8px', right: '8px', opacity: '0.4', fontSize: '16px', cursor: 'pointer'}} onClick={() => this.setState({editMode: true})}>mode_edit</i>
            {this.state.activePhotoIndex !== 0 && <i onClick={() => this.setState({activePhotoIndex: this.state.activePhotoIndex - 1})} className='material-icons read-navigation' style={{position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', opacity: '0.4', cursor: 'pointer'}}>chevron_left</i>}
            {this.state.activePhotoIndex !== mediaArr.length - 1 && <i onClick={() => this.setState({activePhotoIndex: this.state.activePhotoIndex + 1})} className='material-icons read-navigation' style={{position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', opacity: '0.4', cursor: 'pointer'}}>chevron_right</i>}
            {mediaArr[this.state.activePhotoIndex].type === 'Photo' && <div style={{position: 'relative', top: '50%', transform: 'translateY(-50%)', width: 'fit-content', maxWidth: '90%', margin: '0 auto'}}>
              <img style={{maxWidth: '100%', maxHeight: '75vh', verticalAlign: 'middle', cursor: 'pointer'}} src={mediaArr[this.state.activePhotoIndex].imageUrl} onClick={() => this.setState({fullScreen: true})} />
              <div style={{height: '4vh', width: '6vh', textAlign: 'center', position: 'absolute', lineHeight: '4vh', top: '16px', right: '16px', backgroundColor: 'rgba(60, 58, 68, 0.5)', color: 'white', opacity: this.state.justChangedMedia ? '1' : '0', transition: !this.state.justChangedMedia ? 'opacity 0.3s ease-out' : ''}}>
                {this.state.activePhotoIndex + 1}/{mediaArr.length}
              </div>
              <div style={{height: '5vh', textAlign: 'center', position: 'absolute', lineHeight: '5vh', bottom: 0, left: 0, right: 0, color: 'white', backgroundColor: 'rgba(60, 58, 68, 0.5)'}}>
                <span>{mediaArr[this.state.activePhotoIndex].caption}</span>
              </div>
            </div>}
            {mediaArr[this.state.activePhotoIndex].type === 'Youtube' && <div style={{margin: '0 auto', width: '90%', height: '60vh', position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>
              <iframe src={mediaArr[this.state.activePhotoIndex].youtubeUrl} width='100%' height='100%' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen />
            </div>}
          </div>
          <div style={{height: 'calc(100vh - 75vh - 68px)', width: '100%', margin: '8px auto 0 auto', position: 'relative'}}>
            <div style={{margin: '0 auto', display: 'flex', width: `calc(8.1vw * ${mediaArr.length})`, justifyContent: 'space-between'}}>
              {mediaArr.map((medium, i) => {
                return (
                  <div key={i} style={{display: 'inline-block', width: 'calc(8.1vw - 6.4px)', height: 'calc(100vh - 75vh - 60px)', verticalAlign: 'top'}}>
                    <div onClick={() => this.setState({activePhotoIndex: i + this.state.activePhotoPage * 5})} key={i} style={{display: 'inline-block', height: 'calc(100% - 24px)', backgroundImage: `url(${medium.imageUrl})`, backgroundSize: 'cover', width: '100%', textAlign: 'center', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)', cursor: 'pointer', outline: this.state.activePhotoIndex === i + this.state.activePhotoPage * 5 ? '1px solid #ed685a' : 'none'}}>
                      {/* <i className='material-icons'>videocam</i> */}
                    </div>
                    <div style={{textAlign: 'center', height: '24px', width: '100%', display: 'inline-block'}}>
                      {this.state.activePhotoIndex === i + this.state.activePhotoPage * 5 && <i className='material-icons' style={{fontSize: '8px', color: '#ed685a', verticalAlign: 'top'}}>lens</i>}
                    </div>
                  </div>
                )
              })}
            </div>
            {this.state.activePhotoPage !== 0 && <i onClick={() => this.setState({activePhotoPage: this.state.activePhotoPage - 1})} className='material-icons read-navigation' style={{position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', opacity: '0.4', cursor: 'pointer'}}>chevron_left</i>}
            {(this.state.activePhotoPage + 1) * 5 < mediaArr.length && <i onClick={() => this.setState({activePhotoPage: this.state.activePhotoPage + 1})} className='material-icons read-navigation' style={{position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', opacity: '0.4', cursor: 'pointer'}}>chevron_right</i>}
          </div>
        </div>
      </React.Fragment>
    )
    else if (this.state.editMode && mediaArr.length === 0) return (
      <div style={{position: 'fixed', left: '15vw', width: '45vw', height: 'calc(100vh - 60px)', display: 'inline-block', verticalAlign: 'top', backgroundColor: '#F5F5F5'}}>
        <div style={{height: 'calc(100vh - 56px)', width: '100%', padding: '8px 24px'}}>
          <div style={{border: '1px solid rgba(60, 58, 68, 0.2)', height: '100%', cursor: 'pointer'}} onClick={() => this.openMediaConsole()}>
            <span style={{textAlign: 'center', display: 'block', width: '100%', position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>Add/Remove image(s) and video(s)</span>
          </div>
        </div>
      </div>
    )
    else return null
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
