import { coreColors, coreFonts } from './cores'

// NEEDS RADIUM ?  NOT YET. UNLESS HOVER OVER HASHTAGS, COUNTRY IS ENABLED

const blogsTabContainer = {
  // width: '1265px',
  // 303px * 4 thumbnails. + 3 gutters of 18px each = 1266
  // 9px negative margin on each side = 18px
  width: 'calc(1266px + 18px)',
  height: 'calc(100vh - 108px)',
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  alignContent: 'flex-start',
  paddingTop: '9px',
  margin: '0 -9px'
}

/* ----------------------------- */
const blogThumbnailContainer = {
  width: '303px',
  height: 'calc(171px + 86px)', // height need to be img 171px + bottom info section
  margin: '9px'
}
/* ----------------------------- */
const thumbnailImageContainer = {
  position: 'relative',
  width: '303px',
  height: '171px'
}

const blogPublishedIconContainer = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  position: 'absolute',
  right: '8px',
  top: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: coreColors.greenSolid,
  cursor: 'pointer'
}

const blogPrivateIconContainer = {
  ...blogPublishedIconContainer,
  background: coreColors.pinkSolid
}

const publishToggleIcon = {
  color: coreColors.whiteSolid
}
/* ----------------------------- */

const bottomInfoContainer = {
  width: '303px',
  // need to add 4 rows together
  // title row -> 24px
  // hashtags row -> 18px
  // views text -> 18px
  // country and publish date row -> 26px
  height: '86px'
}

const countryAndTimeFromPublishDateRow = {
  width: '100%',
  height: '26px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const countryName = {
  ...coreFonts.robotoRegular,
  color: coreColors.black07,
  fontSize: '12px',
  lineHeight: '26px',
  textDecoration: 'underline',
  cursor: 'pointer'
  // ':hover': {
  //   color: coreColors.blackSolid
  // }
}

// reised. modify to inline
const timeFromPublishDate = {
  lineHeight: '26px',
  ...coreFonts.robotoRegular,
  color: coreColors.black07,
  fontSize: '12px'
}

// reuse from homepage
const blogTitleRow = {
  height: '24px',
  width: '100%',
  overflow: 'hidden'
}

// reused
const blogTitle = {
  display: 'block',
  ...coreFonts.garamondRegular,
  color: coreColors.black07,
  fontSize: '18px',
  lineHeight: '24px'
}

// reused
const blogTagsRow = {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '18px',
  overflow: 'hidden'
}

const blogTags = {
  ...coreFonts.garamondRegular,
  color: coreColors.greenSolid,
  fontSize: '14px',
  lineHeight: '18px',
  cursor: 'pointer'
  // ':hover': {
  //   color: 'rgba(59, 119, 135, 1)' // doesnt work even with unique keys.
  // }
}

const blogTagsSpacer = {
  color: coreColors.greenSolid,
  fontSize: '14px',
  lineHeight: '18px',
  margin: '0 5px'
}

const blogViewsText = {
  ...coreFonts.garamondRegular,
  fontSize: '14px',
  lineHeight: '18px',
  color: coreColors.pinkSolid
}
/* ----------------------------- */
export const BlogsTabStyles = {
  blogsTabContainer,
  // height of thumbnail container is img + bottom info section
  blogThumbnailContainer,
  // img container is img + icon
  thumbnailImageContainer,
  blogPublishedIconContainer,
  blogPrivateIconContainer,
  publishToggleIcon,
  // 4 rows of info text below the img
  bottomInfoContainer,
  countryAndTimeFromPublishDateRow,
  countryName,
  timeFromPublishDate,
  blogTitleRow,
  blogTitle,
  blogTagsRow,
  blogTags,
  blogTagsSpacer,
  blogViewsText
}
