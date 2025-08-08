// Demo data for GitHub Pages showcase
// This provides realistic data for demonstration without needing a backend

export const demoUser = {
  id: 'demo-user-1',
  name: 'Demo Property Manager',
  email: 'demo@flowcrm.com',
  role: 'manager'
};

export const demoCompanies = [
  {
    id: 'company-1',
    name: 'Sunset Apartments Complex',
    industry: 'Residential Property Management',
    location: 'Los Angeles, CA',
    size: '51-200',
    phone: '(555) 123-4567',
    website: 'https://sunsetapts.com',
    revenue: 2500000,
    isActive: true,
    stats: {
      contactCount: 3,
      dealCount: 2,
      totalDealValue: 208000,
      activeDealCount: 2
    }
  },
  {
    id: 'company-2',
    name: 'Downtown Office Tower',
    industry: 'Commercial Property Management',
    location: 'San Francisco, CA',
    size: '201-500',
    phone: '(555) 987-6543',
    website: 'https://downtowntower.com',
    revenue: 5000000,
    isActive: true,
    stats: {
      contactCount: 2,
      dealCount: 2,
      totalDealValue: 180000,
      activeDealCount: 1
    }
  },
  {
    id: 'company-3',
    name: 'Riverside Shopping Center',
    industry: 'Retail Property Management',
    location: 'Sacramento, CA',
    size: '51-200',
    phone: '(555) 234-5678',
    revenue: 3200000,
    isActive: true,
    stats: {
      contactCount: 1,
      dealCount: 2,
      totalDealValue: 107000,
      activeDealCount: 2
    }
  }
];

export const demoContacts = [
  {
    id: 'contact-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@sunsetapts.com',
    phone: '(555) 123-4001',
    position: 'Property Manager',
    source: 'referral',
    tags: ['residential', 'high_value', 'maintenance_contract'],
    notes: 'Very interested in comprehensive maintenance services. Decision maker for the complex.',
    lastContacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isActive: true,
    companyId: 'company-1',
    company: {
      id: 'company-1',
      name: 'Sunset Apartments Complex',
      location: 'Los Angeles, CA'
    }
  },
  {
    id: 'contact-2',
    name: 'Michael Chen',
    email: 'mchen@downtowntower.com',
    phone: '(555) 987-6001',
    position: 'Building Operations Director',
    source: 'website',
    tags: ['commercial', 'premium', 'long_term'],
    notes: 'Looking for premium maintenance services for high-end office building.',
    lastContacted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isActive: true,
    companyId: 'company-2',
    company: {
      id: 'company-2',
      name: 'Downtown Office Tower',
      location: 'San Francisco, CA'
    }
  },
  {
    id: 'contact-3',
    name: 'David Thompson',
    email: 'dthompson@riversideshops.com',
    phone: '(555) 234-5001',
    position: 'Facilities Manager',
    source: 'cold_outreach',
    tags: ['retail', 'mixed_use', 'high_traffic'],
    notes: 'Manages retail and office spaces. Concerned about minimizing business disruption.',
    lastContacted: null,
    isActive: true,
    companyId: 'company-3',
    company: {
      id: 'company-3',
      name: 'Riverside Shopping Center',
      location: 'Sacramento, CA'
    }
  }
];

export const demoDeals = {
  lead: [
    {
      id: 'deal-1',
      title: 'Riverside Shopping Center - Retail Space Lease',
      description: 'New 2,500 sq ft retail space lease for expanding restaurant chain.',
      stage: 'lead',
      status: 'open',
      value: 72000,
      probability: 25,
      priority: 'medium',
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      contactId: 'contact-3',
      companyId: 'company-3',
      contact: { id: 'contact-3', name: 'David Thompson', email: 'dthompson@riversideshops.com' },
      company: { id: 'company-3', name: 'Riverside Shopping Center', location: 'Sacramento, CA' }
    },
    {
      id: 'deal-2',
      title: 'New Development - Property Management Partnership',
      description: 'Full property management services for new 200-unit apartment development.',
      stage: 'lead',
      status: 'open',
      value: 240000,
      probability: 35,
      priority: 'urgent',
      closeDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      contactId: null,
      companyId: null,
      contact: null,
      company: null
    }
  ],
  qualified: [
    {
      id: 'deal-3',
      title: 'Sunset Apartments - Gym Equipment Lease',
      description: 'New fitness center equipment lease and maintenance for apartment complex amenities.',
      stage: 'qualified',
      status: 'open',
      value: 28000,
      probability: 70,
      priority: 'low',
      closeDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      contactId: 'contact-1',
      companyId: 'company-1',
      contact: { id: 'contact-1', name: 'Sarah Johnson', email: 'sarah.johnson@sunsetapts.com' },
      company: { id: 'company-1', name: 'Sunset Apartments Complex', location: 'Los Angeles, CA' }
    }
  ],
  proposal: [
    {
      id: 'deal-4',
      title: 'Sunset Apartments - Comprehensive Maintenance Contract',
      description: 'Annual maintenance contract covering HVAC, plumbing, electrical, and landscaping for 150-unit apartment complex.',
      stage: 'proposal',
      status: 'open',
      value: 180000,
      probability: 75,
      priority: 'high',
      closeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      contactId: 'contact-1',
      companyId: 'company-1',
      contact: { id: 'contact-1', name: 'Sarah Johnson', email: 'sarah.johnson@sunsetapts.com' },
      company: { id: 'company-1', name: 'Sunset Apartments Complex', location: 'Los Angeles, CA' }
    },
    {
      id: 'deal-5',
      title: 'Shopping Center - Parking Lot Resurfacing',
      description: 'Complete parking lot resurfacing and re-striping for better customer experience.',
      stage: 'proposal',
      status: 'open',
      value: 35000,
      probability: 65,
      priority: 'medium',
      closeDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      contactId: 'contact-3',
      companyId: 'company-3',
      contact: { id: 'contact-3', name: 'David Thompson', email: 'dthompson@riversideshops.com' },
      company: { id: 'company-3', name: 'Riverside Shopping Center', location: 'Sacramento, CA' }
    }
  ],
  negotiation: [
    {
      id: 'deal-6',
      title: 'Downtown Office Tower - Premium Cleaning Services',
      description: 'Daily cleaning services for high-end office building including common areas, offices, and executive floors.',
      stage: 'negotiation',
      status: 'open',
      value: 95000,
      probability: 80,
      priority: 'high',
      closeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      contactId: 'contact-2',
      companyId: 'company-2',
      contact: { id: 'contact-2', name: 'Michael Chen', email: 'mchen@downtowntower.com' },
      company: { id: 'company-2', name: 'Downtown Office Tower', location: 'San Francisco, CA' }
    }
  ],
  closed_won: [
    {
      id: 'deal-7',
      title: 'Industrial Park - Warehouse Security Upgrade',
      description: 'Complete security system upgrade including cameras, access control, and monitoring services.',
      stage: 'closed_won',
      status: 'won',
      value: 125000,
      probability: 100,
      priority: 'high',
      closeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      actualCloseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      contactId: null,
      companyId: null,
      contact: { name: 'Amanda Foster' },
      company: { name: 'Greenfield Industrial Park' }
    }
  ],
  closed_lost: [
    {
      id: 'deal-8',
      title: 'Downtown Tower - Executive Floor Renovation',
      description: 'High-end renovation of executive floors including new flooring, lighting, and furniture.',
      stage: 'closed_lost',
      status: 'lost',
      value: 85000,
      probability: 0,
      priority: 'medium',
      closeDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      actualCloseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lostReason: 'Budget constraints - client chose lower-cost alternative',
      contactId: 'contact-2',
      companyId: 'company-2',
      contact: { id: 'contact-2', name: 'Michael Chen', email: 'mchen@downtowntower.com' },
      company: { id: 'company-2', name: 'Downtown Office Tower', location: 'San Francisco, CA' }
    }
  ]
};

export const demoPipelineStats = {
  totalDeals: 8,
  totalValue: 860000,
  avgDealSize: 107500,
  stageDistribution: [
    { stage: 'lead', count: 2, value: 312000 },
    { stage: 'qualified', count: 1, value: 28000 },
    { stage: 'proposal', count: 2, value: 215000 },
    { stage: 'negotiation', count: 1, value: 95000 },
    { stage: 'closed_won', count: 1, value: 125000 },
    { stage: 'closed_lost', count: 1, value: 85000 }
  ]
};

export const demoTasks = [
  {
    id: 'task-1',
    title: 'Schedule HVAC inspection for Sunset Apartments',
    description: 'Annual HVAC system inspection for all 150 units',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    contactId: 'contact-1',
    dealId: 'deal-4',
    assignedUser: { id: 'demo-user-1', name: 'Demo Property Manager' },
    contact: { id: 'contact-1', name: 'Sarah Johnson' },
    deal: { id: 'deal-4', title: 'Sunset Apartments - Comprehensive Maintenance Contract' }
  },
  {
    id: 'task-2',
    title: 'Prepare proposal for Downtown Office cleaning',
    description: 'Create detailed cleaning services proposal including pricing and scheduling',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    contactId: 'contact-2',
    dealId: 'deal-6',
    assignedUser: { id: 'demo-user-1', name: 'Demo Property Manager' },
    contact: { id: 'contact-2', name: 'Michael Chen' },
    deal: { id: 'deal-6', title: 'Downtown Office Tower - Premium Cleaning Services' }
  },
  {
    id: 'task-3',
    title: 'Site visit - Riverside Shopping Center',
    description: 'Assess parking lot condition and provide resurfacing estimate',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    contactId: 'contact-3',
    dealId: 'deal-5',
    assignedUser: { id: 'demo-user-1', name: 'Demo Property Manager' },
    contact: { id: 'contact-3', name: 'David Thompson' },
    deal: { id: 'deal-5', title: 'Shopping Center - Parking Lot Resurfacing' }
  }
];

export const demoTaskStats = {
  total: 8,
  pending: 5,
  inProgress: 2,
  completed: 1,
  overdue: 1,
  dueSoon: 3
};

export const demoActivities = [
  {
    id: 'activity-1',
    type: 'call',
    summary: 'Discussed maintenance contract details with Sarah',
    description: 'Covered HVAC maintenance schedule, emergency response times, and pricing structure.',
    outcome: 'positive',
    duration: 45,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    contactId: 'contact-1',
    dealId: 'deal-4',
    contact: { id: 'contact-1', name: 'Sarah Johnson', email: 'sarah.johnson@sunsetapts.com' },
    deal: { id: 'deal-4', title: 'Sunset Apartments - Comprehensive Maintenance Contract' }
  },
  {
    id: 'activity-2',
    type: 'email',
    summary: 'Sent proposal to Downtown Office Tower',
    description: 'Emailed detailed cleaning services proposal with pricing breakdown and service schedule.',
    outcome: 'neutral',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    contactId: 'contact-2',
    dealId: 'deal-6',
    contact: { id: 'contact-2', name: 'Michael Chen', email: 'mchen@downtowntower.com' },
    deal: { id: 'deal-6', title: 'Downtown Office Tower - Premium Cleaning Services' }
  },
  {
    id: 'activity-3',
    type: 'meeting',
    summary: 'Initial consultation at Riverside Shopping Center',
    description: 'Met with facilities manager to assess parking lot condition and discuss resurfacing options.',
    outcome: 'positive',
    duration: 90,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    contactId: 'contact-3',
    dealId: 'deal-5',
    contact: { id: 'contact-3', name: 'David Thompson', email: 'dthompson@riversideshops.com' },
    deal: { id: 'deal-5', title: 'Shopping Center - Parking Lot Resurfacing' }
  }
];

// Demo mode detection
export const isDemoMode = () => {
  return import.meta.env.VITE_DEMO_MODE === 'true' || 
         window.location.hostname.includes('github.io') ||
         window.location.hostname.includes('netlify.app') ||
         window.location.hostname.includes('vercel.app');
};