/**
 * Single source of truth for all mock data across the app.
 * When real Supabase data is wired up, replace these exports with API calls.
 */

export const MOCK_DOCUMENTS = [
  { id: '1',  title: 'CSCS Card',            entityName: 'John Smith',     entityType: 'person',  certificateNumber: 'CSCS123456',    issueDate: '2024-01-15', expiryDate: '2029-01-15', status: 'valid',    daysUntilExpiry: 1095 },
  { id: '2',  title: 'MOT Certificate',       entityName: 'AB12 CDE',       entityType: 'vehicle', certificateNumber: 'MOT987654',     issueDate: '2025-02-10', expiryDate: '2026-03-15', status: 'expiring', daysUntilExpiry: 7 },
  { id: '3',  title: 'IPAF Certificate',      entityName: 'Sarah Johnson',  entityType: 'person',  certificateNumber: 'IPAF456789',    issueDate: '2023-06-20', expiryDate: '2026-02-01', status: 'expired',  daysUntilExpiry: -37 },
  { id: '4',  title: 'LOLER Inspection',      entityName: 'SCAF-001',       entityType: 'asset',   certificateNumber: 'LOLER2024-042', issueDate: '2024-11-15', expiryDate: '2026-04-20', status: 'expiring', daysUntilExpiry: 12 },
  { id: '5',  title: 'Vehicle Insurance',     entityName: 'FG34 HIJ',       entityType: 'vehicle', certificateNumber: 'INS123789',     issueDate: '2025-01-01', expiryDate: '2026-01-01', status: 'valid',    daysUntilExpiry: 298 },
  { id: '6',  title: 'First Aid Certificate', entityName: 'Mike Davies',    entityType: 'person',  certificateNumber: 'FA-2024-0821',  issueDate: '2024-04-01', expiryDate: '2027-04-01', status: 'valid',    daysUntilExpiry: 365 },
  { id: '7',  title: 'PAT Test',              entityName: 'TOOL-042',       entityType: 'asset',   certificateNumber: 'PAT-042-2025',  issueDate: '2025-01-10', expiryDate: '2026-01-10', status: 'valid',    daysUntilExpiry: 285 },
  { id: '8',  title: 'Road Tax',              entityName: 'KL56 MNO',       entityType: 'vehicle', certificateNumber: 'TAX-KL56-2025', issueDate: '2025-03-01', expiryDate: '2026-03-01', status: 'expiring', daysUntilExpiry: 14 },
  { id: '9',  title: 'CSCS Card',             entityName: 'Emma Wilson',    entityType: 'person',  certificateNumber: 'CSCS789012',    issueDate: '2023-09-01', expiryDate: '2028-09-01', status: 'valid',    daysUntilExpiry: 880 },
  { id: '10', title: 'Safety Certificate',    entityName: 'LIFT-008',       entityType: 'asset',   certificateNumber: 'CERT-LIFT-008', issueDate: '2024-03-15', expiryDate: '2027-03-15', status: 'valid',    daysUntilExpiry: 372 },
  { id: '11', title: 'MOT Certificate',       entityName: 'PQ78 RST',       entityType: 'vehicle', certificateNumber: 'MOT456321',     issueDate: '2025-01-20', expiryDate: '2026-01-20', status: 'valid',    daysUntilExpiry: 295 },
  { id: '12', title: 'PASMA Certificate',     entityName: 'James Brown',    entityType: 'person',  certificateNumber: 'PASMA-2024-091',issueDate: '2024-07-01', expiryDate: '2026-04-02', status: 'expiring', daysUntilExpiry: 0 },
  { id: '13', title: 'LOLER Inspection',      entityName: 'LIFT-012',       entityType: 'asset',   certificateNumber: 'LOLER-LIFT-012',issueDate: '2025-01-01', expiryDate: '2026-07-01', status: 'valid',    daysUntilExpiry: 183 },
  { id: '14', title: 'Working at Height',     entityName: 'Tom Harris',     entityType: 'person',  certificateNumber: 'WAH-2023-441',  issueDate: '2023-11-15', expiryDate: '2025-11-15', status: 'expired',  daysUntilExpiry: -45 },
  { id: '15', title: 'Vehicle Insurance',     entityName: 'UV90 WXY',       entityType: 'vehicle', certificateNumber: 'INS-UV90-2025', issueDate: '2025-06-01', expiryDate: '2026-06-01', status: 'valid',    daysUntilExpiry: 150 },
  { id: '16', title: 'PAT Test',              entityName: 'COMP-023',       entityType: 'asset',   certificateNumber: 'PAT-023-2025',  issueDate: '2025-02-01', expiryDate: '2026-02-01', status: 'valid',    daysUntilExpiry: 305 },
  { id: '17', title: 'CSCS Card',             entityName: 'Dan Booth',      entityType: 'person',  certificateNumber: 'CSCS345678',    issueDate: '2022-05-01', expiryDate: '2025-05-01', status: 'expired',  daysUntilExpiry: -330 },
  { id: '18', title: 'Service Record',        entityName: 'AB12 CDE',       entityType: 'vehicle', certificateNumber: 'SVC-2026-001',  issueDate: '2026-01-15', expiryDate: '2026-07-15', status: 'valid',    daysUntilExpiry: 105 },
  { id: '19', title: 'IPAF Certificate',      entityName: 'Amy Clarke',     entityType: 'person',  certificateNumber: 'IPAF-AC-2024',  issueDate: '2024-03-01', expiryDate: '2027-03-01', status: 'valid',    daysUntilExpiry: 335 },
  { id: '20', title: 'LOLER Inspection',      entityName: 'SCAF-002',       entityType: 'asset',   certificateNumber: 'LOLER-S2-2024', issueDate: '2024-06-01', expiryDate: '2026-06-01', status: 'valid',    daysUntilExpiry: 155 },
  { id: '21', title: 'Scaffold Licence',      entityName: 'Neil Harvey',    entityType: 'person',  certificateNumber: 'SCAF-NH-2023',  issueDate: '2023-08-01', expiryDate: '2026-08-01', status: 'valid',    daysUntilExpiry: 213 },
  { id: '22', title: 'MOT Certificate',       entityName: 'DE22 FGH',       entityType: 'vehicle', certificateNumber: 'MOT-DE22-2025', issueDate: '2025-04-01', expiryDate: '2026-04-22', status: 'expiring', daysUntilExpiry: 20 },
  { id: '23', title: 'PAT Test',              entityName: 'TOOL-018',       entityType: 'asset',   certificateNumber: 'PAT-018-2025',  issueDate: '2025-03-01', expiryDate: '2026-03-01', status: 'expiring', daysUntilExpiry: 3 },
  { id: '24', title: 'Manual Handling',       entityName: 'Emma Wilson',    entityType: 'person',  certificateNumber: 'MH-EW-2024',    issueDate: '2024-02-01', expiryDate: '2027-02-01', status: 'valid',    daysUntilExpiry: 400 },
  { id: '25', title: 'Vehicle Insurance',     entityName: 'IJ33 KLM',       entityType: 'vehicle', certificateNumber: 'INS-IJ33-2025', issueDate: '2025-05-01', expiryDate: '2026-05-01', status: 'valid',    daysUntilExpiry: 120 },
];

export const MOCK_PEOPLE = [
  { id: '1',  name: 'John Smith',     role: 'Carpenter',       team: 'Site A', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2',  name: 'Sarah Johnson',  role: 'Electrician',     team: 'Site B', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '3',  name: 'Mike Davies',    role: 'Site Manager',    team: 'Site A', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '4',  name: 'Emma Wilson',    role: 'Labourer',        team: 'Site C', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '5',  name: 'James Brown',    role: 'Scaffolder',      team: 'Site B', documents: 4, expiring: 2, expired: 0, status: 'expiring' },
  { id: '6',  name: 'Amy Clarke',     role: 'Health & Safety', team: 'Site A', documents: 6, expiring: 0, expired: 0, status: 'valid' },
  { id: '7',  name: 'Tom Harris',     role: 'Plasterer',       team: 'Site C', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '8',  name: 'Lisa Patel',     role: 'Project Manager', team: 'Site B', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '9',  name: 'Dan Booth',      role: 'Electrician',     team: 'Site A', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '10', name: 'Rachel Green',   role: 'Labourer',        team: 'Site C', documents: 2, expiring: 0, expired: 1, status: 'expired' },
];

export const MOCK_VEHICLES = [
  { id: '1', registration: 'AB12 CDE', make: 'Ford',       model: 'Transit',  type: 'Van',    depot: 'Site A', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2', registration: 'FG34 HIJ', make: 'Volkswagen', model: 'Caddy',    type: 'Van',    depot: 'Site B', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '3', registration: 'KL56 MNO', make: 'Mercedes',   model: 'Sprinter', type: 'Van',    depot: 'Site A', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '4', registration: 'PQ78 RST', make: 'Isuzu',      model: 'D-Max',    type: 'Pickup', depot: 'Site C', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '5', registration: 'UV90 WXY', make: 'Renault',    model: 'Master',   type: 'Van',    depot: 'Site B', documents: 4, expiring: 2, expired: 0, status: 'expiring' },
];

export const MOCK_ASSETS = [
  { id: '1', assetId: 'SCAF-001', name: 'Aluminium Tower Scaffold', type: 'Scaffold',         location: 'Site A', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2', assetId: 'COMP-023', name: 'Air Compressor 50L',       type: 'Compressor',       location: 'Depot',  documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '3', assetId: 'LADD-015', name: 'Extension Ladder 6m',      type: 'Ladder',           location: 'Site B', documents: 2, expiring: 0, expired: 1, status: 'expired' },
  { id: '4', assetId: 'LIFT-008', name: 'Scissor Lift 8m',          type: 'Access Equipment', location: 'Site C', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '5', assetId: 'TOOL-042', name: 'Portable Angle Grinder',   type: 'Power Tool',       location: 'Site A', documents: 1, expiring: 1, expired: 0, status: 'expiring' },
];
