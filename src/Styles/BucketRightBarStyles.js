import { coreColors, coreFonts } from './cores'

// NEEDS RADIUM FOR HOVER EFFECT

/* ----------------------------- */
const mainAreaContainer = {
  zIndex: 11,
  width: '344px',
  height: '100%',
  background: 'rgb(245, 245, 245)',
  border: `1px solid ${coreColors.black03}`,
  boxShadow: '-2px 0px 5px rgba(0, 0 , 0, 0.16)'
}

/* ----------------------------- */

const headerSection = {
  width: '100%',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '16px'
}

const headerText = {
  ...coreFonts.robotoLight,
  fontSize: '24px',
  color: coreColors.blackSolid
}

const filtersDiv = {
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: '16px'
}

const filtersDropdown = {
  ...coreFonts.robotoLight,
  color: coreColors.blackSolid,
  fontSize: '13px'
}
/* ----------------------------- */

const bucketListContainer = {
  width: '100%',
  height: 'calc(100% - 64px)',
  overflow: 'scroll'
}

const horizontalDivider = {
  width: 'calc(100% - 32px)',
  height: '1px',
  margin: '0 16px',
  borderTop: '1px solid rgba(60, 58, 68, 0.3)'
}

const bucketRowUnfocused = {
  width: '100%',
  height: '100px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  cursor: 'pointer',
  ':hover': {
    background: 'rgb(255, 255, 255)'
  }
}

const bucketRowFocused = {
  ...bucketRowUnfocused,
  background: 'rgb(255, 255, 255)'
}

/* ----------------------------- */
const thumbnailImage = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '16px'
}

const contentContainer = {
  width: 'calc(100% - 80px - 16px)',
  height: '80px',
  display: 'flex',
  flexDirection: 'column'
}

const locationAndCategoryDiv = {
  height: '24px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}

const locationName = {
  ...coreFonts.robotoLight,
  color: coreColors.greenSolid,
  fontSize: '16px',
  lineHeight: '24px',
  width: 'calc(100% - 24px)',
  height: '24px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const categoryIcon = {
  color: 'rgb(199, 130, 131)',
  fontSize: '24px'
}

const notesContainer = {
  height: 'calc(80px - 24px)', // height of thumbnail - location name
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignContent: 'flex-start' // make span flush with top
}

const notes = {
  ...coreFonts.robotoLight,
  fontSize: '13px',
  lineHeight: '19px',
  color: coreColors.blackSolid
}
/* ----------------------------- */
export const BucketRightBarStyles = {
  mainAreaContainer,
  // header section
  headerSection,
  headerText,
  filtersDiv,
  filtersDropdown,
  // bucket list itself
  bucketListContainer,
  horizontalDivider,
  bucketRowUnfocused,
  bucketRowFocused,
  // within each row
  thumbnailImage,
  contentContainer,
  locationAndCategoryDiv,
  locationName,
  categoryIcon,
  notesContainer,
  notes
}
