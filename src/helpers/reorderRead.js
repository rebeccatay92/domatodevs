// [readObj]
// type
// modelId
// loadSequence
// obj itself -> Heading or Post

// reordering of BlogHeading, Posts
// given new arr of blogContent, produce arr of changes [reorderBlogContentInput]
export function reorderBlogContent (blogContentArr) {
  console.log('blogContentArr', blogContentArr)
  let arrOfChanges = []
  blogContentArr.forEach((obj, index) => {
    let correctLoadSequence = index + 1
    if (obj.loadSequence !== correctLoadSequence) {
      arrOfChanges.push({
        type: obj.type,
        modelId: obj.modelId,
        loadSequence: correctLoadSequence
      })
    }
  })
  return arrOfChanges
}

// mediaBlog / mediaPost obj = {id: ID, MediumID: ID, Blog/PostId: ID, loadSequence, caption}
// either reorder MediaBlog or MediaPost
export function reorderMedia (mediaArr) {
  console.log('mediaArr', mediaArr)
  let arrOfChanges = []
  mediaArr.forEach((obj, index) => {
    let correctLoadSequence = index + 1
    if (obj.loadSequence !== correctLoadSequence) {
      arrOfChanges.push({
        id: obj.id, // join table id, not MediumId
        loadSequence: correctLoadSequence
      })
    }
  })
  return arrOfChanges
}
