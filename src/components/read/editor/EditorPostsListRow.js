import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { DropTarget, DragSource } from 'react-dnd'
import Radium from 'radium'

import BlogDropdownMenu from './BlogDropdownMenu'
import EditorPostsListEmptyRow from './EditorPostsListEmptyRow'

import { changeActivePost, initializePosts } from '../../../actions/readActions'
import { updateActivePage } from '../../../actions/blogEditorActivePageActions'
import { toggleSpinner } from '../../../actions/spinnerActions'

import { updateBlogHeading } from '../../../apollo/blogHeading'
import { queryBlog } from '../../../apollo/blog'
import { updatePost, updateMultiplePosts } from '../../../apollo/post'
import { reorderBlogContent } from '../../../apollo/reorderBlogContent'

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

const pageSource = {
  beginDrag (props) {
    return props.page
  },
  endDrag (props, monitor) {
    // For all types
    const draggedPage = monitor.getItem()
    const indexOfEmptyGap = props.pagesArr.findIndex(page => page.isEmpty)
    const newPagesArr = [...props.pagesArr.slice(0, indexOfEmptyGap), ...[draggedPage], ...draggedPage.Post && draggedPage.Post.childPosts.slice().sort((a, b) => a.loadSequence - b.loadSequence).map(post => {
      return {type: 'Post', modelId: post.id, Post: {ParentPostId: draggedPage.modelId}}
    }), ...props.pagesArr.slice(indexOfEmptyGap + 1)].map((page, i) => {
      return {...page, ...{loadSequence: i + 1}}
    })
    const loadSeqArr = newPagesArr.map(page => {
      return {
        type: page.type,
        modelId: page.modelId,
        loadSequence: page.loadSequence
      }
    })

    props.toggleSpinner(true)

    props.reorderBlogContent({
      variables: {
        input: loadSeqArr
      }
    })
    .then(() => {
      let indexOfNextHeaderOrPost = newPagesArr.findIndex((page, i) => {
        return i > indexOfEmptyGap && (page.type === 'BlogHeading' || (page.type === 'Post' && !page.Post.ParentPostId))
      })
      if (indexOfNextHeaderOrPost === -1) {
        indexOfNextHeaderOrPost = newPagesArr.length
      }
      let subpostsArr = [] // Array of subposts that need to change parent.
      if (indexOfNextHeaderOrPost > indexOfEmptyGap + 1) {
        subpostsArr = newPagesArr.slice(indexOfEmptyGap + 1, indexOfNextHeaderOrPost).map(page => {
          return {
            id: page.modelId,
            ParentPostId: draggedPage.modelId
          }
        })
      }
      let indexOfPrevParentPost = -1
      newPagesArr.slice(0, indexOfEmptyGap).forEach((page, i) => {
        if (page.type === 'Post' && !page.Post.ParentPostId) indexOfPrevParentPost = i
      })
      // Subpost to Subpost
      if (draggedPage.type === 'Post' && draggedPage.Post.ParentPostId && props.dragDropType === 'subpost') {
        return props.updateMultiplePosts({
          variables: {
            input: [{
              id: draggedPage.modelId,
              ParentPostId: newPagesArr[indexOfPrevParentPost].modelId
            }]
          }
        })
        // Subpost to Post
      } else if (draggedPage.type === 'Post' && draggedPage.Post.ParentPostId && props.dragDropType === 'post') {
        const droppedPageInput = {
          id: draggedPage.modelId,
          ParentPostId: null
        }
        const newPostsArr = [...[droppedPageInput], ...subpostsArr]
        return props.updateMultiplePosts({
          variables: {
            input: newPostsArr
          }
        })
        // Post to Post
      } else if (draggedPage.type === 'Post' && props.dragDropType === 'post') {
        const newPostsArr = subpostsArr
        return props.updateMultiplePosts({
          variables: {
            input: newPostsArr
          }
        })
        // Post to Subpost
      } else if (draggedPage.type === 'Post' && props.dragDropType === 'subpost') {
        const droppedPageInput = {
          id: draggedPage.modelId,
          ParentPostId: newPagesArr[indexOfPrevParentPost].modelId
        }
        subpostsArr = newPagesArr.slice(indexOfEmptyGap + 1, indexOfNextHeaderOrPost).map(page => {
          return {
            id: page.modelId,
            ParentPostId: newPagesArr[indexOfPrevParentPost].modelId
          }
        })
        const newPostsArr = [...[droppedPageInput], ...subpostsArr]
        return props.updateMultiplePosts({
          variables: {
            input: newPostsArr
          }
        })
      }
    })
    .then(() => {
      return props.data.refetch()
    })
    .then(response => {
      props.initializePosts(response.data.findBlog.pages)
      props.toggleSpinner(false)
    })
  }
}

const pageTarget = {
  hover (props, monitor) {
    // if (props.page.isEmpty) return
    const draggedPage = monitor.getItem()
    // if (draggedPage.type === 'BlogHeading' && props.nextPageType === 'Post') return
    const newPagesArrWithoutGap = props.pagesArr.filter(page => {
      return page.modelId
    })
    let newPagesArr
    if (draggedPage.type === 'BlogHeading' && props.nextPageIsSubpost && props.prevPageIsSubpost) return
    if (draggedPage.type === 'BlogHeading' && !props.prevPageIsSubpost && props.page.type === 'Post' && props.page.Post.ParentPostId) return
    if (draggedPage.type === 'BlogHeading' && props.nextPageIsSubpost && !props.prevPageIsSubpost) {
      newPagesArr = [...newPagesArrWithoutGap.slice(0, props.i - 1), ...[{...draggedPage, ...{modelId: null, isEmpty: true}}], ...newPagesArrWithoutGap.slice(props.i - 1)]
      .filter(page => {
        return page.modelId !== draggedPage.modelId || page.type !== draggedPage.type
      })
    } else if (draggedPage.type === 'BlogHeading' && props.page.type === 'Post' && props.page.Post.ParentPostId) {
      newPagesArr = [...newPagesArrWithoutGap.slice(0, props.i + 1), ...[{...draggedPage, ...{modelId: null, isEmpty: true}}], ...newPagesArrWithoutGap.slice(props.i + 1)]
      .filter(page => {
        return page.modelId !== draggedPage.modelId || page.type !== draggedPage.type
      })
    } else {
      newPagesArr = [...newPagesArrWithoutGap.slice(0, props.i), ...[{...draggedPage, ...{modelId: null, isEmpty: true}}], ...newPagesArrWithoutGap.slice(props.i)]
      .filter(page => {
        return page.modelId !== draggedPage.modelId || page.type !== draggedPage.type
      }).filter(page => {
        // filter out subPosts if a parent post is dragged
        let isNotSubPostOfDraggedPage = true
        if (draggedPage.type === 'Post' && page.type === 'Post' && draggedPage.Post.childPosts.length > 0) {
          draggedPage.Post.childPosts.forEach(child => {
            if (page.modelId === child.id) isNotSubPostOfDraggedPage = false
          })
        }
        return isNotSubPostOfDraggedPage
      })
    }
    props.initializePosts(newPagesArr)
  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    getItem: monitor.getItem()
  }
}

const MouseHoverHOC = (WrappedComponent, elemType) => {
  return class extends Component {
    constructor (props) {
      super(props)

      this.state = {
        hover: false
      }
    }

    render () {
      if (!elemType || elemType === 'li') {
        return (
          <li style={{position: 'relative', padding: '0 24px'}} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
            <WrappedComponent hover={this.state.hover} removeHover={() => this.setState({hover: false})} {...this.props} />
          </li>
        )
      } else if (elemType === 'div') {
        return (
          <div style={{position: 'relative'}} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
            <WrappedComponent hover={this.state.hover} removeHover={() => this.setState({hover: false})} {...this.props} />
          </div>
        )
      }
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
      dropdown: false,
      editingHeading: false,
      newHeadingTitle: this.props.page.type === 'BlogHeading' && this.props.page.BlogHeading.title
      // headingTitle: this.props.page.type === 'BlogHeading' && this.props.page.BlogHeading.title
    }

    this.dropdownStyle = () => {
      return {color: this.state.dropdown ? '#ed685a' : '#3C3A44', fontSize: '16px', marginLeft: '4px', cursor: 'pointer', opacity: (this.props.hover || this.state.dropdown) && !this.props.getItem ? '1.0' : 0, position: 'absolute', ':hover': {color: '#ed685a'}}
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

  componentWillReceiveProps (nextProps) {
    // if (nextProps.getItem && !this.props.getItem) {
    //   this.props.removeHover()
    // }
    if (nextProps.page.BlogHeading && (!this.props.page.BlogHeading || nextProps.page.BlogHeading.title !== this.props.page.BlogHeading.title)) {
      this.setState({
        newHeadingTitle: nextProps.page.BlogHeading.title
      })
    }
  }

  toggleDropdown (e) {
    if (e) {
      if (e.target.textContent === 'more_horiz' && e.target.id == this.props.i) return
    }
    this.setState({
      dropdown: false
    })
    this.props.removeHover()
  }

  handleHeadingSave () {
    this.props.toggleSpinner(true)

    this.props.updateBlogHeading({
      variables: {
        id: this.props.page.modelId,
        title: this.state.newHeadingTitle
      }
    })
    .then(() => {
      return this.props.data.refetch()
    })
    .then(response => {
      this.props.initializePosts(response.data.findBlog.pages)
      this.setState({editingHeading: false})
      this.props.toggleSpinner(false)
    })
  }

  render () {
    if (this.props.empty) {
      return (
        <React.Fragment>
          <EditorPostsListEmptyRow page={this.props.page} i={this.props.i} pagesArr={this.props.pagesArr} blogId={this.props.blogId} prevPageType={this.props.prevPageType} nextPageType={this.props.nextPageType} nextPageIsSubpost={this.props.nextPageIsSubpost} />
          <EditorPostsListEmptyRow nested page={this.props.page} i={this.props.i} pagesArr={this.props.pagesArr} blogId={this.props.blogId} prevPageType={this.props.prevPageType} nextPageType={this.props.nextPageType} nextPageIsSubpost={this.props.nextPageIsSubpost} />
        </React.Fragment>
      )
    }
    const type = this.props.page.type
    const {page, i, activePostIndex, connectDragSource, connectDragPreview, connectDropTarget} = this.props
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

    const dragHandler = <i className='material-icons' style={{position: 'absolute', left: '2px', fontSize: '20px', cursor: 'move', opacity: this.props.getItem ? '0' : '1'}}>unfold_more</i>

    if (page.type === 'BlogHeading') {
      if (this.state.editingHeading) {
        return (
          <React.Fragment key={i}>
            <span style={{color: '#ed685a', display: 'inline-block', paddingBottom: '8px'}}>Header
            </span>
            <input autoFocus type='text' style={{width: '100%', marginBottom: '8px', padding: '8px'}} value={this.state.newHeadingTitle} onChange={(e) => this.setState({newHeadingTitle: e.target.value})} />
            <span style={{position: 'absolute', right: 0, top: '0'}}>
              <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
              {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} heading />}
            </span>
            <div style={{marginBottom: '16px'}}>
              <button onClick={() => this.handleHeadingSave()}>Save</button>
              <button onClick={() => {
                this.setState({editingHeading: false, newHeadingTitle: page.BlogHeading.title})
              }}>Cancel</button>
            </div>
          </React.Fragment>
        )
      }
      return connectDropTarget(connectDragPreview(
        <div key={i}>
          {this.props.hover && connectDragSource(dragHandler)}
          <span onClick={() => this.setState({editingHeading: true})} style={{display: 'inline-block', fontWeight: 'bold', padding: '0 0 16px 0', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'}}>{page.BlogHeading.title}</span>
          <span style={{position: 'absolute', right: '24px'}}>
            <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
            {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} heading />}
          </span>
        </div>
      ))
    } else if (page.type === 'Post' && page.Post.contentOnly) {
      if (activePostIndex === i) {
        return (
          <React.Fragment key={i}>
            <div style={{color: '#ed685a', paddingBottom: '8px'}}>{isSubPost
              ? <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span><span style={{width: '12px', display: 'inline-block'}}>|</span>Sub-Post</React.Fragment>
               : <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span>Post</React.Fragment>}
            </div>
            <span style={{position: 'absolute', right: '24px', top: 0}}>
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
      return connectDropTarget(connectDragPreview(
        <div key={i}><span onClick={() => this.props.changeActivePost(i)} style={{...{display: 'inline-block', padding: '0 0 16px 8px', color: '#3C3A44', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'}, ...!!this.props.page[type].ParentPostId && {padding: '0 0 16px 8px'}}}>{!!this.props.page[type].ParentPostId && <span style={{marginRight: '12px', display: 'inline-block'}}>&#8226;</span>}{page.Post.title}</span>
          {this.props.hover && connectDragSource(dragHandler)}
          <span style={{position: 'absolute', right: '24px'}}>
            <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
            {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} post />}
          </span>
        </div>
      ))
    } else if (page.type === 'Post' && !page.Post.contentOnly) {
      if (activePostIndex === i) {
        return (
          <React.Fragment key={i}>
            <div style={{color: '#ed685a', paddingBottom: '8px'}}>{isSubPost
              ? <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span><span style={{width: '12px', display: 'inline-block'}}>|</span>Sub-Post</React.Fragment>
               : <React.Fragment><span style={{width: '8px', display: 'inline-block'}}>|</span>Post</React.Fragment>}
            </div>
            <span style={{position: 'absolute', right: '24px', top: 0}}>
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
      return connectDropTarget(connectDragPreview(
        <div key={i}><span onClick={() => this.props.changeActivePost(i)} style={{...{display: 'inline-block', padding: '0 0 16px 8px', color: '#3C3A44', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'}, ...!!this.props.page[type].ParentPostId && {padding: '0 0 16px 8px'}}}>{!!this.props.page[type].ParentPostId && <span style={{marginRight: '12px', display: 'inline-block'}}>&#8226;</span>}{page.Post.location && page.Post.location.name + ' - '}{page.Post.description}</span>
          {this.props.hover && connectDragSource(dragHandler)}
          <span style={{position: 'absolute', right: '24px'}}>
            <i id={i} onClick={() => this.setState({dropdown: !this.state.dropdown})} style={this.dropdownStyle()} className='material-icons'>more_horiz</i>
            {this.state.dropdown && <BlogDropdownMenu blogId={this.props.blogId} i={i} toggleDropdown={(e) => this.toggleDropdown(e)} post />}
          </span>
        </div>
      ))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    activePage: state.blogEditorActivePage,
    dragDropType: state.editorPostsListDragDrop
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    },
    updateActivePage: (property, value) => {
      dispatch(updateActivePage(property, value))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    },
    initializePosts: (pages) => {
      dispatch(initializePosts(pages))
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.blogId
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(queryBlog, options),
  graphql(updateBlogHeading, { name: 'updateBlogHeading' }),
  graphql(updatePost, { name: 'updatePost' }),
  graphql(updateMultiplePosts, { name: 'updateMultiplePosts' }),
  graphql(reorderBlogContent, { name: 'reorderBlogContent' })
)(MouseHoverHOC(DragSource('page', pageSource, collectSource)(DropTarget(['page'], pageTarget, collectTarget)(Radium(EditorPostsListRow))))))
