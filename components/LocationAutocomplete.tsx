'use client'

import { useState } from 'react'

type NameAddressPair = { name: string; address: string }

const inputClass = 'w-full border border-hairline bg-transparent px-4 py-3 text-ink text-base focus:outline-none focus:border-mauve'
const labelClass = 'text-[11px] tracking-label uppercase text-whisper block mb-2'

export function CeremonyAutocomplete({
  nameValue,
  addressValue,
  onNameChange,
  onAddressChange,
  suggestions,
  namePlaceholder = 'e.g. St. Patrick\'s Church, Dundalk',
  addressPlaceholder = 'Full address for map links',
}: {
  nameValue: string
  addressValue: string
  onNameChange: (v: string) => void
  onAddressChange: (v: string) => void
  suggestions: NameAddressPair[]
  namePlaceholder?: string
  addressPlaceholder?: string
}) {
  const [open, setOpen] = useState(false)

  // Show all suggestions on focus; filter once typing starts
  const matches = open
    ? (nameValue.length === 0
        ? suggestions
        : suggestions.filter(s => s.name.toLowerCase().includes(nameValue.toLowerCase())))
    : []

  function select(loc: NameAddressPair) {
    onNameChange(loc.name)
    onAddressChange(loc.address)
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={nameValue}
          onChange={e => { onNameChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={namePlaceholder}
          className={inputClass}
        />
        {open && matches.length > 0 && (
          <div className="absolute z-20 w-full bg-cream border border-hairline border-t-0 max-h-52 overflow-y-auto shadow-sm">
            {matches.map((loc, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={() => select(loc)}
                className="w-full text-left px-4 py-3 hover:bg-blush-soft transition-colors border-b border-hairline last:border-0"
              >
                <p className="text-sm text-ink">{loc.name}</p>
                {loc.address && <p className="text-xs text-whisper mt-0.5">{loc.address}</p>}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className={labelClass}>Ceremony address</label>
        <input
          type="text"
          value={addressValue}
          onChange={e => onAddressChange(e.target.value)}
          placeholder={addressPlaceholder}
          className={inputClass}
        />
      </div>
    </div>
  )
}

export function PrepAutocomplete({
  value,
  onChange,
  label,
  suggestions,
}: {
  value: string
  onChange: (v: string) => void
  label: string
  suggestions: string[]
}) {
  const [open, setOpen] = useState(false)

  const matches = open
    ? (value.length === 0
        ? suggestions
        : suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())))
    : []

  return (
    <div className="relative">
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Hotel, house address..."
        className={inputClass}
      />
      {open && matches.length > 0 && (
        <div className="absolute z-20 w-full bg-cream border border-hairline border-t-0 max-h-40 overflow-y-auto shadow-sm">
          {matches.map((loc, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={() => { onChange(loc); setOpen(false) }}
              className="w-full text-left px-4 py-3 text-sm text-ink hover:bg-blush-soft transition-colors border-b border-hairline last:border-0"
            >
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
