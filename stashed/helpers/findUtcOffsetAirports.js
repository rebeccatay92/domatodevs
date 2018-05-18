import airports from '../data/airports.json'

function findUtcOffsetAirports (iata) {
  var airportRow = airports.find(row => {
    return row.iata === iata
  })
  var utcInMinutes = airportRow.timezone * 60
  return utcInMinutes
}

export default findUtcOffsetAirports
