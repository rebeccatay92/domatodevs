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
  padding: '0 8px'
}

/* ----------------------------- */
const daysFilterContainer = {
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

/* ----------------------------- */

/* ----------------------------- */

export const MapboxMapStyles = {
  searchBarContainer,
  searchBarSearchIcon,
  searchBarClearIcon,
  searchBarInputField,
  customMarkerButtonContainer,
  daysFilterContainer
}
