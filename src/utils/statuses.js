export const STATUSES = ['Not Contacted', 'Messaged', 'Replied', 'Interview', 'Closed']

export const APP_STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn', 'Ghosted']
export const SOURCES = ['LinkedIn', 'Seek', 'Company site', 'Referral', 'Recruiter', 'Other']
export const WORK_MODES = ['On-site', 'Hybrid', 'Remote']

// Status -> colour key (matches the --status-* tokens). Application stages
// reuse the contact colours where the meaning lines up.
export const STATUS_KEYS = {
  'Not Contacted': 'not-contacted',
  'Messaged': 'messaged',
  'Replied': 'replied',
  'Interview': 'interview',
  'Closed': 'closed',
  'Applied': 'messaged',
  'Screening': 'replied',
  'Offer': 'offer',
  'Rejected': 'closed',
  'Withdrawn': 'not-contacted',
  'Ghosted': 'not-contacted',
}
