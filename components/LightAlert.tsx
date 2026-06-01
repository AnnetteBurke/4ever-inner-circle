import { SunlightInfo } from '@/lib/sunlight'

const config = {
  green: {
    bg: 'bg-[#F0F7F0]',
    border: 'border-[#A8C8A8]',
    dot: 'bg-[#4A9A4A]',
    label: 'Great light for photography',
    text: 'Your wedding date has beautiful long light. Plenty of time for outdoor photographs — golden hour will be stunning.',
  },
  amber: {
    bg: 'bg-[#FDF8F0]',
    border: 'border-[#D4A84A]',
    dot: 'bg-[#D4A84A]',
    label: 'Light worth planning around',
    text: 'Light for photography is moderate on your wedding date. Plan outdoor portraits earlier in the afternoon so you have the best of the natural light before it softens.',
  },
  red: {
    bg: 'bg-[#FDF2F0]',
    border: 'border-[#C87A6A]',
    dot: 'bg-[#C87A6A]',
    label: 'Light is restricted on your wedding date',
    text: 'Lighting is very restricted during your wedding month. Light drops quickly and golden hour is short. If outdoor photographs are your dream, plan to do them first — straight after the ceremony if possible — then get indoors and celebrate earlier. We will help you plan your timings to make the most of every minute of light.',
  },
}

export default function LightAlert({ info }: { info: SunlightInfo }) {
  const c = config[info.status]

  return (
    <div className={`${c.bg} border ${c.border} px-6 py-5 mb-8`}>
      <div className="flex items-start gap-4">
        <div className={`w-3 h-3 rounded-full ${c.dot} mt-1 flex-shrink-0`} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-2">
            <span className="text-[11px] tracking-label uppercase text-ink font-medium">
              {c.label}
            </span>
            <span className="text-xs text-whisper">
              Sunset {info.sunsetTime} · Golden hour from {info.goldenHourStart}
            </span>
          </div>
          <p className="text-sm text-whisper leading-relaxed">{c.text}</p>
        </div>
      </div>
    </div>
  )
}
