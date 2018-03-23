import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'

import { changeActivePost } from '../../../actions/readActions'

const eventIconStyle = {
  fontSize: '16px',
  marginRight: '0',
  WebkitTextStroke: '1px rgba(60, 58, 68, 0.7)',
  WebkitTextFillColor: '#FFFFFF',
  cursor: 'pointer',
  ':hover': {
    WebkitTextStroke: '1px #ed685a'
  }
}

const MouseHoverHOC = (WrappedComponent) => {
  return class extends Component {
    constructor (props) {
      super(props)

      this.state = {
        hover: false
      }
    }

    render () {
      return (
        <li onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
          <WrappedComponent hover={this.state.hover} {...this.props} />
        </li>
      )
    }
  }
}

class EditorPostsListRow extends Component {
  constructor (props) {
    super(props)

    const type = this.props.page.type

    this.state = {
      pageTitle: this.props.page[type].title || this.props.page[type].description,
      eventType: this.props.page[type].eventType,
      isSubPost: !!this.props.page[type].ParentPostId
    }
  }

  render () {
    const {page, i, activePostIndex} = this.props
    const iconTypes = ['directions_run', 'restaurant', 'hotel', 'flight', 'directions_subway', 'local_car_wash', 'directions_boat']
    const eventTypes = ['Activity', 'Food', 'Lodging', 'Flight', 'Train', 'LandTransport', 'SeaTransport']
    if (page.type === 'BlogHeading') {
      if (activePostIndex === i) {
        return (
          <React.Fragment key={i}>
            <span style={{color: '#ed685a', display: 'inline-block', paddingBottom: '8px'}}>Header
            </span>
            <input type='text' style={{width: '100%', marginBottom: '16px', padding: '8px'}} value={this.state.pageTitle} onChange={(e) => this.setState({pageTitle: e.target.value})} />
          </React.Fragment>
        )
      }
      return (
        <React.Fragment key={i}><span onClick={() => this.props.changeActivePost(i)} style={{display: 'inline-block', fontWeight: 'bold', padding: '0 0 16px 0', cursor: 'pointer'}}>{page.BlogHeading.title}</span></React.Fragment>
      )
    } else if (page.type === 'Post' && page.Post.contentOnly) {
      if (activePostIndex === i) {
        return (
          <React.Fragment key={i}>
            <div style={{color: '#ed685a', paddingBottom: '8px'}}>{this.state.isSubPost
              ? <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span><span style={{width: '12px', display: 'inline-block'}}>|</span>Sub-Post</React.Fragment>
               : <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span>Post</React.Fragment>}
            </div>
            <div style={{paddingBottom: '8px'}}>
              <input type='text' style={{marginLeft: this.state.isSubPost ? '20px' : '8px', width: this.state.isSubPost ? 'calc(77% - 12px)' : '77%', padding: '8px'}} value={this.state.pageTitle} onChange={(e) => this.setState({pageTitle: e.target.value})} />
              <i className='material-icons read-navigation' onClick={() => this.setState({isSubPost: !this.state.isSubPost})} style={{verticalAlign: 'middle', fontSize: '24px', marginLeft: '4px', top: '-2px', position: 'relative', cursor: 'pointer'}}>{this.state.isSubPost ? 'format_indent_decrease' : 'format_indent_increase'}</i>
            </div>
            <div style={{paddingBottom: '16px', display: 'flex', justifyContent: 'space-between'}}>
              {iconTypes.map((icon, i) => {
                return (
                  <i key={i} className='material-icons' style={eventIconStyle}>{icon}</i>
                )
              })}
            </div>
          </React.Fragment>
        )
      }
      return (
        <React.Fragment key={i}>{this.state.isSubPost && <span style={{position: 'absolute', left: '32px'}}>&#8226;</span>}<span onClick={() => this.props.changeActivePost(i)} style={{...{verticalAlign: 'top', display: 'inline-block', padding: '0 0 16px 8px', color: '#3C3A44', cursor: 'pointer'}, ...this.state.isSubPost && {padding: '0 0 16px 20px'}}}>{page.Post.title}</span></React.Fragment>
      )
    } else if (page.type === 'Post' && !page.Post.contentOnly) {
      if (activePostIndex === i) {
        return (
          <React.Fragment key={i}>
            <div style={{color: '#ed685a', paddingBottom: '8px'}}>{this.state.isSubPost
              ? <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span><span style={{width: '12px', display: 'inline-block'}}>|</span>Sub-Post</React.Fragment>
               : <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span>Post</React.Fragment>}
              <i style={{verticalAlign: 'middle', color: '#3C3A44', fontSize: '16px', marginLeft: '4px', cursor: 'pointer', opacity: this.props.hover ? '1.0' : 0}} className='material-icons'>more_horiz</i>
            </div>
            <div style={{paddingBottom: '8px'}}>
              <input type='text' style={{marginLeft: this.state.isSubPost ? '20px' : '8px', width: this.state.isSubPost ? 'calc(77% - 12px)' : '77%', padding: '8px'}} value={this.state.pageTitle} onChange={(e) => this.setState({pageTitle: e.target.value})} />
              <i className='material-icons read-navigation' onClick={() => this.setState({isSubPost: !this.state.isSubPost})} style={{verticalAlign: 'middle', fontSize: '24px', marginLeft: '4px', top: '-2px', position: 'relative', cursor: 'pointer'}}>{this.state.isSubPost ? 'format_indent_decrease' : 'format_indent_increase'}</i>
            </div>
          </React.Fragment>
        )
      }
      return (
        <React.Fragment key={i}>{this.state.isSubPost && <span style={{position: 'absolute', left: '32px'}}>&#8226;</span>}<span onClick={() => this.props.changeActivePost(i)} style={{...{verticalAlign: 'top', display: 'inline-block', padding: '0 0 16px 8px', color: '#3C3A44', cursor: 'pointer'}, ...this.state.isSubPost && {padding: '0 0 16px 20px'}}}>{page.Post.location.name} - {page.Post.description}</span></React.Fragment>
      )
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    }
  }
}

export default connect(null, mapDispatchToProps)(MouseHoverHOC(Radium(EditorPostsListRow)))
