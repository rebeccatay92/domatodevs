import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'

import BlogDropdownMenu from './BlogDropdownMenu'

import { changeActivePost } from '../../../actions/readActions'
import { updateActivePage } from '../../../actions/blogEditorActivePageActions'

const eventIconStyle = {
  fontSize: '16px',
  marginRight: '0',
  WebkitTextStroke: '1px rgba(60, 58, 68, 0.7)',
  WebkitTextFillColor: '#FFFFFF',
  cursor: 'pointer'
  // ':hover': {
  //   WebkitTextStroke: '1px #ed685a'
  // }
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
        <li style={{position: 'relative'}} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
          <WrappedComponent hover={this.state.hover} removeHover={() => this.setState({hover: false})} {...this.props} />
        </li>
      )
    }
  }
}

class EditorPostsListRow extends Component {
  constructor (props) {
    super(props)

    // const type = this.props.page.type

    this.state = {
      // pageTitle: this.props.page[type].title || this.props.page[type].description,
      // eventType: this.props.page[type].eventType,
      // isSubPost: !!this.props.page[type].ParentPostId,
      dropdown: false
    }

    this.dropdownStyle = () => {
      return {color: this.state.dropdown ? '#ed685a' : '#3C3A44', fontSize: '16px', marginLeft: '4px', cursor: 'pointer', opacity: this.props.hover || this.state.dropdown ? '1.0' : 0, position: 'absolute', ':hover': {color: '#ed685a'}}
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   const type = this.props.page.type
  //   if (nextProps.activePostIndex !== this.props.activePostIndex && this.props.activePostIndex === this.props.i) {
  //     this.setState({
  //       pageTitle: this.props.page[type].title || this.props.page[type].description,
  //       eventType: this.props.page[type].eventType,
  //       isSubPost: !!this.props.page[type].ParentPostId
  //     })
  //   }
  // }

  toggleDropdown (e) {
    if (e) {
      if (e.target.textContent === 'more_horiz' && e.target.id == this.props.i) return
    }
    this.setState({
      dropdown: false
    })
    this.props.removeHover()
  }

  render () {
    const type = this.props.page.type
    const {page, i, activePostIndex} = this.props
    const {title, eventType, isSubPost} = this.props.activePage
    const iconTypes = ['directions_run', 'restaurant', 'hotel', 'flight', 'directions_subway', 'local_car_wash', 'directions_boat']
    const eventTypes = ['Activity', 'Food', 'Lodging', 'Flight', 'Train', 'LandTransport', 'SeaTransport']
    const eventIconsRow = <div style={{paddingBottom: '16px', display: 'flex', justifyContent: 'space-between'}}>
      {iconTypes.map((icon, i) => {
        return (
          <i key={i} onClick={() => {
            if (eventTypes[i] === eventType) this.props.updateActivePage('eventType', '')
            else this.props.updateActivePage('eventType', eventTypes[i])
          }} className='material-icons' style={{...eventIconStyle, ...eventTypes[i] === eventType && {WebkitTextStroke: '1px #ed685a'}}} title={eventTypes[i]}>{icon}</i>
        )
      })}
    </div>

    if (page.type === 'BlogHeading') {
      if (activePostIndex === i) {
        return (
          <React.Fragment key={i}>
            <span style={{color: '#ed685a', display: 'inline-block', paddingBottom: '8px'}}>Header
            </span>
            <input autoFocus type='text' style={{width: '100%', marginBottom: '8px', padding: '8px'}} value={title} onChange={(e) => this.props.updateActivePage('title', e.target.value)} />
            <span style={{position: 'absolute', right: 0, top: '0'}}>
              <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
              {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} heading />}
            </span>
            <div style={{marginBottom: '16px'}}>
              <button>Save</button>
              <button onClick={() => this.props.changeActivePost('home')}>Cancel</button>
            </div>
          </React.Fragment>
        )
      }
      return (
        <React.Fragment key={i}>
          <span onClick={() => this.props.changeActivePost(i)} style={{display: 'inline-block', fontWeight: 'bold', padding: '0 0 16px 0', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'}}>{page.BlogHeading.title}</span>
          <span style={{position: 'absolute', right: 0}}>
            <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
            {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} heading />}
          </span>
        </React.Fragment>
      )
    } else if (page.type === 'Post' && page.Post.contentOnly) {
      if (activePostIndex === i) {
        return (
          <React.Fragment key={i}>
            <div style={{color: '#ed685a', paddingBottom: '8px'}}>{isSubPost
              ? <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span><span style={{width: '12px', display: 'inline-block'}}>|</span>Sub-Post</React.Fragment>
               : <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span>Post</React.Fragment>}
            </div>
            <span style={{position: 'absolute', right: 0, top: 0}}>
              <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
              {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} post />}
            </span>
            <div style={{paddingBottom: '8px'}}>
              <input type='text' style={{marginLeft: isSubPost ? '20px' : '8px', width: isSubPost ? 'calc(77% - 12px)' : '77%', padding: '8px'}} value={title} onChange={(e) => this.props.updateActivePage('title', e.target.value)} />
              <i className='material-icons read-navigation' onClick={() => this.props.updateActivePage('isSubPost', !isSubPost)} style={{verticalAlign: 'middle', fontSize: '24px', marginLeft: '4px', top: '-2px', position: 'relative', cursor: 'pointer'}}>{isSubPost ? 'format_indent_decrease' : 'format_indent_increase'}</i>
            </div>
            {eventIconsRow}
          </React.Fragment>
        )
      }
      return (
        <React.Fragment key={i}><span onClick={() => this.props.changeActivePost(i)} style={{...{display: 'inline-block', padding: '0 0 16px 8px', color: '#3C3A44', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'}, ...!!this.props.page[type].ParentPostId && {padding: '0 0 16px 8px'}}}>{!!this.props.page[type].ParentPostId && <span style={{marginRight: '12px', display: 'inline-block'}}>&#8226;</span>}{page.Post.title}</span>
          <span style={{position: 'absolute', right: 0}}>
            <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
            {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} post />}
          </span>
        </React.Fragment>
      )
    } else if (page.type === 'Post' && !page.Post.contentOnly) {
      if (activePostIndex === i) {
        return (
          <React.Fragment key={i}>
            <div style={{color: '#ed685a', paddingBottom: '8px'}}>{isSubPost
              ? <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span><span style={{width: '12px', display: 'inline-block'}}>|</span>Sub-Post</React.Fragment>
               : <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span>Post</React.Fragment>}
            </div>
            <span style={{position: 'absolute', right: 0, top: 0}}>
              <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
              {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} post />}
            </span>
            <div style={{paddingBottom: '8px'}}>
              <input type='text' style={{marginLeft: isSubPost ? '20px' : '8px', width: isSubPost ? 'calc(77% - 12px)' : '77%', padding: '8px'}} value={title} onChange={(e) => this.props.updateActivePage('title', e.target.value)} />
              <i className='material-icons read-navigation' onClick={() => this.props.updateActivePage('isSubPost', !isSubPost)} style={{verticalAlign: 'middle', fontSize: '24px', marginLeft: '4px', top: '-2px', position: 'relative', cursor: 'pointer'}}>{isSubPost ? 'format_indent_decrease' : 'format_indent_increase'}</i>
            </div>
            {eventIconsRow}
          </React.Fragment>
        )
      }
      return (
        <React.Fragment key={i}><span onClick={() => this.props.changeActivePost(i)} style={{...{display: 'inline-block', padding: '0 0 16px 8px', color: '#3C3A44', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'}, ...!!this.props.page[type].ParentPostId && {padding: '0 0 16px 8px'}}}>{!!this.props.page[type].ParentPostId && <span style={{marginRight: '12px', display: 'inline-block'}}>&#8226;</span>}{page.Post.location && page.Post.location.name + ' - '}{page.Post.description}</span>
          <span style={{position: 'absolute', right: 0}}>
            <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
            {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} post />}
          </span>
        </React.Fragment>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    activePage: state.blogEditorActivePage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    },
    updateActivePage: (property, value) => {
      dispatch(updateActivePage(property, value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MouseHoverHOC(Radium(EditorPostsListRow)))
