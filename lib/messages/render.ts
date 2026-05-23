type RenderVars = {
  first_name: string
  couple_first_names: string
  bride_first_name: string
  groom_first_name: string
  wedding_date: string
  wedding_venue: string
  ceremony_venue: string
  google_maps_link_ceremony: string
  google_maps_link_bridal_suite: string
  bridal_suite_address: string
  [key: string]: string
}

function firstName(fullName: string): string {
  return fullName.split(' ')[0]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function mapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export function buildVars(opts: {
  personName: string
  brideName: string
  groomName: string
  weddingDate: string | null
  venueName: string | null
  venueAddress: string | null
  ceremonyName: string | null
  ceremonyAddress: string | null
  bridePrep: string | null
}): RenderVars {
  const {
    personName, brideName, groomName, weddingDate,
    venueName, venueAddress, ceremonyName, ceremonyAddress, bridePrep,
  } = opts

  return {
    first_name: firstName(personName),
    couple_first_names: `${firstName(brideName)} & ${firstName(groomName)}`,
    bride_first_name: firstName(brideName),
    groom_first_name: firstName(groomName),
    wedding_date: weddingDate ? formatDate(weddingDate) : '[date TBC]',
    wedding_venue: venueName ?? '[venue TBC]',
    ceremony_venue: ceremonyName ?? '[ceremony venue TBC]',
    google_maps_link_ceremony: ceremonyAddress ? mapsLink(ceremonyAddress) : '[map TBC]',
    google_maps_link_bridal_suite: bridePrep ? mapsLink(bridePrep) : '[map TBC]',
    bridal_suite_address: bridePrep ?? '[address TBC]',
    // Timing variables filled in manually by Annette for now
    photographer_arrival_time: '[photographer arrival time TBC]',
    ceremony_time: '[ceremony time TBC]',
    ceremony_time_minus_1h: '[one hour before ceremony TBC]',
    hair_makeup_start_time: '[hair & makeup time TBC]',
    bouquet_arrival_time: '[bouquet arrival time TBC]',
    groom_prep_venue: '[groom prep venue TBC]',
    groom_prep_time: '[groom prep time TBC]',
    ushers_arrival_time: '[ushers arrival time TBC]',
    sunset_time: '[sunset time TBC]',
    photographer_departure_time: '[photographer departure time TBC]',
  }
}

export function renderTemplate(template: string, vars: RenderVars): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `[${key} TBC]`)
}
