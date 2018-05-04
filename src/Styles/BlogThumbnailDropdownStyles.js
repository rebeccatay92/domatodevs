import { coreColors, coreFonts } from './cores'
// NEEDS RADIUM? YES. FOR HOVER SHADING

const dropdownContainer = {
  position: 'absolute',
  bottom: '26px',
  right: '0',
  width: '100px',
  height: 'calc(36px * 4)', // 4 options, each 36px height
  boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)',
  background: 'rgb(250, 250, 250)',
  zIndex: '2' // for positioning above other stuff
}

const dropdownOptionContainer = {
  width: '100px',
  height: '36px',
  padding: '6px',
  cursor: 'pointer',
  ':hover': {
    background: 'rgb(240, 240, 240)'
  }
}

const dropdownOption = {
  ...coreFonts.robotoRegular,
  color: coreColors.blackSolid,
  fontSize: '12px',
  lineHeight: '24px'
}

export const BlogThumbnailDropdownStyles = {
  dropdownContainer,
  dropdownOptionContainer,
  dropdownOption
}
