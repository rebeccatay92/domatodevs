import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Editor } from 'draft-js'
import { changeActivePost } from '../../actions/readActions'

class PostTextContent extends Component {
  render () {
    // const dateCreatedString = moment(this.props.dateCreated).format('D MMM YYYY')
    // const post = this.props.pages.pagesArr[this.props.pages.activePostIndex]
    console.log('this.props.page', this.props.page, 'type', this.props.page.type)
    return (
      <div style={{width: '30vw', height: 'calc(100vh - 52px)', display: 'inline-block', verticalAlign: 'top', position: 'relative', backgroundColor: 'white', padding: '0 56px', overflowY: 'scroll', border: '1px solid red', boxSizing: 'border-box'}}>
        {this.props.page.type === 'homepage' &&
          <React.Fragment>
            <div style={{width: '100%', minHeight: 'calc(100vh - 52px)', borderBottom: '10px solid red'}}>
              {/* <h1>homepage with blog title, author and date section, likes, shares, views</h1> */}
              <h1 style={{marginBottom: '50px'}}>Title</h1>
              <span style={{fontFamily: 'Roboto, sans-serf', fontSize: '16px', lineHeight: '24px'}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras malesuada nisl at dignissim tempor. Aenean malesuada venenatis enim. Ut fringilla massa vitae ligula pulvinar maximus. Vivamus porta vel urna non ornare. Proin in elementum urna, non dapibus leo. Nunc nec pharetra risus. Curabitur ornare ipsum ex, sed molestie orci condimentum a. Nam eu eleifend sapien. Sed diam nisi, aliquet sed libero id, pharetra sodales metus. Aliquam ornare magna neque, malesuada ultrices risus pulvinar sed. Vestibulum nunc nisi, vulputate non neque auctor, vestibulum aliquam odio. Donec nibh nisl, aliquam at vestibulum vitae, mattis dapibus diam. Aliquam tempor tincidunt finibus. Integer vestibulum molestie diam et aliquam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam facilisis eget metus sed laoreet.

                Mauris dignissim sagittis volutpat. Suspendisse potenti. Quisque nec dignissim nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel libero molestie, porttitor elit id, facilisis enim. Nullam hendrerit ornare justo, id faucibus enim imperdiet in. In vulputate eu elit id egestas. Morbi eu justo ante. Sed est lorem, lobortis ut aliquet et, lacinia sit amet turpis. Quisque luctus cursus nisi, a dapibus tellus. Phasellus porta erat id justo sollicitudin, quis tincidunt lorem lobortis.

                Pellentesque maximus, ante vel molestie pellentesque, orci eros mattis ipsum, ac rhoncus diam eros et augue. Quisque aliquam convallis augue mattis consectetur. Curabitur sed tincidunt odio. Donec porta posuere nulla at tristique. Donec enim metus, porttitor a velit et, bibendum ornare elit. Morbi blandit fermentum magna, nec congue libero ultricies ut. Sed egestas tempus commodo. Vivamus hendrerit dui sit amet nibh mattis faucibus. Etiam non iaculis lectus, quis maximus dui. Donec vel tincidunt arcu. Pellentesque eu eros sapien.

                Proin ultricies sagittis arcu et tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean cursus, mauris in sagittis efficitur, purus risus gravida lacus, sit amet faucibus nunc elit et nunc. Nunc interdum vitae quam non scelerisque. Proin pharetra ac sem nec dapibus. Pellentesque imperdiet non est sit amet rutrum. Vestibulum vel massa malesuada, dapibus arcu non, congue mi. Duis efficitur ex leo, laoreet scelerisque felis porta ac. Maecenas id laoreet est. Maecenas at dui sem. Proin quis maximus nulla, non suscipit leo. Vestibulum pharetra mi eu varius congue.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.
              </span>
            </div>
            <div style={{width: '100%', minHeight: 'calc(100vh - 52px)'}}>
              {/* <h1>homepage with blog title, author and date section, likes, shares, views</h1> */}
              <h1 style={{marginBottom: '50px'}}>NEXT SECTION</h1>
              <span style={{fontFamily: 'Roboto, sans-serf', fontSize: '16px', lineHeight: '24px'}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras malesuada nisl at dignissim tempor. Aenean malesuada venenatis enim. Ut fringilla massa vitae ligula pulvinar maximus. Vivamus porta vel urna non ornare. Proin in elementum urna, non
              </span>
              <h1 style={{marginBottom: '200px'}}>SHORT CONTENT EMPTY SPACE</h1>
            </div>
            <div style={{width: '100%', minHeight: 'calc(100vh - 52px)', borderBottom: '10px solid red'}}>
              {/* <h1>homepage with blog title, author and date section, likes, shares, views</h1> */}
              <h1 style={{marginBottom: '50px'}}>NEXT SECTION</h1>
              <span style={{fontFamily: 'Roboto, sans-serf', fontSize: '16px', lineHeight: '24px'}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras malesuada nisl at dignissim tempor. Aenean malesuada venenatis enim. Ut fringilla massa vitae ligula pulvinar maximus. Vivamus porta vel urna non ornare. Proin in elementum urna, non dapibus leo. Nunc nec pharetra risus. Curabitur ornare ipsum ex, sed molestie orci condimentum a. Nam eu eleifend sapien. Sed diam nisi, aliquet sed libero id, pharetra sodales metus. Aliquam ornare magna neque, malesuada ultrices risus pulvinar sed. Vestibulum nunc nisi, vulputate non neque auctor, vestibulum aliquam odio. Donec nibh nisl, aliquam at vestibulum vitae, mattis dapibus diam. Aliquam tempor tincidunt finibus. Integer vestibulum molestie diam et aliquam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam facilisis eget metus sed laoreet.

                Mauris dignissim sagittis volutpat. Suspendisse potenti. Quisque nec dignissim nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel libero molestie, porttitor elit id, facilisis enim. Nullam hendrerit ornare justo, id faucibus enim imperdiet in. In vulputate eu elit id egestas. Morbi eu justo ante. Sed est lorem, lobortis ut aliquet et, lacinia sit amet turpis. Quisque luctus cursus nisi, a dapibus tellus. Phasellus porta erat id justo sollicitudin, quis tincidunt lorem lobortis.

                Pellentesque maximus, ante vel molestie pellentesque, orci eros mattis ipsum, ac rhoncus diam eros et augue. Quisque aliquam convallis augue mattis consectetur. Curabitur sed tincidunt odio. Donec porta posuere nulla at tristique. Donec enim metus, porttitor a velit et, bibendum ornare elit. Morbi blandit fermentum magna, nec congue libero ultricies ut. Sed egestas tempus commodo. Vivamus hendrerit dui sit amet nibh mattis faucibus. Etiam non iaculis lectus, quis maximus dui. Donec vel tincidunt arcu. Pellentesque eu eros sapien.

                Proin ultricies sagittis arcu et tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean cursus, mauris in sagittis efficitur, purus risus gravida lacus, sit amet faucibus nunc elit et nunc. Nunc interdum vitae quam non scelerisque. Proin pharetra ac sem nec dapibus. Pellentesque imperdiet non est sit amet rutrum. Vestibulum vel massa malesuada, dapibus arcu non, congue mi. Duis efficitur ex leo, laoreet scelerisque felis porta ac. Maecenas id laoreet est. Maecenas at dui sem. Proin quis maximus nulla, non suscipit leo. Vestibulum pharetra mi eu varius congue.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.

                Etiam quis arcu feugiat, blandit est vitae, pulvinar nulla. Donec vitae feugiat ipsum. Proin nibh ex, scelerisque vitae lacinia nec, cursus eget metus. Duis leo velit, fringilla sed eleifend ut, auctor at lacus. Nulla dignissim purus arcu, nec eleifend enim scelerisque eget. Nullam id elementum dui. Proin pretium accumsan venenatis.
              </span>
            </div>
          </React.Fragment>
        }
        {this.props.page.type === 'BlogHeading' &&
          <span>header only</span>
        }
        {this.props.page.type === 'Post' &&
          <span>post text content</span>
        }
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

const mapDispatchToProps = (dispatch) => {
  return {
    changeActivePost: (index) => {
      dispatch(changeActivePost(index))
    }
  }
}

export default connect(null, mapDispatchToProps)(PostTextContent)
