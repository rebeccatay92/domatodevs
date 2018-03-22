import React, { Component } from 'react'
import { connect } from 'react-redux'

import { changeActivePost } from '../../../actions/readActions'

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
    if (page.type === 'BlogHeading') {
      if (activePostIndex === i) {
        return (
          <li key={i}>
            <span style={{color: '#ed685a', display: 'inline-block', paddingBottom: '8px'}}>Header
            </span>
            <input type='text' style={{width: '100%', marginBottom: '16px', padding: '8px'}} value={this.state.pageTitle} onChange={(e) => this.setState({pageTitle: e.target.value})} />
          </li>
        )
      }
      return (
        <li key={i}><span onClick={() => this.props.changeActivePost(i)} style={{display: 'inline-block', fontWeight: 'bold', padding: '0 0 16px 0', cursor: 'pointer'}}>{page.BlogHeading.title}</span></li>
      )
    } else if (page.type === 'Post' && page.Post.contentOnly) {
      if (activePostIndex === i) {
        return (
          <li key={i}>
            <span style={{color: '#ed685a', display: 'block', paddingBottom: '8px'}}>{this.state.isSubPost
              ? <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span><span style={{width: '12px', display: 'inline-block'}}>|</span>Sub-Post</React.Fragment>
               : <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span>Post</React.Fragment>}
            </span>
            <input type='text' style={{marginLeft: this.state.isSubPost ? '20px' : '8px', width: this.state.isSubPost ? 'calc(77% - 12px)' : '77%', marginBottom: '16px', padding: '8px'}} value={this.state.pageTitle} onChange={(e) => this.setState({pageTitle: e.target.value})} />
            <i className='material-icons read-navigation' style={{verticalAlign: 'middle', fontSize: '24px', marginLeft: '4px', top: '-2px', position: 'relative', cursor: 'pointer'}}>{this.state.isSubPost ? 'format_indent_decrease' : 'format_indent_increase'}</i>
          </li>
        )
      }
      return (
        <li key={i}>{this.state.isSubPost && <span style={{position: 'absolute', left: '32px'}}>&#8226;</span>}<span onClick={() => this.props.changeActivePost(i)} style={{...{verticalAlign: 'top', display: 'inline-block', padding: '0 0 16px 8px', color: '#3C3A44', cursor: 'pointer'}, ...this.state.isSubPost && {padding: '0 0 16px 20px'}}}>{page.Post.title}</span></li>
      )
    } else if (page.type === 'Post' && !page.Post.contentOnly) {
      if (activePostIndex === i) {
        return (
          <li key={i}>
            <span style={{color: '#ed685a', display: 'inline-block', paddingBottom: '8px'}}>{this.state.isSubPost
              ? <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span><span style={{width: '12px', display: 'inline-block'}}>|</span>Sub-Post</React.Fragment>
               : <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span>Post</React.Fragment>}
              <i style={{verticalAlign: 'middle', color: '#3C3A44', fontSize: '16px', marginLeft: '4px', cursor: 'pointer'}} className='material-icons read-navigation'>more_horiz</i>
            </span>
            <input type='text' style={{marginLeft: this.state.isSubPost ? '20px' : '8px', width: this.state.isSubPost ? 'calc(77% - 12px)' : '77%', marginBottom: '16px', padding: '8px'}} value={this.state.pageTitle} onChange={(e) => this.setState({pageTitle: e.target.value})} />
            <i className='material-icons read-navigation' style={{verticalAlign: 'middle', fontSize: '24px', marginLeft: '4px', top: '-2px', position: 'relative', cursor: 'pointer'}}>{this.state.isSubPost ? 'format_indent_decrease' : 'format_indent_increase'}</i>
          </li>
        )
      }
      return (
        <li key={i}>{this.state.isSubPost && <span style={{position: 'absolute', left: '32px'}}>&#8226;</span>}<span onClick={() => this.props.changeActivePost(i)} style={{...{verticalAlign: 'top', display: 'inline-block', padding: '0 0 16px 8px', color: '#3C3A44', cursor: 'pointer'}, ...this.state.isSubPost && {padding: '0 0 16px 20px'}}}>{page.Post.location.name} - {page.Post.description}</span></li>
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

export default connect(null, mapDispatchToProps)(EditorPostsListRow)
