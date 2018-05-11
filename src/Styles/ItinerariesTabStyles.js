import { coreColors, coreFonts } from './cores'

// NEEDS RADIUM ?  YES. HOVER OVER ITINERARY ROW
const itinerariesTabContainer = {
  width: '1265px',
  // navbar + tabsbar
  minHeight: 'calc(100vh - 108px)',
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-start',
  paddingBottom: '90px' // 1 row height
}

const itineraryContainer = {
  width: '1265px',
  // height: '90px',
  height: '130px',
  padding: '20px 0',
  // margin: '20px 0',
  display: 'flex',
  cursor: 'pointer',
  ':hover': {
    background: 'rgb(245, 245, 245)'
  }
}

/* ----------------------------- */

const timeSinceCreatedContainer = {
  width: '100px',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const timeSinceCreated = {
  ...coreFonts.garamondRegular,
  fontSize: '14px',
  color: coreColors.blackSolid
}
/* ----------------------------- */
const daysDatesCountriesContainer = {
  width: '100px',
  height: '100%',
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  borderRight: `1px solid ${coreColors.black03}`
}

const daysNumber = {
  ...coreFonts.garamondRegular,
  fontSize: '32px',
  lineHeight: '36px',
  color: coreColors.blackSolid,
  padding: 0
}

const daysCountriesText = {
  ...coreFonts.garamondRegular,
  fontSize: '14px',
  lineHeight: '24px',
  color: coreColors.blackSolid
}
/* ----------------------------- */
const itineraryDetailsContainer = {
  width: '765px',
  height: '100%',
  display: 'flex',
  flexFlow: 'column nowrap',
  justfifyContent: 'flex-start',
  padding: '0 20px'
}

const itineraryName = {
  ...coreFonts.garamondRegular,
  fontSize: '24px',
  color: coreColors.blackSolid,
  margin: 0,
  lineHeight: '40px'
}

const itineraryDescription = {
  ...coreFonts.robotoLight,
  fontSize: '14px',
  color: coreColors.blackSolid,
  margin: 0,
  lineHeight: '24px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

const itineraryTagsRow = {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'flex-start',
  height: '18px'
}

const itineraryTags = {
  ...coreFonts.garamondRegular,
  color: coreColors.greenSolid,
  fontSize: '14px',
  lineHeight: '18px'
}

const itineraryTagsSpacer = {
  color: coreColors.greenSolid,
  fontSize: '14px',
  lineHeight: '18px',
  margin: '0 5px'
}

/* ----------------------------- */

const budgetContainer = {
  width: '200px',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const budgetText = {
  ...coreFonts.garamondRegular,
  color: coreColors.blackSolid,
  fontSize: '24px'
}

const privacyToggleContainer = {
  width: '100px',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

/* ----------------------------- */
export const ItinerariesTabStyles = {
  itinerariesTabContainer,
  itineraryContainer,
  timeSinceCreatedContainer,
  timeSinceCreated,
  daysDatesCountriesContainer,
  daysNumber,
  daysCountriesText,
  itineraryDetailsContainer,
  itineraryName,
  itineraryDescription,
  itineraryTagsRow,
  itineraryTags,
  itineraryTagsSpacer,
  budgetContainer,
  budgetText,
  privacyToggleContainer
}
