import type { RoleSlug } from './roles';

/**
 * Message templates.
 *
 * These are first drafts, written in Annette's voice (warm, considered,
 * never bossy). Annette should review and tweak each one before going
 * live — this is the soul of the Inner Circle, and the words must feel
 * unmistakably yours.
 *
 * Variables (in {curly_braces}) are filled in at send time from each
 * person's data: {first_name}, {couple_first_names}, {wedding_date},
 * {wedding_venue}, {google_maps_link_church}, etc.
 *
 * sendOffsetDays:
 *   negative = days BEFORE the wedding (-56 = eight weeks before)
 *   0        = wedding day
 *   positive = days AFTER the wedding
 *
 * sendTime (24-hour): when on that day the message goes out, in the
 * couple's local timezone. Default 09:30.
 */

export type MessageChannel = 'sms' | 'whatsapp' | 'email';

export interface MessageTemplate {
  id: string;
  recipientRole: RoleSlug | RoleSlug[];
  channel: MessageChannel;
  sendOffsetDays: number;
  sendTime?: string; // "HH:MM" 24-hour, defaults to "09:30"
  subject?: string; // email only
  body: string;
  notes?: string;
}

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  // ─────────────────────────────────────────────────────────────
  // COUPLE — the bride & groom themselves
  // ─────────────────────────────────────────────────────────────
  {
    id: 'couple_welcome_email',
    recipientRole: ['bride', 'groom'],
    channel: 'email',
    sendOffsetDays: -365,
    subject: 'Welcome to your Inner Circle ✦',
    body: `Hello {first_name},

You're in. Welcome to the 4Ever Inner Circle.

From this moment on, you have a quiet, beautifully kept space where every part of your wedding photography journey lives. No more lost email threads. No more "what did we agree about the family photos again?" Just one calm place that walks each step with you.

Over the next few months, you'll receive small, useful things — to you, to your people, to your suppliers — at exactly the right moment. A note on shot inspiration. A maps pin for the church to share with parents. A gentle prompt to the best man about his speech. A morning-of timing for the bridesmaids. We've thought it through, so you don't have to.

Your first step is to add the people who'll be there with you on the day — your bridal party, your parents, your closest friends, your suppliers. Each one gets the right care, at the right moment.

Take your time. We're not rushing anywhere.

With love,
Annette
4Ever Photos`,
    notes: 'First welcome email. Tone: warm, gentle, sets the philosophy. Annette to review and personalise as needed.'
  },

  {
    id: 'couple_week_of_calm',
    recipientRole: ['bride', 'groom'],
    channel: 'whatsapp',
    sendOffsetDays: -7,
    sendTime: '08:00',
    body: `{first_name} — one week to go. Whatever feels loudest right now, take a small breath. We've got every detail held. Your job between now and Saturday is to be in your body, sleep well, drink water, and remember why. We'll see you on the day. — Annette ✦`,
    notes: 'Sent at start of wedding week. Calming, not bossy.'
  },

  {
    id: 'couple_day_after_sneak',
    recipientRole: ['bride', 'groom'],
    channel: 'email',
    sendOffsetDays: 1,
    subject: 'A small first taste ✦',
    body: `Hello you both,

You did it. Yesterday was extraordinary.

We've put together five early images — just five — from yesterday. They're a small taste while we work through the full edit. Nothing more, nothing less. We thought you'd want them today.

[View your sneak peek →]

The full gallery will land with you in roughly four weeks. We'll be in touch before then to share a few highlights along the way.

For now: rest. Eat properly. Look at each other.

With all our love,
Annette &amp; the team`,
    notes: 'Day-after sneak peek. The link is placeholder — Claude Code will wire this up in session 4 (dashboard) so couples click through to their private gallery.'
  },

  {
    id: 'couple_gallery_ready',
    recipientRole: ['bride', 'groom'],
    channel: 'email',
    sendOffsetDays: 28,
    subject: 'Your gallery is ready ✦',
    body: `{first_name},

Your full wedding gallery is now ready in your Inner Circle.

We've spent the last four weeks with your day — every image touched, the light considered, the moments chosen with care. There are roughly 600 photographs (give or take), edited and arranged in the order they unfolded.

[Open your gallery →]

You'll find tools to download, share, and create albums. Take your time with it. There's no rush.

We'd love to know what you think when you've sat with it.

With love,
Annette`,
    notes: 'Sent four weeks after wedding. Personal, considered.'
  },

  // ─────────────────────────────────────────────────────────────
  // BEST MAN
  // ─────────────────────────────────────────────────────────────
  {
    id: 'best_man_speech_tips',
    recipientRole: 'best_man',
    channel: 'whatsapp',
    sendOffsetDays: -56,
    body: `Hi {first_name} — Annette here from 4Ever Photos, the photographers for {couple_first_names}'s wedding.

You're eight weeks out, which means it's time to start thinking about the speech. Here's a small, kind guide:

✦ Three stories, one laugh, one tear. That's the shape.
✦ Speak to the bride first, then the room.
✦ Five minutes is plenty. Seven if it's brilliant. Never more.
✦ Practice it out loud at least three times — not in your head.
✦ Print it on paper. Cards in your jacket pocket beat a phone.

I'll be in touch nearer the time with day-of timings and a map pin for the church.

You've got this. — Annette`,
    notes: 'Eight weeks out. Friendly, practical, no jargon.'
  },

  {
    id: 'best_man_day_before',
    recipientRole: 'best_man',
    channel: 'sms',
    sendOffsetDays: -1,
    sendTime: '18:00',
    body: `{first_name} — tomorrow is the day. Quick rundown: be at {groom_prep_venue} by {groom_prep_time}, suit on by {ceremony_time_minus_1h}, ceremony starts {ceremony_time} at {ceremony_venue}. Maps pin: {google_maps_link_ceremony}. Speech: deep breath, smile, you've practised it. See you tomorrow. — Annette`,
    notes: 'Day-before SMS. Short, specific, no fluff.'
  },

  // ─────────────────────────────────────────────────────────────
  // MAID OF HONOUR
  // ─────────────────────────────────────────────────────────────
  {
    id: 'maid_of_honour_intro',
    recipientRole: 'maid_of_honour',
    channel: 'whatsapp',
    sendOffsetDays: -84,
    body: `Hi {first_name} — Annette from 4Ever Photos here. {bride_first_name} has put you down as her Maid of Honour, which means you're going to be one of the most important people in our day.

Over the next twelve weeks, I'll send you a few small, useful things at the right moments — getting-ready timings, hair and makeup details, a playlist suggestion for the morning, what to bring, where to be. You don't need to remember any of it. We'll remind you.

For now: just save my number. I'll be in touch.

With love,
Annette ✦`,
    notes: 'Introductory message for Maid of Honour, twelve weeks out.'
  },

  {
    id: 'maid_of_honour_day_before',
    recipientRole: 'maid_of_honour',
    channel: 'sms',
    sendOffsetDays: -1,
    sendTime: '17:00',
    body: `{first_name} — quick recap for tomorrow. Hair & makeup begins {hair_makeup_start_time} at {bridal_suite_address}. Maps: {google_maps_link_bridal_suite}. Bring: comfy shoes, a snack, the speech if you're giving one. Sarah's bouquet arrives at {bouquet_arrival_time}. I'll see you there at {photographer_arrival_time}. Sleep well. — Annette`,
    notes: 'Day-before SMS with specific timings. Variables will be populated from the couple\'s day-of plan.'
  },

  // ─────────────────────────────────────────────────────────────
  // BRIDESMAIDS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'bridesmaid_getting_ready_note',
    recipientRole: 'bridesmaid',
    channel: 'whatsapp',
    sendOffsetDays: -28,
    body: `Hi {first_name} — Annette from 4Ever Photos here.

Four weeks until {couple_first_names}'s big day. A small, useful note about the morning:

✦ We'll be photographing the getting-ready from around {photographer_arrival_time}.
✦ Pack flat shoes for between ceremony and reception — your future feet will thank you.
✦ Champagne in the morning is lovely; champagne before makeup is brave. Pace yourself.
✦ Bring something little of your own — a photo, a note, a charm. We love capturing the personal things.

I'll send you proper timings nearer the day.

— Annette ✦`,
    notes: 'Four weeks out. Warm, practical, a little wry.'
  },

  // ─────────────────────────────────────────────────────────────
  // PARENTS OF THE BRIDE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'parent_bride_family_photo_plan',
    recipientRole: 'parent_of_bride',
    channel: 'email',
    sendOffsetDays: -28,
    subject: 'Family photographs on the day — a small plan',
    body: `Dear {first_name},

I'm Annette, the photographer for {bride_first_name} and {groom_first_name}'s wedding on {wedding_date}.

Family photographs are one of the most precious parts of the day — and also, if I'm honest, one of the parts that benefits from a little planning beforehand. So I wanted to send you this small note.

We've allocated roughly 25 minutes for the family group shots, immediately after the ceremony. We'll be working from a shortlist that {bride_first_name} and {groom_first_name} have approved — typically 8–10 groupings — to keep things moving and make sure no one waits too long.

If there's anything sensitive we should know about — anyone who'd rather not stand next to anyone else, anyone who'd benefit from a moment of their own, anything at all — please reply to this email in confidence. We hold these things very carefully and they never leave us.

I'll send you the day-of timing in your final week.

With warmth,
Annette
4Ever Photos`,
    notes: 'Crucial message. The "confidential reply" is the emotional intelligence layer — Annette can flag sensitive family dynamics in advance.'
  },

  // ─────────────────────────────────────────────────────────────
  // FATHER OF THE BRIDE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'father_of_bride_aisle_note',
    recipientRole: 'father_of_bride',
    channel: 'whatsapp',
    sendOffsetDays: -7,
    body: `{first_name} — one week to go. A small note about walking {bride_first_name} down the aisle:

Slow. Slower than you think.

Most fathers walk it in about 20 seconds. The aisle is meant to take a minute. Pause at the back. Take her in. Then walk in time with the music, not ahead of it. We'll be at the front capturing every step — your job is just to be present.

If she squeezes your arm, squeeze back. That's the photograph people cry at, every time.

— Annette ✦`,
    notes: 'A gentle, emotional note. One of the most personal messages we send.'
  },

  // ─────────────────────────────────────────────────────────────
  // USHERS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'usher_duties',
    recipientRole: 'usher',
    channel: 'whatsapp',
    sendOffsetDays: -14,
    body: `Hi {first_name} — Annette from 4Ever Photos here. Two weeks until {couple_first_names}'s wedding.

A quick note on the morning. Ushers usually arrive at {ceremony_venue} about {ushers_arrival_time}, ahead of guests. Your job is gentle: greet, smile, hand out orders of service, point bride's side to the left and groom's side to the right (or just ask — most guests don't know either).

Reserve the front rows for immediate family if there are signs. If anyone needs accessibility help, you're the first point of contact.

I'll be there from {photographer_arrival_time}. Come and find me if anything looks tricky.

— Annette ✦`,
    notes: 'Two weeks out. Sets expectations without being heavy.'
  },

  // ─────────────────────────────────────────────────────────────
  // SUPPLIERS — FLORIST
  // ─────────────────────────────────────────────────────────────
  {
    id: 'supplier_florist_shot_wishes',
    recipientRole: 'supplier_florist',
    channel: 'email',
    sendOffsetDays: -21,
    subject: 'Floral photography for {couple_first_names}\'s wedding',
    body: `Hello {first_name},

I'm Annette, the photographer for {couple_first_names}'s wedding at {wedding_venue} on {wedding_date}.

I'd love to make sure your work is photographed beautifully on the day — both for the couple's gallery and for your own portfolio. A few quick questions:

1. Are there particular arrangements or details you'd love captured? (Bouquet close-ups, archway, table centrepieces, the entrance installation, a specific bloom you're proud of...)
2. What time will you be on site, and what time will the arrangements be in place?
3. Are there any arrangements that are time-sensitive or fragile — things we should photograph first?

I'll send the final shot list to {couple_first_names} for approval and then make sure your work gets the attention it deserves.

If you'd like, I'm happy to share a few high-resolution images afterwards for your portfolio (with the couple's permission). Just let me know.

With warmth,
Annette
4Ever Photos`,
    notes: 'Three weeks out. The supplier outreach. Build relationship, capture extra value.'
  },

  // ─────────────────────────────────────────────────────────────
  // SUPPLIERS — WEDDING PLANNER
  // ─────────────────────────────────────────────────────────────
  {
    id: 'supplier_planner_coordination',
    recipientRole: 'supplier_other',
    channel: 'email',
    sendOffsetDays: -7,
    subject: 'Final coordination — {couple_first_names}\'s day',
    body: `Hi {first_name},

We're one week out from {couple_first_names}'s wedding. I just wanted to drop you a quick line to coordinate.

Could you share the latest run-sheet? I want to make sure my team and I are dropping in at the right moments — particularly for cocktail hour, the speeches, the first dance, and any surprise reveals you've planned.

A few things from our side:
✦ We arrive at {photographer_arrival_time}.
✦ We'll be discreet during ceremony — wireless, mostly invisible.
✦ Family groups: 25 minutes immediately after ceremony.
✦ Sunset is {sunset_time}; we'd love 15 minutes with just the couple about 30 minutes before.
✦ We'll be packed and gone by {photographer_departure_time}.

Looking forward to working together.

Annette
4Ever Photos`,
    notes: 'One week out. Professional, collaborative.'
  },

  // ─────────────────────────────────────────────────────────────
  // SUPPLIERS — HAIR & MAKEUP
  // ─────────────────────────────────────────────────────────────
  {
    id: 'supplier_hair_makeup_timing',
    recipientRole: 'supplier_hairdresser',
    channel: 'email',
    sendOffsetDays: -14,
    subject: 'Getting-ready photography for {bride_first_name}',
    body: `Hello {first_name},

I'm Annette, the photographer for {bride_first_name} and {groom_first_name}'s wedding on {wedding_date}.

I'll be arriving at {bridal_suite_address} at {photographer_arrival_time} to begin the getting-ready coverage. To make sure we get the best of your work captured:

✦ Could you let me know your schedule — who's being styled when, and when the bride is in the chair?
✦ I'd love about 15 minutes of close work with the bride in the chair (with your permission of course).
✦ Final reveal: any specific lighting or angle you'd love me to capture as she sees herself?

Happy to share a few portfolio-quality images with you after the day (with the couple's permission). Just let me know.

Looking forward to working alongside you,
Annette ✦`,
    notes: 'Two weeks out. Builds rapport with the H&M team.'
  }
];

// Helper: get all messages that go out on a given day relative to the wedding
export function getMessagesForOffset(offsetDays: number): MessageTemplate[] {
  return MESSAGE_TEMPLATES.filter((m) => m.sendOffsetDays === offsetDays);
}

// Helper: get all messages for a given role
export function getMessagesForRole(role: RoleSlug): MessageTemplate[] {
  return MESSAGE_TEMPLATES.filter((m) =>
    Array.isArray(m.recipientRole) ? m.recipientRole.includes(role) : m.recipientRole === role
  );
}
