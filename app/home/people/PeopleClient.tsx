'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ROLES } from '@/content/roles'
import AddPersonModal from './AddPersonModal'

type Person = {
  id: string
  name: string
  role: string | null
  phone: string | null
  email: string | null
  notes: string | null
  is_family: boolean
  side: string | null
  family_relationship: string | null
  child_name: string | null
  in_family_photos: boolean
}

type Props = {
  brideName: string
  groomName: string
  initialPeople: Person[]
}

type SectionDef = {
  label: string
  group: 'bridal_party' | 'family' | 'supplier'
  filter: (p: Person) => boolean
  showSide: boolean
}

const BRIDE_PARTY_ROLES = ['maid_of_honour', 'bridesmaid', 'flower_girl_guardian']
const GROOM_PARTY_ROLES = ['best_man', 'groomsman', 'usher', 'page_boy_guardian']

function roleLabel(slug: string | null, notes?: string | null) {
  if (!slug) return ''
  if (slug === 'supplier_other' && notes) return notes
  return ROLES.find(r => r.slug === slug)?.label ?? slug
}

function sideLabel(side: string | null, brideName: string, groomName: string) {
  if (side === 'partner_1') return `${brideName}'s side`
  if (side === 'partner_2') return `${groomName}'s side`
  return null
}

export default function PeopleClient({ brideName, groomName, initialPeople }: Props) {
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [deleting, setDeleting] = useState<string | null>(null)

  const SECTIONS: SectionDef[] = [
    {
      label: `${brideName}'s Party`,
      group: 'bridal_party',
      filter: p => BRIDE_PARTY_ROLES.includes(p.role ?? ''),
      showSide: true,
    },
    {
      label: `${groomName}'s Party`,
      group: 'bridal_party',
      filter: p => GROOM_PARTY_ROLES.includes(p.role ?? ''),
      showSide: true,
    },
    {
      label: `${brideName}'s Family`,
      group: 'family',
      filter: p => {
        const roleGroup = ROLES.find(r => r.slug === p.role)?.group
        return (p.is_family || roleGroup === 'family') && roleGroup !== 'bridal_party' && p.side === 'partner_1'
      },
      showSide: false,
    },
    {
      label: `${groomName}'s Family`,
      group: 'family',
      filter: p => {
        const roleGroup = ROLES.find(r => r.slug === p.role)?.group
        return (p.is_family || roleGroup === 'family') && roleGroup !== 'bridal_party' && p.side === 'partner_2'
      },
      showSide: false,
    },
    {
      label: 'Suppliers',
      group: 'supplier',
      filter: p => ROLES.find(r => r.slug === p.role)?.group === 'supplier',
      showSide: false,
    },
  ]

  function handleAdd(person: Person) {
    setPeople(prev => [...prev, person])
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await fetch(`/api/people/${id}`, { method: 'DELETE' })
    setPeople(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  return (
    <main className="min-h-screen bg-cream">

      {/* Header */}
      <div className="bg-plum text-cream px-8 md:px-16 pt-12 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/home" className="text-[11px] tracking-label uppercase text-mauve-soft hover:text-cream transition-colors mb-6 block">
            ← Back to your Inner Circle
          </Link>
          <div className="text-[11px] tracking-label uppercase text-mauve-soft mb-3">Your people</div>
          <h1 className="text-4xl md:text-5xl font-light text-cream leading-tight">Your Circle</h1>
          <p className="text-cream/60 text-base mt-3">
            Add the key people in your wedding. We will brief each of them at exactly the right moment.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 space-y-16">
        {SECTIONS.map(section => {
          const sectionPeople = people.filter(section.filter)
          return (
            <div key={section.label}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[11px] tracking-label uppercase text-mauve">{section.label}</h2>
                <AddPersonModal
                  group={section.group}
                  brideName={brideName}
                  groomName={groomName}
                  onAdd={handleAdd}
                />
              </div>

              {sectionPeople.length === 0 ? (
                <div className="border border-hairline px-8 py-8 text-center">
                  <p className="text-sm text-whisper italic">No one added yet.</p>
                </div>
              ) : (
                <div className="border border-hairline divide-y divide-hairline">
                  {sectionPeople.map(person => (
                    <div key={person.id} className="px-6 py-5 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-3 mb-1">
                          <span className="text-base font-light text-ink">{person.name}</span>
                          {person.role && (
                            <span className="text-[11px] tracking-label uppercase text-mauve">
                              {roleLabel(person.role, person.notes)}
                            </span>
                          )}
                          {person.family_relationship && (
                            <span className="text-[11px] tracking-label uppercase text-mauve-soft">
                              {person.family_relationship}
                            </span>
                          )}
                          {person.child_name && (
                            <span className="text-[11px] tracking-label uppercase text-mauve-soft">
                              {person.role === 'flower_girl_guardian' ? 'Flower girl' : 'Page boy'}: {person.child_name}
                            </span>
                          )}
                          {section.showSide && person.side && (
                            <span className="text-[11px] text-whisper italic">
                              {sideLabel(person.side, brideName, groomName)}
                            </span>
                          )}
                          {person.family_relationship === 'Partner' && (
                            <span className="text-[11px] tracking-label uppercase text-mauve-soft">
                              {person.in_family_photos ? 'In family photos' : 'Not in family photos'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-whisper">
                          {person.phone && <span>{person.phone}</span>}
                          {person.email && <span>{person.email}</span>}
                          {person.notes && person.family_relationship !== 'Partner' && (
                            <span className="italic">{person.notes}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(person.id)}
                        disabled={deleting === person.id}
                        className="text-[11px] tracking-label uppercase text-whisper hover:text-mauve transition-colors flex-shrink-0 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

    </main>
  )
}
