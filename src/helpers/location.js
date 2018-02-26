import moment from 'moment'
const crossOriginUrl = `https://cors-anywhere.herokuapp.com/`

// CONSTRUCT GOOGLEPLACEDATA OBJ FOR DB FROM GOOGLE PLACES/MAPS JSON OBJECT
export function constructGooglePlaceDataObj (place) {
  // console.log('helper args', place)
  var googlePlaceData = {
    placeId: place.place_id,
    countryCode: null,
    name: place.name,
    address: place.formatted_address,
    telephone: place.international_phone_number || place.formatted_phone_number,
    latitude: null,
    longitude: null,
    utcOffset: place.utc_offset,
    openingHours: null,
    openingHoursText: null
  }
  if (place.opening_hours && place.opening_hours.periods) {
    // maps place details also provides hours, minutes, nextDate. db cant take the non 32 bit signed int for nextDate. REMOVE THESE 3 PROPERTIES FROM OPENING HOURS PERIODS, NOT IN GRAPHQL SCHEMA
    var tempArr = []
    place.opening_hours.periods.forEach(period => {
      var tempObj = {}
      if (period.open) {
        tempObj.open = {day: period.open.day, time: period.open.time}
      }
      if (period.close) {
        tempObj.close = {day: period.close.day, time: period.close.time}
      }
      tempArr.push(tempObj)
    })
    googlePlaceData.openingHours = tempArr
  }
  if (place.opening_hours && place.opening_hours.weekday_text) {
    googlePlaceData.openingHoursText = place.opening_hours.weekday_text
  }
  place.address_components.forEach(e => {
    if (e.types.includes('country')) {
      googlePlaceData.countryCode = e.short_name
    }
  })

  // depending on whether lat/lng comes from search or map
  if (typeof (place.geometry.location.lat) === 'number') {
    googlePlaceData.latitude = place.geometry.location.lat
    googlePlaceData.longitude = place.geometry.location.lng
  } else {
    googlePlaceData.latitude = place.geometry.location.lat()
    googlePlaceData.longitude = place.geometry.location.lng()
  }

  let googlePlaceDataWithImg
  if (place.photos && place.photos[0] && place.photos[0].photo_reference) {
    // photo_reference comes from text search
    var photoReference = place.photos[0].photo_reference
    var photoApiUrl = `${crossOriginUrl}https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photoReference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    googlePlaceDataWithImg = window.fetch(photoApiUrl, {
      headers: {
        'Access-Control-Expose-Headers': 'x-final-url'
      }
    })
    .then(response => {
      // console.log('RESPONSE FROM API', response)
      // console.log(response.headers.get('x-final-url'))
      // console.log('all headers', response.headers)
      googlePlaceData.imageUrl = response.headers.get('x-final-url')
      return Promise.resolve(googlePlaceData)
    })
  } else if (place.photos && place.photos[0] && place.imageUrl) {
    // if getUrl(), it comes from map. extract within the map selectLocation fxn and add to place obj. cant call getUrl() here
    googlePlaceData.imageUrl = place.imageUrl
    return Promise.resolve(googlePlaceData)
  } else {
    googlePlaceDataWithImg = Promise.resolve(googlePlaceData)
  }
  return googlePlaceDataWithImg
}

// CONSTRUCT LOCATION DETAILS OBJ FROM GOOGLE PLACE DATA OBJ, DATES ARR, AND CHOSEN DAY
export function constructLocationDetails (googlePlaceData, datesArr, dayInt) {
  var locationDetails = {
    address: googlePlaceData.address,
    telephone: googlePlaceData.telephone
  }
  if (datesArr) {
    var dateUnix = datesArr[dayInt - 1]
    var momentTime = moment.utc(dateUnix)
    var momentDayStr = momentTime.format('dddd')
    if (googlePlaceData.openingHoursText) {
      var textArr = googlePlaceData.openingHoursText.filter(e => {
        return e.indexOf(momentDayStr) > -1
      })
      locationDetails.openingHours = textArr[0]
    }
  } else if (!datesArr) {
    // default to mon if datesArr does not exist
    if (googlePlaceData.openingHoursText) {
      textArr = googlePlaceData.openingHoursText.filter(e => {
        return e.indexOf('Monday') > -1
      })
      locationDetails.openingHours = textArr[0]
    }
  }
  console.log(locationDetails);
  return locationDetails
}
