import { coreColors, coreFonts } from './cores'

// NEEDS RADIUM? YES
const homePageContainer = {
  width: '1096px', // width of 4 thumbnails + 3 gutter
  minHeight: 'calc(100vh - 52px)', // minus off horizontal tabs
  margin: '0 auto',
  position: 'relative'
}

const tabsBar = {
  height: '56px',
  width: '100%',
  borderBottom: `1px solid ${coreColors.black03}`,
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center'
}

const unclickedTab = {
  ...coreFonts.robotoLight,
  color: coreColors.black03,
  height: '56px',
  margin: '0 40px 0 0',
  borderBottom: '3px solid transparent',
  lineHeight: '56px',
  cursor: 'pointer'
}
const clickedTab = {
  ...unclickedTab,
  color: coreColors.pinkSolid,
  borderBottom: `3px solid ${coreColors.pinkSolid}`
}

/* ----------------------------- */
const blogSectionContainer = {
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'flex-start',
  alignContent: 'flex-start',
  // add back 2*12px margin for 1st and last
  width: 'calc(100% + 24px)',
  minHeight: 'calc(100vh - 52px - 56px)',
  // negative margin to counter 1st and last thumbnail
  margin: '12px -12px'
}
/* ----------------------------- */

const blogThumbnailContainer = {
  width: '256px',
  height: '250px', // for top row, img, bottom row
  margin: '12px' // 24px spacing between thumbnails
}

/* ----------------------------- */
const blogThumbnailTopInfoRow = {
  width: '100%',
  height: '50px',
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between' // divide into left n right sections
}

const blogThumbnailAuthorContainer = {
  display: 'inline-flex',
  flexFlow: 'row nowrap'
}

const authorProfilePic = {
  height: '36px',
  width: '36px',
  borderRadius: '50%',
  marginRight: '5px',
  cursor: 'pointer'
}

const publishInfoContainer = {
  height: '36px',
  width: '100px'
}

const authorName = {
  display: 'block',
  height: '18px',
  lineHeight: '18px',
  ...coreFonts.robotoRegular,
  color: coreColors.black07,
  fontSize: '12px',
  cursor: 'pointer'
}

const authorNameHover = {
  ':hover': {
    color: coreColors.blackSolid
  }
}

const publishDate = {
  display: 'block',
  height: '18px',
  lineHeight: '18px',
  ...coreFonts.robotoRegular,
  color: coreColors.black07,
  fontSize: '12px'
}

const countryName = {
  ...coreFonts.robotoRegular,
  color: coreColors.black07,
  fontSize: '12px',
  textDecoration: 'underline',
  cursor: 'pointer',
  ':hover': {
    color: coreColors.blackSolid
  }
}
/* ----------------------------- */

const thumbnailImageContainer = {
  width: '256px',
  height: '144px',
  cursor: 'pointer'
}
/* ----------------------------- */

const blogThumbnailBottomInfoRow = {
  width: '100%',
  height: 'calc(250px - 50px - 144px)',
  border: '1px solid red'
}

/* ----------------------------- */
export const HomePageStyles = {
  homePageContainer,
  // horizontal tabs
  tabsBar,
  unclickedTab,
  clickedTab,
  // blogs section container
  blogSectionContainer,
  blogThumbnailContainer,
  // top info row
  blogThumbnailTopInfoRow,
  blogThumbnailAuthorContainer, // left aligned stuff
  authorProfilePic,
  publishInfoContainer,
  authorName,
  authorNameHover,
  publishDate,
  countryName,
  // image
  thumbnailImageContainer,
  // bottom info row
  blogThumbnailBottomInfoRow
}
