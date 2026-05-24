'use client'

const COUNTRY_CODES = [
  { code: '+44', label: '+44 — UK' },
  { code: '+353', label: '+353 — Ireland' },
  { code: '+1', label: '+1 — USA / Canada' },
  { code: '+61', label: '+61 — Australia' },
  { code: '+64', label: '+64 — New Zealand' },
  { code: '+33', label: '+33 — France' },
  { code: '+49', label: '+49 — Germany' },
  { code: '+34', label: '+34 — Spain' },
  { code: '+39', label: '+39 — Italy' },
  { code: '+31', label: '+31 — Netherlands' },
  { code: '+32', label: '+32 — Belgium' },
  { code: '+41', label: '+41 — Switzerland' },
  { code: '+43', label: '+43 — Austria' },
  { code: '+351', label: '+351 — Portugal' },
  { code: '+45', label: '+45 — Denmark' },
  { code: '+46', label: '+46 — Sweden' },
  { code: '+47', label: '+47 — Norway' },
  { code: '+48', label: '+48 — Poland' },
  { code: '+36', label: '+36 — Hungary' },
  { code: '+30', label: '+30 — Greece' },
  { code: '+27', label: '+27 — South Africa' },
  { code: '+91', label: '+91 — India' },
  { code: '+86', label: '+86 — China' },
  { code: '+81', label: '+81 — Japan' },
  { code: '+971', label: '+971 — UAE' },
  { code: '+55', label: '+55 — Brazil' },
  { code: '+52', label: '+52 — Mexico' },
]

// Sort longest codes first so +353 is checked before +35, etc.
const SORTED_CODES = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length)

function parsePhone(value: string): { code: string; number: string } {
  for (const c of SORTED_CODES) {
    if (value.startsWith(c.code)) {
      return { code: c.code, number: value.slice(c.code.length) }
    }
  }
  return { code: '+44', number: value }
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = '7xxx xxxxxx',
  containerClass = '',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  containerClass?: string
}) {
  const { code, number } = parsePhone(value)

  function handleCodeChange(newCode: string) {
    onChange(newCode + number)
  }

  function handleNumberChange(raw: string) {
    // Auto-strip leading 0 (e.g. 07787... → 7787...)
    const stripped = raw.replace(/^0/, '')
    onChange(code + stripped)
  }

  return (
    <div className={`flex border border-hairline focus-within:border-mauve transition-colors ${containerClass}`}>
      <select
        value={code}
        onChange={e => handleCodeChange(e.target.value)}
        className="bg-transparent text-ink text-sm px-3 py-3 border-r border-hairline focus:outline-none cursor-pointer shrink-0"
      >
        {COUNTRY_CODES.map(c => (
          <option key={c.code} value={c.code}>{c.label}</option>
        ))}
      </select>
      <input
        type="tel"
        value={number}
        onChange={e => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-4 py-3 text-ink text-base focus:outline-none min-w-0"
      />
    </div>
  )
}
