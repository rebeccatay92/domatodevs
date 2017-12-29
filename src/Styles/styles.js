export const primaryColor = '#ed9fad'
const mainFontColor = '#3C3A44'
const secondaryFontColor = '#9FACBC'
const backgroundColor = '#FAFAFA'

// Planner Table dimensions
const tableWidth = 962

// Create event form dimensions
const totalWidth = 1221
const totalHeight = 755
const leftPanelWidth = 755
const rightPanelWidth = totalWidth - leftPanelWidth

// PlannerPage.js styles
export const plannerPageStyles = {
  fontFamily: '\'Roboto\', sans-serif',
  color: mainFontColor,
  margin: '0 auto',
  width: '1445px',
  fontWeight: '300'
}

export const plannerStyle = {display: 'inline-block', width: '1106px', verticalAlign: 'top'}
export const bucketStyle = {display: 'inline-block', width: '335px', verticalAlign: 'top', padding: '14px 0 0 14px'}
export const bucketTitleStyle = {textAlign: 'left', fontSize: '24px'}

// Planner.js styles
export const plannerContainerStyle = {
  height: '90vh',
  width: '100%',
  borderRight: '1px solid rgba(159, 172, 188, 0.5)'
}

export const plannerHeaderContainerStyle = {marginLeft: '89px'}
export const itineraryNameStyle = {fontSize: '56px', fontWeight: '100', marginTop: '0'}
export const itineraryDescStyle = {margin: '0 0 2vh 0', fontSize: '16px', fontWeight: '100', color: secondaryFontColor}
export const plannerHeaderIconsContainerStyle = {position: 'relative', height: '4vh', margin: '0 0 2vh 0'}
export const userIconsContainerStyle = {position: 'absolute', left: '0', top: '0'}
export const userIconStyle = {height: '30px', width: '30px', margin: '0 0 10px 10px'}
export const plannerIconStyle = {
  fontSize: '24px',
  margin: '0 0 0 2vh',
  color: primaryColor,
  opacity: '0.6',
  cursor: 'pointer',
  ':hover': {
    opacity: '1'
  }
}

// Date.js styles
export const timelineStyle = {
  width: '1.5px',
  height: '100%',
  display: 'inline-block',
  position: 'absolute',
  top: '0',
  left: '50%',
  bottom: '0',
  margin: '0 auto',
  backgroundColor: primaryColor
}
export const dateTableStyle = {width: '1052px'}
export const timelineColumnStyle = {width: '89px', position: 'relative'}
export const timelineTitleStyle = headerSticky => {
  return {position: headerSticky ? 'fixed' : 'absolute', top: headerSticky ? '60px' : '0px', textAlign: 'center', width: 'inherit', zIndex: 10, backgroundColor: backgroundColor}
}
export const timelineTitleWordStyle = {fontSize: '16px', display: 'block', color: primaryColor}
export const dayTimelineStyle = sticky => {
  return {position: sticky ? 'fixed' : 'absolute', textAlign: 'center', width: 'inherit', top: sticky ? '120px' : '60px', zIndex: 1, padding: '20px 0'}
}
export const dayTimelineContainerStyle = isDateOnScreen => {
  return {padding: '2px', display: 'inline-block', backgroundColor: isDateOnScreen ? primaryColor : backgroundColor, borderRadius: isDateOnScreen ? '5px' : 0}
}
export const dayTimelineWordStyle = isDateOnScreen => {
  return {fontSize: '16px', color: isDateOnScreen ? backgroundColor : primaryColor, display: 'inline-block'}
}
export const addDayButtonStyle = {padding: '1px 3px', backgroundColor: 'white', border: '1px solid #EDB5BF', display: 'inline-block', marginTop: '20px', cursor: 'pointer'}
export const addDayWordStyle = {fontSize: '16px', color: primaryColor, display: 'inline-block'}
export const dateTableFirstHeaderStyle = {width: `${0.4 * tableWidth}px`}
export const headerDayStyle = {display: 'inline-block', margin: '0 0 0 1vw', fontSize: '24px', fontWeight: '300'}
export const headerDateStyle = {fontSize: '16px', display: 'inline-block', position: 'relative', top: '-2px', marginLeft: '0.5vw', fontWeight: '100'}
export const dateTableOtherHeaderStyle = {width: `${0.2 * tableWidth}px`}
export const dateTableHorizontalLineStyle = isFirstDay => {
  return {marginBottom: '2vh', marginTop: isFirstDay ? '0' : '1vh', width: tableWidth + 'px', height: '8px', boxShadow: '0 8px 10px -10px #86919f inset'}
}

// PlannerActivity.js styles
export const eventBoxStyle = (draggable, activityId) => {
  return {
    cursor: draggable ? 'move' : 'default',
    border: activityId ? 'none' : '1px dashed black',
    position: 'relative'
  }
}
export const eventBoxFirstColumnStyle = (activityId, minHeight) => {
  return { lineHeight: '100%', padding: '1vh 0', minHeight: '12vh' }
}
export const expandedEventPropStyle = {color: secondaryFontColor, fontWeight: 'bold'}
export const expandedEventValueStyle = {color: secondaryFontColor}
export const createEventTextStyle = {marginTop: 0, fontSize: '16px', color: primaryColor, display: 'inline-block'}
export const activityIconStyle = {
  fontSize: '24px',
  marginRight: '1vw',
  WebkitTextStroke: '1px ' + primaryColor,
  WebkitTextFillColor: '#FAFAFA',
  cursor: 'pointer'
  // ':hover': {
  //   WebkitTextStroke: '2px ' + primaryColor
  // }
}
export const createEventBoxStyle = {position: 'absolute', top: '-1vh'}
export const createEventPickOneStyle = {fontSize: '16px', color: primaryColor, position: 'relative', top: '-6px'}
export const createEventBoxContainerStyle = {
  margin: '1vh 0 3vh 1vw',
  height: '50px',
  position: 'relative'
}
export const plannerBlurredBackgroundStyle = {position: 'fixed', bottom: 0, right: 0, top: 0, left: 0, backgroundColor: 'rgba(250, 250, 250, 1)', zIndex: 555}
// Expanded Event Styles
export const expandedEventIconsBoxStyle = {position: 'absolute', display: 'inline-block', right: '0', top: '0', margin: '10px 10px 0 0', color: secondaryFontColor}
export const expandedEventIconsStyle = {cursor: 'pointer', ':hover': {color: primaryColor}}
export const expandedEventBoxStyle = {width: '100%', height: '100%', boxShadow: '0px 2px 5px 2px rgba(0, 0, 0, .2)', overflow: 'auto', position: 'relative'}
export const expandedEventBoxImageContainerStyle = {display: 'inline-block', height: '183px', width: '292px', margin: '25px', backgroundColor: 'black', textAlign: 'center'}
export const expandedEventBoxImageStyle = {maxHeight: '100%', maxWidth: '100%'}
export const expandedEventBoxTextBoxStyle = {display: 'inline-block', verticalAlign: 'top', margin: '25px 0', width: 'calc(100% - 370px)'}

// PlannerColumnHeader.js styles
export const tableDropdownStyle = {
  display: 'inline-block',
  fontSize: '16px',
  color: secondaryFontColor,
  cursor: 'pointer',
  padding: '1vh'
}

export const tableOptionStyle = {
  display: 'block',
  fontSize: '16px',
  textAlign: 'left',
  color: secondaryFontColor,
  margin: '1vh 0',
  cursor: 'pointer'
}

export const tableHeadingStyle = {
  width: `${0.2 * 962}px`,
  textAlign: 'center',
  position: 'relative',
  backgroundColor: backgroundColor,
  ':hover': {
    backgroundColor: '#f0f0f0'
  }
}

// PlannerColumnValue.js styles
export const columnValueContainerStyle = (columnType) => {
  return {position: 'relative', textAlign: columnType === 'Notes' ? 'left' : 'center', verticalAlign: 'top', color: '#9FACBC', fontSize: '16px', paddingTop: '12px', width: `${0.2 * 962}px`}
}

export const eventDropdownStyle = {position: 'absolute', right: '0px', top: '20px', ':hover': {color: primaryColor}}

// Create Event Form Styles
export const createEventFormContainerStyle = {backgroundColor: 'transparent', position: 'fixed', left: `calc(50% - ${totalWidth / 2}px)`, top: `calc(50% - ${totalHeight / 2}px)`, width: totalWidth + 'px', height: totalHeight + 'px', zIndex: 999, color: 'white'}

export const createEventFormBoxShadow = {boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)', height: '90%'}

export const createEventFormLeftPanelStyle = (url, type) => {
  return {backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: type === 'flight' ? rightPanelWidth + 'px' : leftPanelWidth + 'px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative'}
}
export const createEventFormRightPanelStyle = (type) => {
  return {width: type === 'flight' ? leftPanelWidth + 'px' : rightPanelWidth + 'px', height: '100%', display: 'inline-block', verticalAlign: 'top', position: 'relative', color: mainFontColor}
}
export const greyTintStyle = {position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, background: '#6D6A7A', opacity: '0.75'}
export const eventDescriptionStyle = (bgImage) => {
  return {background: bgImage ? 'none' : 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '24px', fontWeight: '300', width: 'fit-content', minWidth: '100px', position: 'relative', ':hover': { boxShadow: '0 1px 0 #FFF' }}
}
export const foodTypeStyle = (bgImage) => {
  return {background: bgImage ? 'none' : 'inherit', outline: 'none', border: 'none', textAlign: 'center', fontSize: '24px', fontWeight: '300', width: '150px', position: 'relative', ':hover': { boxShadow: '0 1px 0 #FFF' }}
}
export const eventDescContainerStyle = {margin: '0 auto', width: 'fit-content'}
export const foodTypeContainerStyle = {width: '150px', margin: '0 auto'}
export const attachmentsStyle = {width: '100%', background: 'transparent', display: 'inline-block', marginTop: '5px'}

export const bookingNotesContainerStyle = {width: '100%', height: '100%', background: 'white', padding: '5%'}

// LocationSelection.js styles
export const locationSelectionInputStyle = (marginTop, type) => {
  return {fontSize: '48px', textAlign: 'center', width: type === 'flight' ? '' : leftPanelWidth / 2 + 'px', background: 'inherit', border: 'none', outline: 'none', fontWeight: '100', resize: 'none', marginTop: marginTop + 'px', maxHeight: '195px', ':hover': { boxShadow: '0 1px 0 #FFF' }}
}
export const locationDropdownStyle = {width: leftPanelWidth / 2 + 'px', maxHeight: '250px', overflowY: 'auto', background: 'white', position: 'absolute', zIndex: '2', left: `calc(50% - ${(leftPanelWidth / 2) / 2}px)`}

export const locationMapContainerStyle = {backgroundColor: 'white', position: 'fixed', left: `calc(50% - ${totalWidth / 2}px)`, top: `calc(50% - ${totalHeight / 2}px)`, width: leftPanelWidth + 'px', height: (0.9 * totalHeight) + 'px', zIndex: 999, color: 'black'}

// POSITION FIXED, MOVE FURTHER RIGHT
export const flightMapContainerStyle = {backgroundColor: 'white', position: 'fixed', right: 'calc(50% - 610.5px)', top: `calc(50% - ${totalHeight / 2}px)`, width: leftPanelWidth + 'px', height: (0.9 * totalHeight) + 'px', zIndex: 999, color: 'black'}

// DateTimePicker.js styles
export const dateTimePickerContainerStyle = {width: '370px', margin: '45px auto 0 auto', textAlign: 'center', height: '131px', position: 'relative', whiteSpace: 'noWrap'}

// BookingDetails.js styles
export const labelStyle = {
  fontSize: '13px',
  display: 'block',
  margin: '5px',
  lineHeight: '26px'
}

// Attachments.js styles
export const attachmentStyle = {margin: '1px 6px 0 0', verticalAlign: 'top', display: 'inline-block', position: 'relative', ':hover': {color: primaryColor}, border: '1px solid ' + secondaryFontColor, height: '50px', cursor: 'pointer', borderRadius: '5px', width: '15%', backgroundColor: backgroundColor}
export const addAttachmentBtnStyle = {color: secondaryFontColor, margin: '10px 5px 0 0', cursor: 'pointer', fontSize: '30px', ':hover': {color: primaryColor}}
export const attachmentNameStyle = {fontSize: '13px', color: secondaryFontColor, fontWeight: 'bold', position: 'relative', top: '-6px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}
export const attachmentSizeStyle = {fontSize: '13px', color: secondaryFontColor, fontWeight: 'bold', position: 'relative', top: '-10px'}
export const attachmentDeleteBtnStyle = (hovering, i) => {
  return {color: secondaryFontColor, cursor: 'pointer', opacity: hovering === i ? '1.0' : 0, ':hover': {color: primaryColor}}
}
export const pdfLogoStyle = {color: 'rgb(237, 15, 135)', fontSize: '50px', marginRight: '2px'}
export const imageLogoStyle = {color: 'rgb(43, 201, 217)', fontSize: '50px'}

// FlightSearchResults.js styles
export const searchResultsTableStyle = {width: '100%', color: secondaryFontColor, fontSize: '16px', cursor: 'default'}

// AirportResults.js styles
export const intuitiveDropdownStyle = {width: '282.5px', maxHeight: '250px', overflowY: 'auto', background: 'white', position: 'absolute', zIndex: '2'}
