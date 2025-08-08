// Demo API layer - simulates backend responses with demo data
import {
  demoUser,
  demoCompanies,
  demoContacts,
  demoDeals,
  demoPipelineStats,
  demoTasks,
  demoTaskStats,
  demoActivities,
  isDemoMode
} from './demoData';

// Simulate API delay for realistic feel
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Demo authentication
export const demoAuthAPI = {
  login: async (email, password) => {
    await delay(500);
    
    // Accept any email/password in demo mode
    if (email && password) {
      return {
        token: 'demo-jwt-token-' + Date.now(),
        user: demoUser
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  register: async (name, email, password) => {
    await delay(500);
    return {
      token: 'demo-jwt-token-' + Date.now(),
      user: { ...demoUser, name, email }
    };
  },
  
  getCurrentUser: async () => {
    await delay(200);
    return { user: demoUser };
  },
  
  logout: async () => {
    await delay(200);
    return true;
  }
};

// Demo companies API
export const demoCompaniesAPI = {
  getAll: async (params = {}) => {
    await delay();
    const { page = 1, limit = 20, search } = params;
    
    let companies = [...demoCompanies];
    
    if (search) {
      companies = companies.filter(company => 
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const total = companies.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCompanies = companies.slice(startIndex, endIndex);
    
    return {
      companies: paginatedCompanies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        limit: parseInt(limit)
      }
    };
  },
  
  getById: async (id) => {
    await delay();
    const company = demoCompanies.find(c => c.id === id);
    if (!company) throw new Error('Company not found');
    return { company };
  },
  
  create: async (companyData) => {
    await delay(800);
    const newCompany = {
      id: 'company-' + Date.now(),
      ...companyData,
      isActive: true,
      stats: {
        contactCount: 0,
        dealCount: 0,
        totalDealValue: 0,
        activeDealCount: 0
      }
    };
    return { company: newCompany };
  }
};

// Demo contacts API
export const demoContactsAPI = {
  getAll: async (params = {}) => {
    await delay();
    const { page = 1, limit = 20, search } = params;
    
    let contacts = [...demoContacts];
    
    if (search) {
      contacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const total = contacts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContacts = contacts.slice(startIndex, endIndex);
    
    return {
      contacts: paginatedContacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        limit: parseInt(limit)
      }
    };
  },
  
  create: async (contactData) => {
    await delay(800);
    const newContact = {
      id: 'contact-' + Date.now(),
      ...contactData,
      isActive: true,
      lastContacted: null
    };
    return { contact: newContact };
  }
};

// Demo deals API
export const demoDealsAPI = {
  getPipeline: async () => {
    await delay(400);
    return {
      pipeline: demoDeals,
      stats: demoPipelineStats
    };
  },
  
  updateStage: async (dealId, newStage) => {
    await delay(300);
    
    // Find the deal and move it to new stage
    let updatedDeal = null;
    
    // Remove from current stage
    Object.keys(demoDeals).forEach(stage => {
      const dealIndex = demoDeals[stage].findIndex(deal => deal.id === dealId);
      if (dealIndex !== -1) {
        updatedDeal = { ...demoDeals[stage][dealIndex], stage: newStage };
        demoDeals[stage].splice(dealIndex, 1);
      }
    });
    
    // Add to new stage
    if (updatedDeal) {
      demoDeals[newStage] = demoDeals[newStage] || [];
      demoDeals[newStage].push(updatedDeal);
    }
    
    return { deal: updatedDeal };
  },
  
  create: async (dealData) => {
    await delay(800);
    const newDeal = {
      id: 'deal-' + Date.now(),
      ...dealData,
      status: 'open',
      contact: dealData.contactId ? demoContacts.find(c => c.id === dealData.contactId) : null,
      company: dealData.companyId ? demoCompanies.find(c => c.id === dealData.companyId) : null
    };
    
    // Add to appropriate stage
    demoDeals[newDeal.stage] = demoDeals[newDeal.stage] || [];
    demoDeals[newDeal.stage].push(newDeal);
    
    return { deal: newDeal };
  }
};

// Demo tasks API
export const demoTasksAPI = {
  getDashboard: async () => {
    await delay(300);
    return {
      stats: demoTaskStats,
      recentTasks: demoTasks.slice(0, 5)
    };
  },
  
  getAll: async (params = {}) => {
    await delay();
    const { page = 1, limit = 20 } = params;
    
    const total = demoTasks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = demoTasks.slice(startIndex, endIndex);
    
    return {
      tasks: paginatedTasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        limit: parseInt(limit)
      }
    };
  }
};

// Demo activities API
export const demoActivitiesAPI = {
  getAll: async (params = {}) => {
    await delay();
    const { page = 1, limit = 20 } = params;
    
    const total = demoActivities.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = demoActivities.slice(startIndex, endIndex);
    
    return {
      activities: paginatedActivities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        limit: parseInt(limit)
      }
    };
  },
  
  getTimeline: async (params = {}) => {
    await delay(300);
    const { days = 30 } = params;
    
    // Group activities by date
    const groupedActivities = demoActivities.reduce((groups, activity) => {
      const date = activity.timestamp.toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});
    
    return {
      timeline: groupedActivities,
      stats: {
        totalActivities: demoActivities.length,
        periodDays: parseInt(days),
        avgPerDay: (demoActivities.length / parseInt(days)).toFixed(1)
      }
    };
  }
};

// Demo users API
export const demoUsersAPI = {
  getAll: async (params = {}) => {
    await delay();
    return {
      users: [demoUser],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
        limit: 20
      }
    };
  }
};

// Demo lead scores API
export const demoLeadScoresAPI = {
  getAll: async () => {
    await delay();
    return {
      leadScores: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 20
      }
    };
  },
  
  getAnalytics: async () => {
    await delay();
    return {
      summary: {
        totalLeads: 3,
        hotLeads: 1,
        warmLeads: 1,
        coldLeads: 1,
        averageScore: 65
      },
      recentHotLeads: [],
      insights: {
        hotLeadPercentage: 33,
        conversionOpportunity: 2,
        scoringHealth: 'good'
      }
    };
  }
};

// Export demo mode flag
export { isDemoMode };