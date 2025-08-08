// Role-based permissions system for FlowCRM

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  AGENT: 'agent'
};

export const PERMISSIONS = {
  // Company permissions
  COMPANIES_VIEW: 'companies.view',
  COMPANIES_CREATE: 'companies.create',
  COMPANIES_EDIT: 'companies.edit',
  COMPANIES_DELETE: 'companies.delete',
  
  // Contact permissions
  CONTACTS_VIEW: 'contacts.view',
  CONTACTS_CREATE: 'contacts.create',
  CONTACTS_EDIT: 'contacts.edit',
  CONTACTS_DELETE: 'contacts.delete',
  CONTACTS_VIEW_ALL: 'contacts.view_all', // View all contacts vs own contacts
  
  // Deal permissions
  DEALS_VIEW: 'deals.view',
  DEALS_CREATE: 'deals.create',
  DEALS_EDIT: 'deals.edit',
  DEALS_DELETE: 'deals.delete',
  DEALS_VIEW_ALL: 'deals.view_all', // View all deals vs own deals
  
  // Task permissions
  TASKS_VIEW: 'tasks.view',
  TASKS_CREATE: 'tasks.create',
  TASKS_EDIT: 'tasks.edit',
  TASKS_DELETE: 'tasks.delete',
  TASKS_ASSIGN: 'tasks.assign', // Assign tasks to others
  
  // Activity permissions
  ACTIVITIES_VIEW: 'activities.view',
  ACTIVITIES_CREATE: 'activities.create',
  ACTIVITIES_EDIT: 'activities.edit',
  ACTIVITIES_DELETE: 'activities.delete',
  ACTIVITIES_VIEW_ALL: 'activities.view_all', // View all activities vs own activities
  
  // User management permissions
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',
  
  // Dashboard permissions
  DASHBOARD_VIEW_ANALYTICS: 'dashboard.analytics',
  DASHBOARD_VIEW_REPORTS: 'dashboard.reports',
};

// Define role permissions mapping
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS)
  ],
  
  [ROLES.MANAGER]: [
    // Companies
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.COMPANIES_CREATE,
    PERMISSIONS.COMPANIES_EDIT,
    PERMISSIONS.COMPANIES_DELETE,
    
    // Contacts - full access
    PERMISSIONS.CONTACTS_VIEW,
    PERMISSIONS.CONTACTS_CREATE,
    PERMISSIONS.CONTACTS_EDIT,
    PERMISSIONS.CONTACTS_DELETE,
    PERMISSIONS.CONTACTS_VIEW_ALL,
    
    // Deals - full access
    PERMISSIONS.DEALS_VIEW,
    PERMISSIONS.DEALS_CREATE,
    PERMISSIONS.DEALS_EDIT,
    PERMISSIONS.DEALS_DELETE,
    PERMISSIONS.DEALS_VIEW_ALL,
    
    // Tasks - can manage team tasks
    PERMISSIONS.TASKS_VIEW,
    PERMISSIONS.TASKS_CREATE,
    PERMISSIONS.TASKS_EDIT,
    PERMISSIONS.TASKS_DELETE,
    PERMISSIONS.TASKS_ASSIGN,
    
    // Activities - full access
    PERMISSIONS.ACTIVITIES_VIEW,
    PERMISSIONS.ACTIVITIES_CREATE,
    PERMISSIONS.ACTIVITIES_EDIT,
    PERMISSIONS.ACTIVITIES_DELETE,
    PERMISSIONS.ACTIVITIES_VIEW_ALL,
    
    // Dashboard access
    PERMISSIONS.DASHBOARD_VIEW_ANALYTICS,
    PERMISSIONS.DASHBOARD_VIEW_REPORTS,
    
    // Limited user management
    PERMISSIONS.USERS_VIEW,
  ],
  
  [ROLES.AGENT]: [
    // Companies - view only
    PERMISSIONS.COMPANIES_VIEW,
    
    // Contacts - can manage own contacts
    PERMISSIONS.CONTACTS_VIEW,
    PERMISSIONS.CONTACTS_CREATE,
    PERMISSIONS.CONTACTS_EDIT,
    // Note: No CONTACTS_VIEW_ALL or DELETE for agents
    
    // Deals - can manage own deals  
    PERMISSIONS.DEALS_VIEW,
    PERMISSIONS.DEALS_CREATE,
    PERMISSIONS.DEALS_EDIT,
    // Note: No DEALS_VIEW_ALL or DELETE for agents
    
    // Tasks - can manage own tasks
    PERMISSIONS.TASKS_VIEW,
    PERMISSIONS.TASKS_CREATE,
    PERMISSIONS.TASKS_EDIT,
    // Note: No TASKS_DELETE or TASKS_ASSIGN for agents
    
    // Activities - can manage own activities
    PERMISSIONS.ACTIVITIES_VIEW,
    PERMISSIONS.ACTIVITIES_CREATE,
    PERMISSIONS.ACTIVITIES_EDIT,
    // Note: No ACTIVITIES_VIEW_ALL or DELETE for agents
    
    // Basic dashboard access
    PERMISSIONS.DASHBOARD_VIEW_ANALYTICS,
  ]
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role 
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) {
    return false;
  }
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

/**
 * Check if a user can perform any of the given permissions
 * @param {string} userRole - The user's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has at least one of the permissions
 */
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if a user can perform all of the given permissions
 * @param {string} userRole - The user's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has all of the permissions
 */
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get all permissions for a role
 * @param {string} userRole - The user's role
 * @returns {string[]} - Array of permissions
 */
export const getRolePermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || [];
};

/**
 * Check if user can view all records vs just their own
 * @param {string} userRole - The user's role
 * @param {string} resource - The resource type (contacts, deals, activities)
 * @returns {boolean} - Whether user can view all records
 */
export const canViewAllRecords = (userRole, resource) => {
  const viewAllPermissions = {
    'contacts': PERMISSIONS.CONTACTS_VIEW_ALL,
    'deals': PERMISSIONS.DEALS_VIEW_ALL,
    'activities': PERMISSIONS.ACTIVITIES_VIEW_ALL,
  };
  
  const permission = viewAllPermissions[resource];
  return permission ? hasPermission(userRole, permission) : false;
};

/**
 * Check if user can delete records
 * @param {string} userRole - The user's role  
 * @param {string} resource - The resource type
 * @returns {boolean} - Whether user can delete records
 */
export const canDelete = (userRole, resource) => {
  const deletePermissions = {
    'companies': PERMISSIONS.COMPANIES_DELETE,
    'contacts': PERMISSIONS.CONTACTS_DELETE,
    'deals': PERMISSIONS.DEALS_DELETE,
    'tasks': PERMISSIONS.TASKS_DELETE,
    'activities': PERMISSIONS.ACTIVITIES_DELETE,
    'users': PERMISSIONS.USERS_DELETE,
  };
  
  const permission = deletePermissions[resource];
  return permission ? hasPermission(userRole, permission) : false;
};

/**
 * Get user-friendly role display name
 * @param {string} role - The role code
 * @returns {string} - Human readable role name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.MANAGER]: 'Property Manager', 
    [ROLES.AGENT]: 'Property Agent',
  };
  
  return roleNames[role] || role;
};

/**
 * Check if user can edit a specific record
 * @param {string} userRole - The user's role
 * @param {string} resource - The resource type
 * @param {Object} record - The record object
 * @param {string} currentUserId - The current user's ID
 * @returns {boolean} - Whether user can edit this record
 */
export const canEditRecord = (userRole, resource, record, currentUserId) => {
  // Admins and managers can edit anything they can view
  if ([ROLES.ADMIN, ROLES.MANAGER].includes(userRole)) {
    return hasPermission(userRole, `${resource}.edit`);
  }
  
  // Agents can only edit their own records
  if (userRole === ROLES.AGENT) {
    // Check if record belongs to the current user
    const recordOwnerId = record?.userId || record?.createdBy || record?.assignedTo;
    const canEdit = hasPermission(userRole, `${resource}.edit`);
    return canEdit && (!recordOwnerId || recordOwnerId === currentUserId);
  }
  
  return false;
};

export default {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canViewAllRecords,
  canDelete,
  getRoleDisplayName,
  canEditRecord,
};