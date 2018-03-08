import React, { Component } from 'react'

class PostsList extends Component {
  render () {
    return (
      <div style={{display: 'inline-block', width: '15vw', height: 'calc(100vh - 60px)', overflow: 'hidden'}}>
        <div style={{overflowY: 'scroll', width: '110%', height: '100%', paddingRight: '10%'}}>
          <ul style={{fontSize: '13px', listStyleType: 'none', padding: '24px 24px 0 24px', width: '15vw'}}>
            <li style={{textAlign: 'center', position: 'relative'}}><hr style={{position: 'absolute', width: '100%', top: '17px', margin: 0}} /><span style={{display: 'inline-block', padding: '8px', position: 'relative', backgroundColor: 'white'}}>Home</span></li>
            {this.props.posts.postsArr.map(post => {
              if (post.type === 'Heading') {
                return (
                  <li><span style={{display: 'inline-block', fontWeight: 'bold', padding: '8px 0'}}>{post.title}</span></li>
                )
              } else if (post.type === 'ContentOnly') {
                return (
                  <li><span style={{display: 'inline-block', padding: '8px 0 8px 8px'}}>{post.title}</span></li>
                )
              } else if (post.type === 'Event') {
                return (
                  <li><span style={{display: 'inline-block', padding: '8px 0 8px 8px'}}>{post.location} - {post.description}</span></li>
                )
              }
            })}
            <li style={{textAlign: 'center', position: 'relative'}}><hr style={{position: 'absolute', width: '100%', top: '17px', margin: 0}} /><span style={{display: 'inline-block', padding: '8px', position: 'relative', backgroundColor: 'white'}}>fin</span></li>
          </ul>
        </div>
      </div>
    )
  }
}

export default PostsList
