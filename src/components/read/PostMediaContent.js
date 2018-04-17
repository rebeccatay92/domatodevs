import React, { Component } from 'react'
import FullScreenMedia from './FullScreenMedia'

class PostMediaContent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      activePhotoIndex: 0,
      activePhotoPage: 0,
      fullScreen: false,
      galleryMode: false
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

  componentDidMount () {
    this.setState({
      justChangedMedia: true
    })

    setTimeout(() => {
      this.setState({
        justChangedMedia: false
      })
    }, 4000)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pages.activePostIndex !== this.props.pages.activePostIndex) {
      this.setState({
        activePhotoIndex: 0,
        activePhotoPage: 0,
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
    const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    let fullMediaArr
    if (post) fullMediaArr = post.Post.media
    else fullMediaArr = this.props.pages.activePostIndex === 'home' && this.props.blogMedia
    const mediaArr = fullMediaArr.length > 0 && fullMediaArr.slice(this.state.activePhotoPage * 5, this.state.activePhotoPage * 5 + 5)
    let emptySpaces = []
    for (var i = 1; i <= 5 - (fullMediaArr.length % 5); i++) {
      emptySpaces.push(<div key={i} style={{display: 'inline-block', width: 'calc(8.1vw - 6.4px)', height: 'calc(100vh - 75vh - 84px)', marginBottom: '8px', verticalAlign: 'top'}} />)
    }
    return (
      <React.Fragment>
        {this.state.fullScreen &&
          <div style={{zIndex: 999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.9)'}}>
            <FullScreenMedia url={fullMediaArr[this.state.activePhotoIndex].imageUrl} toggleFullScreen={() => this.setState({fullScreen: false})} />
          </div>
        }
        <div style={{position: 'fixed', top: '56px', left: '15vw', width: '45vw', height: 'calc(100vh - 60px)', display: 'inline-block', verticalAlign: 'top', backgroundColor: '#F5F5F5'}}>
          {fullMediaArr.length > 0 && this.state.galleryMode &&
            <div style={{position: 'relative', width: '100%'}}>
              <img src={`${process.env.PUBLIC_URL}/img/closeGallery.png`} className='read-navigation' style={{position: 'absolute', top: '8px', right: '8px', opacity: '0.4', cursor: 'pointer'}} onClick={() => this.setState({galleryMode: false})} />
              <div style={{maxHeight: 'calc(100vh - 60px)', overflowY: 'scroll', width: 'calc(100% + 17px)', paddingRight: '17px', overscrollBehaviorY: 'contain'}}>
                <div style={{padding: '5%', width: '45vw', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                  {fullMediaArr.map((medium, i) => {
                    return (
                      <div key={i} style={{display: 'inline-block', width: 'calc(8.1vw - 6.4px)', height: 'calc(100vh - 75vh - 84px)', marginBottom: '8px', verticalAlign: 'top'}}>
                        <div onClick={() => this.setState({activePhotoIndex: i, galleryMode: false})} key={i} style={{display: 'inline-block', height: '100%', backgroundImage: `url(${medium.imageUrl})`, backgroundSize: 'cover', width: '100%', textAlign: 'center', cursor: 'pointer'}} />
                      </div>
                    )
                  })}
                  {emptySpaces}
                </div>
              </div>
            </div>
          }
          {fullMediaArr.length > 0 && !this.state.galleryMode &&
            <React.Fragment>
              <div style={{height: '75vh', position: 'relative', width: '100%'}}>
                <i className='material-icons read-navigation' style={{position: 'absolute', top: '8px', right: '8px', opacity: '0.4', fontSize: '16px', cursor: 'pointer'}} onClick={() => this.setState({galleryMode: true})}>zoom_out_map</i>
                {this.state.activePhotoIndex !== 0 && <i onClick={() => this.setState({activePhotoIndex: this.state.activePhotoIndex - 1})} className='material-icons read-navigation' style={{position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', opacity: '0.4', cursor: 'pointer'}}>chevron_left</i>}
                {this.state.activePhotoIndex !== fullMediaArr.length - 1 && <i onClick={() => this.setState({activePhotoIndex: this.state.activePhotoIndex + 1})} className='material-icons read-navigation' style={{position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', opacity: '0.4', cursor: 'pointer'}}>chevron_right</i>}
                {fullMediaArr[this.state.activePhotoIndex].type === 'Photo' && <div style={{position: 'relative', top: '50%', transform: 'translateY(-50%)', width: 'fit-content', maxWidth: '90%', margin: '0 auto'}}>
                  <img style={{maxWidth: '100%', maxHeight: '75vh', verticalAlign: 'middle', cursor: 'pointer'}} src={fullMediaArr[this.state.activePhotoIndex].imageUrl} onClick={() => this.setState({fullScreen: true})} />
                  <div style={{height: '4vh', width: '6vh', textAlign: 'center', position: 'absolute', lineHeight: '4vh', top: '16px', right: '16px', backgroundColor: 'rgba(60, 58, 68, 0.5)', color: 'white', opacity: this.state.justChangedMedia ? '1' : '0', transition: !this.state.justChangedMedia ? 'opacity 0.3s ease-out' : ''}}>
                    {this.state.activePhotoIndex + 1}/{fullMediaArr.length}
                  </div>
                  <div style={{height: '5vh', textAlign: 'center', position: 'absolute', lineHeight: '5vh', bottom: 0, left: 0, right: 0, color: 'white', backgroundColor: 'rgba(60, 58, 68, 0.5)'}}>
                    <span>{fullMediaArr[this.state.activePhotoIndex].caption}</span>
                  </div>
                </div>}
                {fullMediaArr[this.state.activePhotoIndex].type === 'Youtube' && <div style={{margin: '0 auto', width: '90%', height: '60vh', position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>
                  <iframe src={fullMediaArr[this.state.activePhotoIndex].youtubeUrl} width='100%' height='100%' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen />
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
                {(this.state.activePhotoPage + 1) * 5 < fullMediaArr.length && <i onClick={() => this.setState({activePhotoPage: this.state.activePhotoPage + 1})} className='material-icons read-navigation' style={{position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', opacity: '0.4', cursor: 'pointer'}}>chevron_right</i>}
              </div>
            </React.Fragment>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default PostMediaContent
