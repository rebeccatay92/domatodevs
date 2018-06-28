import { coreColors, coreFonts } from './cores'

// NEEDS RADIUM? YES
const homePageContainer = {
  // width: '1096px', // width of 4 thumbnails + 3 gutter
  width: '1266px',
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
  // width: 'calc(100% + 24px)',
  width: 'calc(100% + 18px)',
  minHeight: 'calc(100vh - 52px - 56px)',
  // negative margin to counter 1st and last thumbnail
  // margin: '12px 0 -12px -12px',
  paddingTop: '9px',
  margin: '0 -9px'
}
/* ----------------------------- */

const blogThumbnailContainer = {
  // width: '256px',
  // height: '254px', // for top row, img, bottom row
  // margin: '12px', // 24px spacing between thumbnails
  width: '303px',
  // height: '171px',
  height: 'calc(171px + 50px + 60px)', // img 171 plus top info 50 plus bottom info 60
  margin: '9px'
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

const timeFromPublishDate = {
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
  // width: '256px',
  // height: '144px',
  width: '303px',
  height: '171px',
  cursor: 'pointer'
}
/* ----------------------------- */

const blogThumbnailBottomInfoRow = {
  width: '100%',
  height: '60px'
  // 3 lines of text. 24px + 18px + 18px
}

const blogTitleRow = {
  height: '24px',
  width: '100%',
  overflow: 'hidden'
}

const blogTitle = {
  display: 'block',
  ...coreFonts.garamondRegular,
  color: coreColors.black07,
  fontSize: '18px',
  lineHeight: '24px'
}

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

const itinerarySectionContainer = {
  width: '100%',
  minHeight: 'calc(100vh - 52px - 56px)'
}

const itineraryRowContainer = {
  width: '100%',
  height: '135px',
  padding: '24px 0', // 135px - 48px padding = 87px for all content
  display: 'flex'
}

/* ----------------------------- */

const authorSectionContainer = {
  width: '120px',
  height: '100%',
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

const authorInfoText = {
  margin: 0,
  ...coreFonts.garamondRegular,
  fontSize: '16px',
  lineHeight: '21px',
  color: coreColors.blackSolid
}

const daysCountriesContainer = {
  width: '120px',
  height: '100%',
  borderRight: `1px solid ${coreColors.black03}`,
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

const daysNumber = {
  ...coreFonts.garamondRegular,
  fontSize: '30px',
  lineHeight: '39px',
  color: coreColors.black07,
  marginRight: '5px'
}

const daysText = {
  ...coreFonts.garamondRegular,
  fontSize: '13px',
  lineHeight: '17px',
  color: coreColors.black07
}

const countriesText = {
  ...coreFonts.garamondRegular,
  fontSize: '16px',
  lineHeight: '21px',
  color: coreColors.black07,
  margin: 0
}

const itineraryDetailsContainer = {
  width: '800px',
  height: '100%',
  paddingLeft: '25px',
  display: 'inline-flex',
  flexDirection: 'column'
}

const itineraryName = {
  ...coreFonts.garamondRegular,
  fontSize: '24px',
  lineHeight: '31px',
  color: coreColors.black07,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  margin: 0,
  marginBottom: '10px'
}

const itineraryDescription = {
  ...coreFonts.robotoLight,
  fontSize: '16px',
  lineHeight: '19px',
  height: '19px',
  color: coreColors.blackSolid,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  margin: 0
}

const itineraryTagsRow = {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  height: '21px'
}

const itineraryTags = {
  ...coreFonts.garamondRegular,
  color: coreColors.greenSolid,
  fontSize: '16px',
  lineHeight: '21px'
}

const itineraryTagsSpacer = {
  color: coreColors.greenSolid,
  fontSize: '14px',
  lineHeight: '21px',
  margin: '0 5px'
}

const socialTags = {
  ...itineraryTags,
  color: 'rgb(237, 106, 90)'
}

const socialTagsSpacer = {
  ...itineraryTagsSpacer,
  color: 'rgb(237, 106, 90)'
}

const budgetContainer = {
  width: '225px',
  height: '100%',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const budgetText = {
  ...coreFonts.garamondRegular,
  color: coreColors.black07,
  fontSize: '24px',
  lineHeight: '31px'
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
  timeFromPublishDate,
  countryName,
  // image
  thumbnailImageContainer,
  // bottom info row
  blogThumbnailBottomInfoRow,
  blogTitleRow,
  blogTitle,
  blogTagsRow,
  blogTags,
  blogTagsSpacer,
  blogViewsText,
  // itineraries tab
  itinerarySectionContainer,
  itineraryRowContainer,
  authorSectionContainer,
  authorInfoText,
  daysCountriesContainer,
  daysNumber,
  daysText,
  countriesText,
  itineraryDetailsContainer,
  itineraryName,
  itineraryDescription,
  itineraryTagsRow,
  itineraryTags,
  itineraryTagsSpacer,
  socialTags,
  socialTagsSpacer,
  budgetContainer,
  budgetText
}
