import { coreColors, coreFonts } from './cores'

const searchBarContainer = {
  position: 'absolute',
  top: '10px',
  left: '50px',
  width: '300px',
  height: '32px',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'white'
}

const searchBarSearchIcon = {
  marginLeft: '5px',
  color: coreColors.blackSolid
}

const searchBarClearIcon = {
  cursor: 'pointer',
  color: coreColors.black07
}

const searchBarInputField = {
  width: '100%',
  height: '100%',
  ...coreFonts.robotoLight,
  color: coreColors.blackSolid,
  fontSize: '16px',
  outline: 'none'
}
/* ----------------------------- */
const customMarkerButtonContainer = {
  position: 'absolute',
  zIndex: 10,
  left: '360px',
  top: '10px',
  background: 'white',
  height: '32px',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '0 8px 0 0'
}

/* ----------------------------- */
const filtersContainer = {
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  // height: '200px',
  width: '150px',
  background: 'rgb(245, 245, 245)',
  zIndex: 10,
  padding: '0 8px',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(0, 0, 0, 0.1)'
}

const filtersRow = {
  display: 'flex',
  alignItems: 'center',
  margin: '8px 0',
  cursor: 'pointer',
  color: coreColors.greenSolid
}

const filtersText = {
  ...coreFonts.robotoLight,
  fontSize: '16px',
  marginLeft: '8px'
}

/* ----------------------------- */

const markerContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  zIndex: 4
}

/* ----------------------------- */

// const popupContainer = {
//   width: '300px'
// }
//
// const popupCloseIcon = {
//   position: 'absolute',
//   top: '5px',
//   right: '5px',
//   fontSize: '18px',
//   cursor: 'pointer'
// }
//
// const popupContentContainer = {
//   width: '300px',
//   border: `1px solid ${coreColors.pinkSolid}`,
//   padding: '16px 16px 0 16px'
// }
//
// const popupContentHeader = {
//   margin: '0 0 5px 0',
//   ...coreFonts.robotoRegular,
//   fontSize: '16px',
//   color: coreColors.blackSolid
// }
//
// const popupContentText = {
//   margin: '0 0 16px 0',
//   ...coreFonts.robotoLight,
//   fontSize: '16px',
//   lineHeight: '24px',
//   color: coreColors.blackSolid
// }
//
// const popupSingleButtonWidthContainer = {
//   display: 'inline-flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   width: '150px',
//   height: '35px',
//   border: `1px solid ${coreColors.pinkSolid}`,
//   cursor: 'pointer'
// }
//
// const popupDoubleButtonWidthContainer = {
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   width: '300px',
//   height: '35px',
//   border: `1px solid ${coreColors.pinkSolid}`,
//   cursor: 'pointer'
// }
//
// const popupButtonText = {
//   ...coreFonts.robotoRegular,
//   fontSize: '16px',
//   color: coreColors.blackSolid
// }

/* ----------------------------- */

export const MapboxMapStyles = {
  searchBarContainer,
  searchBarSearchIcon,
  searchBarClearIcon,
  searchBarInputField,
  // custom marker button
  customMarkerButtonContainer,
  // filters
  filtersContainer,
  filtersRow,
  filtersText,
  // markers
  markerContainer
  // popup
  // popupContainer,
  // popupCloseIcon,
  // popupContentContainer,
  // popupContentHeader,
  // popupContentText,
  // // popup action buttons
  // popupSingleButtonWidthContainer,
  // popupDoubleButtonWidthContainer,
  // popupButtonText
}
