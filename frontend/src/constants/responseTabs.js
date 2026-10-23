export const responseTabs = [
  { kind: 'registrations', label: 'Registrations', recordKind: 'registration', singular: 'Registration' },
  { kind: 'enquiries', label: 'Enquiries', recordKind: 'enquiry', singular: 'Enquiry' },
  { kind: 'general', label: 'General', recordKind: 'general', singular: 'General' },
]

export const responseTabByKind = Object.fromEntries(responseTabs.map((tab) => [tab.kind, tab]))

export const responseTabByRecordKind = Object.fromEntries(responseTabs.map((tab) => [tab.recordKind, tab]))
