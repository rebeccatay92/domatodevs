import React, { Component } from 'react'

class PostTextContent extends Component {
  render () {
    const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    return (
      <div style={{width: '35vw', height: 'calc(100vh - 60px)', display: 'inline-block', verticalAlign: 'top', padding: '24px'}}>
        {this.props.pages.activePostIndex === 'home' && (
          <span style={{textTransform: 'uppercase', fontSize: '56px', display: 'block', textAlign: 'center', fontFamily: '\'Roboto\', sans-serif', fontWeight: '100'}}>India - Part I</span>
        )}
        {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && !post.contentOnly && (
          <span style={{textTransform: 'uppercase', fontSize: '56px', display: 'block', textAlign: 'center', fontFamily: '\'Roboto\', sans-serif', fontWeight: '100'}}>{post.location}{post.description && ' - ' + post.description}</span>
        )}
        {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && post.contentOnly && (
          <span style={{textTransform: 'uppercase', fontSize: '56px', display: 'block', textAlign: 'center', fontFamily: '\'Roboto\', sans-serif', fontWeight: '100'}}>{post.title}</span>
        )}
        <hr style={{margin: '0 0 24px 0'}} />
        {this.props.pages.activePostIndex !== 'home' && this.props.pages.activePostIndex !== 'fin' && (
          <span>{post.textContent.split('\n').map((content, i) => {
            return (
              <span key={i}>
                {content}
                <br />
              </span>
            )
          })}</span>
        )}
      </div>
    )
  }
}

export default PostTextContent
