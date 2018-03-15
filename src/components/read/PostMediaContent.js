import React, { Component } from 'react'

class PostMediaContent extends Component {
  render () {
    const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    return (
      <div style={{position: 'fixed', top: '56px', left: '15vw', width: '45vw', height: 'calc(100vh - 60px)', display: 'inline-block', verticalAlign: 'top', backgroundColor: '#F5F5F5'}}>
        {post && post.Post &&
          <React.Fragment>
            <div style={{height: '75vh', display: 'inline-block', position: 'relative'}}>
              <div style={{position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>
                <img style={{maxWidth: '100%', maxHeight: '75vh', verticalAlign: 'middle'}} src={post.Post.media[0].url} />
                <div style={{height: '4vh', width: '6vh', textAlign: 'center', position: 'absolute', lineHeight: '4vh', top: '16px', right: '16px', backgroundColor: 'rgba(60, 58, 68, 0.5)', color: 'white'}}>
                  1/2
                </div>
                <div style={{height: '5vh', textAlign: 'center', position: 'absolute', lineHeight: '5vh', bottom: 0, left: 0, right: 0, color: 'white', backgroundColor: 'rgba(60, 58, 68, 0.5)'}}>
                  <span>{post.Post.media[0].caption}</span>
                </div>
              </div>
            </div>
            <div style={{height: 'calc(100vh - 75vh - 60px)'}}>
              {post.Post.media.map((medium, i) => {
                return <img key={i} src={medium.url} style={{maxHeight: '100%'}} />
              })}
            </div>
          </React.Fragment>
        }
      </div>
    )
  }
}

export default PostMediaContent
