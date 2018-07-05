import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { changeActivePost } from '../../actions/readActions'

class PostTextContent extends Component {
  constructor (props) {
    super(props)

    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount () {
    this.container.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    this.container.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll (e) {
    function offset (el) {
      const rect = el.getBoundingClientRect()
      return { top: rect.top }
    }
    const pages = this.props.pages.pagesArr.length
    let activePostIndex = 0
    var hiddenElement = document.querySelector('#hidden-element')
    for (var i = 0; i < pages; i++) {
      var pageDiv = document.querySelector(`#page-${i}`)
      if (offset(hiddenElement).top - offset(pageDiv).top > 0) {
        activePostIndex = i
      }
    }
    if (this.props.pages.activePostIndex !== activePostIndex) {
      this.props.changeActivePost(activePostIndex)
    }
  }

  render () {
    // const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    // purpose of hidden element is to determine the position of the halfway point on the user's viewport
    return (
      <div ref={(el) => { this.container = el }} className='postTextContentContainer' style={{width: '30vw', height: 'calc(100vh - 52px)', display: 'inline-block', verticalAlign: 'top', position: 'relative', backgroundColor: 'white', padding: '0 32px', marginRight: '4px', overflowY: 'scroll', boxSizing: 'border-box'}}>
        <div id='hidden-element' style={{position: 'fixed', top: '50vh'}} />
        {this.props.pages.pagesArr.map((page, i) => {
          if (page.type === 'Homepage') {
            const dateCreatedString = moment(page.dateCreated).format('D MMM YYYY')
            return (
              <div style={{width: '100%', minHeight: '100%', display: 'flex', alignItems: 'center'}} key={i}>
                <div>
                  <div>
                    <span id={`page-${i}`} style={{fontFamily: 'Roboto', fontSize: '48px', fontWeight: '100', textTransform: 'uppercase'}}>{page.blogTitle}</span>
                  </div>
                  <div>
                    <div style={{maxWidth: '15%', display: 'inline-block', maxHeight: '15%'}}>
                      <img style={{borderRadius: '50%', maxWidth: '100%', maxHeight: '100%'}} src='https://www.facebook.com/search/async/profile_picture/?fbid=100004127490181&width=72&height=72' />
                    </div>
                    <div style={{maxWidth: 'calc(85% - 8px)', display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px'}}>
                      <div><span style={{fontSize: '24px'}}>By: {page.author}</span></div>
                      <div><span style={{fontSize: '16px'}}>{dateCreatedString}</span></div>
                    </div>
                  </div>
                  <div style={{width: '50%'}}>
                    <hr style={{marginBottom: '8px', marginTop: '16px'}} />
                  </div>
                  <div>
                    <span style={{paddingRight: '8px'}}><span style={{fontWeight: 'bold'}}>{page.noOfShares}</span> shares</span>
                    <span style={{padding: '0 8px'}}><span style={{fontWeight: 'bold'}}>{page.noOfLikes}</span> likes</span>
                    <span style={{padding: '0 8px'}}><span style={{fontWeight: 'bold'}}>{page.noOfViews}</span> views</span>
                  </div>
                </div>
              </div>
            )
          } else if (page.type === 'BlogHeading') {
            return (
              <div style={{width: '100%', minHeight: '100%', display: 'flex', alignItems: 'center'}} key={i}>
                <div>
                  <span id={`page-${i}`} style={{fontFamily: 'Roboto', fontSize: '48px', fontWeight: '100', textTransform: 'uppercase'}}>{page.BlogHeading.title}</span>
                </div>
              </div>
            )
          } else if (page.type === 'Post') {
            return (
              <div style={{width: '100%', minHeight: '100%', display: 'flex', alignItems: 'center'}} key={i}>
                <div>
                  <div>
                    <span id={`page-${i}`} style={{fontFamily: 'Roboto', fontSize: '48px', fontWeight: '100', textTransform: 'uppercase'}}>{page.Post.location ? page.Post.location.name : page.Post.eventType ? page.Post.eventType : page.Post.title}</span>
                  </div>
                  <div style={{width: '50%'}}>
                    <hr style={{marginBottom: 0, marginTop: '8px'}} />
                  </div>
                  <div>
                    {page.Post.eventType && <div>
                      <span style={{marginTop: '8px', padding: '8px', backgroundColor: 'rgb(245, 245, 245)', marginRight: '8px', display: 'inline-block'}}>Event</span>
                      <span>{page.Post.eventType}</span>
                    </div>}
                    {page.Post.cost && <div>
                      <span style={{marginTop: '8px', padding: '8px', backgroundColor: 'rgb(245, 245, 245)', marginRight: '8px', display: 'inline-block'}}>Cost</span>
                      <span>{page.Post.currency} {page.Post.cost}</span>
                    </div>}
                    {page.Post.bookingService && <div>
                      <span style={{marginTop: '8px', padding: '8px', backgroundColor: 'rgb(245, 245, 245)', marginRight: '8px', display: 'inline-block'}}>Service</span>
                      <span>{page.Post.bookingService}</span>
                    </div>}
                  </div>
                  <div style={{width: '100%'}}>
                    <hr style={{marginBottom: '8px', marginTop: '54px'}} />
                  </div>
                  <div>
                    <i style={{verticalAlign: 'middle'}} className='material-icons'>add_to_photos</i><span style={{verticalAlign: 'middle'}}>Add to Bucket</span>
                  </div>
                  <div style={{width: '100%'}}>
                    <hr style={{marginBottom: '8px', marginTop: '8px'}} />
                  </div>
                  <div style={{marginBottom: '56px'}}>
                    <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(page.Post.textContent)))} readOnly />
                  </div>
                </div>
              </div>
            )
          }
        })}
        {/* <div style={{width: '40vw', display: 'inline-block', padding: '36px'}}>
          {this.props.pages.activePostIndex === 'home' && (
            <span className='blogpostTitle' style={{textTransform: 'uppercase', display: 'block', textAlign: 'center', fontFamily: '\'Roboto\', sans-serif', fontWeight: '100', fontSize: '55px'}}>{this.props.blogTitle}</span>
          )}
          {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && post.type === 'Post' && !post.Post.contentOnly && (
            <span className='blogpostTitle' style={{textTransform: 'uppercase', display: 'block', textAlign: 'center', fontFamily: '\'Roboto\', sans-serif', fontWeight: '100', fontSize: '55px'}}>{post.Post.location.name}{post.Post.description && ' - ' + post.Post.description}</span>
          )}
          {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && post.type === 'Post' && post.Post.contentOnly && (
            <span className='blogpostTitle' style={{textTransform: 'uppercase', display: 'block', textAlign: 'center', fontFamily: '\'Roboto\', sans-serif', fontWeight: '100', fontSize: '55px'}}>{post.Post.title}</span>
          )}
          {this.props.pages.activePostIndex !== 'fin' && <hr style={{margin: '0 auto', width: 'calc(100% / 3)'}} />}
          <div style={{textAlign: 'center', marginBottom: '24px'}}>
            {this.props.pages.activePostIndex === 'home' && <React.Fragment>
              <span style={{padding: '0 8px'}}><span style={{fontWeight: 'bold'}}>{this.props.noOfShares}</span> shares</span>
              <span style={{padding: '0 8px'}}><span style={{fontWeight: 'bold'}}>{this.props.noOfLikes}</span> likes</span>
              <span style={{padding: '0 8px'}}><span style={{fontWeight: 'bold'}}>{this.props.noOfViews}</span> views</span>
            </React.Fragment>}
          </div>
          <div style={{position: 'relative', height: this.props.pages.activePostIndex === 'home' ? '56px' : '32px'}}>
            {this.props.pages.activePostIndex === 'home' && <span><span style={{fontSize: '20px'}}>By {this.props.blogAuthor}</span><br /><span>{dateCreatedString}</span></span>}
            {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && post[post.type].location && <span style={{position: 'absolute', bottom: '8px', left: '0'}}><i style={{verticalAlign: 'middle', color: 'rgb(60, 58, 68)', fontSize: '14px'}} className='material-icons'>place</i><span style={{verticalAlign: 'middle'}}>{post[post.type].location.name}</span></span>}
            <div style={{position: 'absolute', bottom: '8px', right: '0'}}>
              {this.props.pages.activePostIndex === 'home' && <span style={{cursor: 'pointer'}}><i style={{verticalAlign: 'middle', WebkitTextStroke: '1px rgba(60, 58, 68, 1)', WebkitTextFillColor: '#FFFFFF', fontSize: '20px'}} className='material-icons'>thumb_up</i><span style={{padding: '8px'}}>Like</span></span>}
              {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && <span style={{cursor: 'pointer'}}><i style={{verticalAlign: 'middle', color: 'rgb(60, 58, 68)', fontSize: '20px', width: '16px'}} className='material-icons'>bookmark_border</i><span style={{padding: '8px'}}>Bookmark</span></span>}
              {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && <span style={{cursor: 'pointer'}}><i style={{verticalAlign: 'middle', color: 'rgb(60, 58, 68)', fontSize: '20px'}} className='material-icons'>library_add</i><span style={{padding: '8px'}}>Bucket</span></span>}
              {this.props.pages.activePostIndex !== 'fin' && <span style={{cursor: 'pointer'}}><i style={{verticalAlign: 'middle', color: 'rgb(60, 58, 68)', fontSize: '20px'}} className='material-icons'>share</i><span style={{padding: '8px'}}>Share</span></span>}
              {this.props.pages.activePostIndex !== 'fin' && <i style={{verticalAlign: 'middle', color: 'rgb(60, 58, 68)', fontSize: '20px', cursor: 'pointer'}} className='material-icons'>more_vert</i>}
            </div>
          </div>
          {this.props.pages.activePostIndex !== 'fin' && <hr style={{margin: '0 0 24px 0'}} />}
          <div>
            {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && (
              <span>{post[post.type].textContent.split('\n').map((content, i) => {
                return (
                  <span key={i}>
                    {content}
                    <br />
                  </span>
                )
              })}</span>
            )}
            {this.props.pages.activePostIndex === 'home' && (
              // <span>
              //   {this.props.blogContent.split('\n').map((content, i) => {
              //     return (
              //       <span key={i}>
              //         {content}
              //         <br />
              //       </span>
              //     )
              //   })}
              // </span>
              // <Editor editorState={this.props.blogContent} readOnly />
              <span>homepage</span>
            )}
            {this.props.pages.activePostIndex === 'home' && this.props.blogHashtags.length > 0 && (
              <div style={{color: '#ed685a'}}>
                <br />
                {this.props.blogHashtags.map((hashtag, i) => {
                  return (
                    <span key={i}>{'#' + hashtag.name + ' '}</span>
                  )
                })}
              </div>
            )}
            {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && post[post.type].hashtags.length > 0 && (
              <div style={{color: '#ed685a'}}>
                <br />
                {post[post.type].hashtags.map((hashtag, i) => {
                  return (
                    <span key={i}>{'#' + hashtag.name + ' '}</span>
                  )
                })}
              </div>
            )}
          </div>
        </div> */}
        {/* {this.props.pages.activePostIndex !== 'home' &&
          <div style={{position: 'fixed', width: '24px', height: '24px', top: 'calc(50vh - 28px - 12px + 56px)', left: '61vw'}}>
            <i onClick={() => this.changePage(this.props.pages.activePostIndex, 'last')} className='material-icons read-navigation' style={{cursor: 'pointer', opacity: '0.4'}}>keyboard_arrow_left</i>
          </div>
        }
        {this.props.pages.activePostIndex !== 'fin' &&
          <div style={{position: 'fixed', width: '24px', height: '24px', top: 'calc(50vh - 28px - 12px + 56px)', left: '97vw'}}>
            <i onClick={() => this.changePage(this.props.pages.activePostIndex, 'next')} className='material-icons read-navigation' style={{cursor: 'pointer', opacity: '0.4'}}>keyboard_arrow_right</i>
          </div>
        } */}
      </div>
    )
  }

  // changePage (currentIndex, type) {
  //   const postsArr = this.props.pages.pagesArr.filter(page => page.type === 'Post')
  //   let newIndex
  //   if (currentIndex === postsArr[postsArr.length - 1].loadSequence - 1 && type === 'next') newIndex = 'fin'
  //   else if (currentIndex === 'home') newIndex = postsArr[0].loadSequence - 1
  //   else if (currentIndex === 'fin') newIndex = postsArr[postsArr.length - 1].loadSequence - 1
  //   else if (currentIndex === postsArr[0].loadSequence - 1 && type === 'last') newIndex = 'home'
  //   else if (type === 'next') newIndex = postsArr[postsArr.findIndex(post => post.loadSequence - 1 === currentIndex) + 1].loadSequence - 1
  //   else if (type === 'last') newIndex = postsArr[postsArr.findIndex(post => post.loadSequence - 1 === currentIndex) - 1].loadSequence - 1
  //
  //   this.props.changeActivePost(newIndex)
  // }
}

const mapStateToProps = (state) => {
  return {
    pages: state.blogPosts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostTextContent)
