import { coreColors, coreFonts } from './cores'

/* ----------------------------- */
/* ----------------------------- */

const mainAreaContainer = {
  zIndex: 11,
  width: '344px',
  height: '100%',
  background: 'rgb(245, 245, 245)',
  border: `1px solid ${coreColors.black03}`,
  padding: '16px', // more padding else too close to edge
  boxShadow: '-2px 0px 5px rgba(0, 0 , 0, 0.16)'
}

const sectionDivider = {
  margin: '8px 0 8px 0',
  border: `1px solid ${coreColors.black01}`
}

const minHeightSection = {
  width: '312px', // 320px - (16px padding *2)
  minHeight: '60px', // 25px label + 35px input field
  display: 'flex'
}

const iconSection = {
  height: '100%',
  width: '40px',
  display: 'flex',
  justifyContent: 'center'
}

const icon = {
  width: '24px',
  height: '24px',
  marginRight: '16px'
}

/* ----------------------------- */

const inputSection = {
  width: '272px', // 312px - 24px - 16px marginRight
  height: '100%'
}

const labelContainer = {
  width: '272px',
  margin: 0
}

const inputField = {
  width: '272px',
  height: '35px',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  lineHeight: '24px',
  color: coreColors.blackSolid,
  outline: 'none',
  background: 'rgb(245, 245, 245)'
}

const dayDropdown = {
  width: '100px',
  height: '35px',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  color: coreColors.blackSolid,
  background: 'rgb(245, 245, 245)',
  border: 'none',
  marginLeft: '-7px'
}

const timeInput = {
  height: '35px',
  ...coreFonts.robotoLight,
  fontSize: '16px',
  color: coreColors.blackSolid,
  background: 'rgb(245,245,245)',
  outline: 'none',
  margin: 0
}

const labelText = {
  display: 'block',
  ...coreFonts.robotoLight,
  fontSize: '14px',
  lineHeight: '24px',
  height: '24px',
  color: coreColors.black07
}

const addressText = {
  display: 'block',
  ...coreFonts.robotoLight,
  color: coreColors.blackSolid,
  fontSize: '16px',
  lineHeight: '24px'
}

// const attachFileLabelText = {
//   display: 'block',
//   ...coreFonts.robotoLight,
//   fontSize: '16px',
//   color: coreColors.blackSolid,
//   lineHeight: '24px',
//   height: '24px',
//   margin: 0
// }

/* ----------------------------- */
export const EventRightBarStyles = {
  mainAreaContainer,
  sectionDivider,
  minHeightSection,
  iconSection,
  icon,
  inputSection,
  labelContainer,
  dayDropdown,
  timeInput,
  inputField,
  labelText,
  addressText
  // attachFileLabelText
}
