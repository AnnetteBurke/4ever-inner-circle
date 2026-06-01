import SunCalc from 'suncalc'

// Central coordinate for Ireland/Northern Ireland — accurate within 10 mins for all venues
const LAT = 54.0
const LNG = -7.0

export type LightStatus = 'green' | 'amber' | 'red'

export interface SunlightInfo {
  sunsetTime: string
  goldenHourStart: string
  status: LightStatus
  sunsetHour: number
}

export function getSunlightInfo(weddingDate: string): SunlightInfo {
  const date = new Date(weddingDate + 'T12:00:00Z')
  const times = SunCalc.getTimes(date, LAT, LNG)
  const sunset = times.sunset
  const goldenHourStart = new Date(sunset.getTime() - 60 * 60 * 1000)

  function fmt(d: Date): string {
    return d.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Europe/London',
      hour12: true,
    }).replace(':00', '').toLowerCase()
  }

  // Get local sunset hour for threshold comparison
  const localStr = sunset.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
    hour12: false,
  })
  const [h, m] = localStr.split(':').map(Number)
  const sunsetHour = h + m / 60

  const status: LightStatus =
    sunsetHour < 17 ? 'red' :
    sunsetHour < 19 ? 'amber' :
    'green'

  return {
    sunsetTime: fmt(sunset),
    goldenHourStart: fmt(goldenHourStart),
    status,
    sunsetHour,
  }
}
