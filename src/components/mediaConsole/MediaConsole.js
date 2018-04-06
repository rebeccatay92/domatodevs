import React, { Component } from 'react'
import Radium, { Style } from 'radium'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { closeMediaConsole, initializeMediaConsole, setFocusedAlbum } from '../../actions/mediaConsoleActions'

import { getUserAlbums } from '../../apollo/album'

class MediaConsole extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      description: ''
    }
  }

  setFocusedAlbum (i) {
    this.props.setFocusedAlbum(i)
  }

  componentDidMount () {
    // console.log(this.props.data.getUserAlbums)
    let albumsArr = this.props.data.getUserAlbums
    this.props.initializeMediaConsole(albumsArr)

    console.log('focusedAlbum', this.props.mediaConsole.focusedAlbum)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.mediaConsole.focusedAlbum !== this.props.mediaConsole.focusedAlbum) {
      let focusedAlbum = nextProps.mediaConsole.focusedAlbum
      console.log('focusedAlbum', focusedAlbum)
      this.setState({
        title: focusedAlbum.title,
        description: focusedAlbum.description
      })
    }
  }

  render () {
    // console.log('focusedAlbum in redux state', this.props.mediaConsole.focusedAlbum)

    return (
      <div style={{backgroundColor: 'rgba(180, 180, 180, 0.5)', position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 999, overflow: 'auto', maxHeight: '100vh', maxWidth: '100vw'}}>
        <Style rules={{html: {overflowY: 'hidden'}}} />

        <i className='material-icons' style={{position: 'fixed', top: '10vh', left: 'calc((100vw - 1134px)/2 - 50px)', fontSize: '36px', cursor: 'pointer'}} onClick={() => this.props.closeMediaConsole()}>close</i>

        <div style={{position: 'fixed', left: 'calc((100vw - 1134px)/2)', top: '10vh', width: '1134px', height: '744px', background: 'white', boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)'}}>

          <div style={{display: 'inline-block', width: '274px', height: '100%', background: 'rgb(24, 143, 143)', padding: '15px', color: 'white'}}>

            <h3 style={{margin: '0 0 10px 0', padding: '0 0 5px 0'}}>Album List</h3>
            <div style={{fontSize: '18px', border: '1px solid white', padding: '5px 0 5px 0', cursor: 'pointer'}}>
              <i className='material-icons' style={{verticalAlign: 'top'}}>add</i>
              <span>New Album</span>
            </div>

            <div style={{height: '40%', boxSizing: 'border-box', overflowY: 'scroll'}}>
              {this.props.mediaConsole.albums.map((album, i) => {
                return (
                  <h5 key={i} style={album.id === this.props.mediaConsole.focusedAlbum.id ? focusedAlbumStyle : unfocusedAlbumStyle} onClick={() => this.setFocusedAlbum(i)}>{album.title}</h5>
                )
              })}
            </div>

            <hr style={{margin: '10px 0 10px 0'}} />

            <div style={{height: '45%', width: '100%'}}>
              <label style={{width: '100%'}}>
                <h5>Album Title</h5>
                <input type='text' value={this.state.title} style={{width: '100%', height: '25px', border: 'none', color: 'black'}} />
              </label>
              <label style={{width: '100%'}}>
                <h5>Album Description</h5>
                <textarea value={this.state.description} style={{width: '100%', height: '100px', border: 'none', color: 'black', resize: 'none'}} />
              </label>
              <label style={{width: '100%'}}>
                <h5>Location / Tags</h5>
                <input type='text' style={{width: '100%', height: '25px', border: 'none', color: 'black'}} />
              </label>
              <button style={{marginTop: '10px', height: '30px', float: 'right', border: 'none', outline: 'none', background: 'transparent', color: 'white'}}>Save changes</button>
            </div>
          </div>

          <div style={{display: 'inline-block', width: '860px', height: '100%', verticalAlign: 'top'}}>
            Right column
          </div>
        </div>
      </div>
    )
  }
}

const unfocusedAlbumStyle = {borderLeft: '5px solid transparent', paddingLeft: '10px', cursor: 'pointer', margin: '10px 0', height: '20px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto, sans-serif'}
const focusedAlbumStyle = {borderLeft: '5px solid white', paddingLeft: '10px', cursor: 'pointer', margin: '10px 0', height: '20px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto, sans-serif'}

const mapStateToProps = (state) => {
  return {
    mediaConsole: state.mediaConsole
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeMediaConsole: () => {
      dispatch(closeMediaConsole())
    },
    initializeMediaConsole: (albums) => {
      dispatch(initializeMediaConsole(albums))
    },
    setFocusedAlbum: (i) => {
      dispatch(setFocusedAlbum(i))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserAlbums)
)(Radium(MediaConsole)))
