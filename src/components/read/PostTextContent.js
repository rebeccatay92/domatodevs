import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { changeActivePost } from '../../actions/readActions'

class PostTextContent extends Component {
  render () {
    const dateCreatedString = moment(this.props.dateCreated).format('D MMM YYYY')
    const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    return (
      <div style={{left: '60vw', width: '40vw', display: 'inline-block', verticalAlign: 'top', position: 'relative', backgroundColor: 'white'}}>
        <div style={{width: '40vw', height: 'calc(100vh - 60px)', display: 'inline-block', padding: '36px'}}>
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
              <span>
                {this.props.blogContent.split('\n').map((content, i) => {
                  return (
                    <span key={i}>
                      {content}
                      <br />
                    </span>
                  )
                })}
              </span>
            )}
          </div>
        </div>
        {this.props.pages.activePostIndex !== 'home' && <div style={{position: 'fixed', width: '24px', height: '24px', top: 'calc(50vh - 28px - 12px + 56px)', left: '61vw'}}>
          <i onClick={() => this.changePage(this.props.pages.activePostIndex, 'last')} className='material-icons read-navigation' style={{cursor: 'pointer', opacity: '0.4'}}>keyboard_arrow_left</i>
        </div>}
        {this.props.pages.activePostIndex !== 'fin' && <div style={{position: 'fixed', width: '24px', height: '24px', top: 'calc(50vh - 28px - 12px + 56px)', left: '97vw'}}>
          <i onClick={() => this.changePage(this.props.pages.activePostIndex, 'next')} className='material-icons read-navigation' style={{cursor: 'pointer', opacity: '0.4'}}>keyboard_arrow_right</i>
        </div>}
      </div>
    )
  }

  changePage (currentIndex, type) {
    const postsArr = this.props.pages.pagesArr.filter(page => page.type === 'Post')
    let newIndex
    if (currentIndex === postsArr[postsArr.length - 1].loadSequence - 1 && type === 'next') newIndex = 'fin'
    else if (currentIndex === 'home') newIndex = postsArr[0].loadSequence - 1
    else if (currentIndex === 'fin') newIndex = postsArr[postsArr.length - 1].loadSequence - 1
    else if (currentIndex === postsArr[0].loadSequence - 1 && type === 'last') newIndex = 'home'
    else if (type === 'next') newIndex = postsArr[postsArr.findIndex(post => post.loadSequence - 1 === currentIndex) + 1].loadSequence - 1
    else if (type === 'last') newIndex = postsArr[postsArr.findIndex(post => post.loadSequence - 1 === currentIndex) - 1].loadSequence - 1

    this.props.changeActivePost(newIndex)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    }
  }
}

export default connect(null, mapDispatchToProps)(PostTextContent)
