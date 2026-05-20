/**
 * The roles a couple can assign to the people in their Inner Circle.
 *
 * Each role determines which message templates that person receives,
 * and when. Edit this list to add or rename roles — Claude Code will
 * reuse these definitions in the People manager and message engine.
 */

export type RoleSlug =
  // The couple themselves
  | 'bride'
  | 'groom'
  // Bridal party
  | 'maid_of_honour'
  | 'bridesmaid'
  | 'best_man'
  | 'groomsman'
  | 'usher'
  | 'flower_girl_guardian'
  | 'page_boy_guardian'
  // Family
  | 'parent_of_bride'
  | 'parent_of_groom'
  | 'father_of_bride'
  | 'mother_of_bride'
  | 'father_of_groom'
  | 'mother_of_groom'
  | 'sibling'
  // Suppliers
  | 'supplier_florist'
  | 'supplier_planner'
  | 'supplier_cake'
  | 'supplier_catering'
  | 'supplier_band_dj'
  | 'supplier_hair_makeup'
  | 'supplier_other';

export interface RoleDefinition {
  slug: RoleSlug;
  label: string;
  group: 'couple' | 'bridal_party' | 'family' | 'supplier';
  description: string;
}

export const ROLES: RoleDefinition[] = [
  // Couple
  { slug: 'bride', label: 'Bride', group: 'couple', description: 'The bride.' },
  { slug: 'groom', label: 'Groom', group: 'couple', description: 'The groom.' },

  // Bridal party
  { slug: 'maid_of_honour', label: 'Maid of Honour', group: 'bridal_party', description: 'The principal bridesmaid.' },
  { slug: 'bridesmaid', label: 'Bridesmaid', group: 'bridal_party', description: 'A member of the bridal party.' },
  { slug: 'best_man', label: 'Best Man', group: 'bridal_party', description: 'The best man.' },
  { slug: 'groomsman', label: 'Groomsman', group: 'bridal_party', description: 'A member of the groom\'s party.' },
  { slug: 'usher', label: 'Usher', group: 'bridal_party', description: 'Ushers guests on the day.' },
  { slug: 'flower_girl_guardian', label: 'Flower Girl\'s Parent', group: 'bridal_party', description: 'Parent/guardian of the flower girl.' },
  { slug: 'page_boy_guardian', label: 'Page Boy\'s Parent', group: 'bridal_party', description: 'Parent/guardian of the page boy.' },

  // Family
  { slug: 'father_of_bride', label: 'Father of the Bride', group: 'family', description: 'Father of the bride.' },
  { slug: 'mother_of_bride', label: 'Mother of the Bride', group: 'family', description: 'Mother of the bride.' },
  { slug: 'father_of_groom', label: 'Father of the Groom', group: 'family', description: 'Father of the groom.' },
  { slug: 'mother_of_groom', label: 'Mother of the Groom', group: 'family', description: 'Mother of the groom.' },
  { slug: 'parent_of_bride', label: 'Parent of the Bride', group: 'family', description: 'Either or both parents of the bride.' },
  { slug: 'parent_of_groom', label: 'Parent of the Groom', group: 'family', description: 'Either or both parents of the groom.' },
  { slug: 'sibling', label: 'Sibling', group: 'family', description: 'Brother or sister of the bride/groom.' },

  // Suppliers
  { slug: 'supplier_florist', label: 'Florist', group: 'supplier', description: 'Wedding florist.' },
  { slug: 'supplier_planner', label: 'Wedding Planner', group: 'supplier', description: 'On-the-day or full planner.' },
  { slug: 'supplier_cake', label: 'Cake Maker', group: 'supplier', description: 'Cake supplier.' },
  { slug: 'supplier_catering', label: 'Caterer', group: 'supplier', description: 'Catering supplier.' },
  { slug: 'supplier_band_dj', label: 'Band / DJ', group: 'supplier', description: 'Music supplier.' },
  { slug: 'supplier_hair_makeup', label: 'Hair & Makeup', group: 'supplier', description: 'Beauty team.' },
  { slug: 'supplier_other', label: 'Other Supplier', group: 'supplier', description: 'Anyone else providing a service.' }
];

export const ROLE_GROUPS = ['couple', 'bridal_party', 'family', 'supplier'] as const;
