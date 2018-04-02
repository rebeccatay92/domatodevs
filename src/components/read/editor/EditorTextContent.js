import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateActivePage } from '../../../actions/blogEditorActivePageActions'

// function getPageInfo (props) {
//   const post = props.pages.pagesArr[props.pages.activePostIndex]
//   if (post && post.type === 'BlogHeading') return {}
//   let title, location, content, startDay, endDay
//   if (props.pages.activePostIndex === 'home') {
//     title = props.blogTitle
//     content = props.blogContent
//   } else if (props.pages.activePostIndex !== 'fin') {
//     title = post.Post.title || post.Post.description
//     content = post.Post.textContent
//   }
//   return {
//     title,
//     content
//   }
// }

class EditorTextContent extends Component {
  // constructor (props) {
  //   super(props)
  //
  //   const {title, content} = getPageInfo(props)
  //
  //   this.state = {
  //     title,
  //     content
  //   }
  // }
  //
  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.pages.activePostIndex !== this.props.pages.activePostIndex) {
  //     const {title, content} = getPageInfo(nextProps)
  //
  //     this.setState({
  //       title,
  //       content
  //     })
  //   }
  // }

  render () {
    const {title, textContent, eventType} = this.props.page
    const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    if (post && post.type === 'BlogHeading') return null
    if (this.props.pages.activePostIndex === 'fin') return null
    return (
      <div style={{left: '60vw', width: '40vw', display: 'inline-block', verticalAlign: 'top', position: 'relative', backgroundColor: 'white', padding: '24px'}}>
        <label style={{margin: '8px 0'}}>{this.props.pages.activePostIndex === 'home' ? 'Blog Title' : 'Post Title'}</label>
        <input type='text' style={{width: '100%', padding: '8px'}} value={title} onChange={(e) => this.props.updateActivePage('title', e.target.value)} />
        {this.props.pages.activePostIndex !== 'home' &&
        <React.Fragment>
          <label style={{margin: '8px 0'}}>Location</label>
          <div>
            <input type='text' style={{width: eventType ? '80%' : '100%', padding: '8px'}} />
            {eventType && <input type='text' style={{width: '20%', padding: '8px'}} />}
          </div>
        </React.Fragment>}
        <label style={{margin: '8px 0'}}>Content</label>
        <textarea rows={10} style={{width: '100%', padding: '8px'}} value={textContent} onChange={(e) => this.props.updateActivePage('textContent', e.target.value)} />
        <input className='hashtagInput' type='text' placeholder='Add hashtags to get discovered by others' style={{width: '100%', padding: '8px', margin: '8px 0'}} />
        {this.props.pages.activePostIndex === 'home' &&
        <div>
          <label style={{margin: '8px 0'}}>No. of Days</label>
          <input type='number' style={{width: '20%', padding: '8px', margin: '8px'}} min={0} />
        </div>}
        <div style={{position: 'absolute', right: '24px', bottom: '-8px'}}>
          <button>Save</button>
          <button>Cancel</button>
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorTextContent)
