import { useAuth } from '../contexts/AuthContext';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  canViewAllRecords,
  canDelete,
  getRoleDisplayName,
  canEditRecord,
  PERMISSIONS,
  ROLES
} from '../utils/permissions';

/**
 * Hook for role-based permissions in React components
 * @returns {Object} Permission functions and user role info
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role;
  const userId = user?.id;

  return {
    // User info
    userRole,
    userId,
    roleDisplayName: getRoleDisplayName(userRole),
    
    // Permission check functions
    hasPermission: (permission) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(userRole, permissions),
    
    // Resource-specific helpers
    canViewAllRecords: (resource) => canViewAllRecords(userRole, resource),
    canDelete: (resource) => canDelete(userRole, resource),
    canEditRecord: (resource, record) => canEditRecord(userRole, resource, record, userId),
    
    // Role checks
    isAdmin: () => userRole === ROLES.ADMIN,
    isManager: () => userRole === ROLES.MANAGER,
    isAgent: () => userRole === ROLES.AGENT,
    isManagerOrAbove: () => [ROLES.ADMIN, ROLES.MANAGER].includes(userRole),
    
    // Common permission groups for UI
    ui: {
      // Companies
      canViewCompanies: hasPermission(userRole, PERMISSIONS.COMPANIES_VIEW),
      canCreateCompanies: hasPermission(userRole, PERMISSIONS.COMPANIES_CREATE),
      canEditCompanies: hasPermission(userRole, PERMISSIONS.COMPANIES_EDIT),
      canDeleteCompanies: hasPermission(userRole, PERMISSIONS.COMPANIES_DELETE),
      
      // Contacts
      canViewContacts: hasPermission(userRole, PERMISSIONS.CONTACTS_VIEW),
      canCreateContacts: hasPermission(userRole, PERMISSIONS.CONTACTS_CREATE),
      canEditContacts: hasPermission(userRole, PERMISSIONS.CONTACTS_EDIT),
      canDeleteContacts: hasPermission(userRole, PERMISSIONS.CONTACTS_DELETE),
      canViewAllContacts: hasPermission(userRole, PERMISSIONS.CONTACTS_VIEW_ALL),
      
      // Deals
      canViewDeals: hasPermission(userRole, PERMISSIONS.DEALS_VIEW),
      canCreateDeals: hasPermission(userRole, PERMISSIONS.DEALS_CREATE),
      canEditDeals: hasPermission(userRole, PERMISSIONS.DEALS_EDIT),
      canDeleteDeals: hasPermission(userRole, PERMISSIONS.DEALS_DELETE),
      canViewAllDeals: hasPermission(userRole, PERMISSIONS.DEALS_VIEW_ALL),
      
      // Tasks
      canViewTasks: hasPermission(userRole, PERMISSIONS.TASKS_VIEW),
      canCreateTasks: hasPermission(userRole, PERMISSIONS.TASKS_CREATE),
      canEditTasks: hasPermission(userRole, PERMISSIONS.TASKS_EDIT),
      canDeleteTasks: hasPermission(userRole, PERMISSIONS.TASKS_DELETE),
      canAssignTasks: hasPermission(userRole, PERMISSIONS.TASKS_ASSIGN),
      
      // Activities
      canViewActivities: hasPermission(userRole, PERMISSIONS.ACTIVITIES_VIEW),
      canCreateActivities: hasPermission(userRole, PERMISSIONS.ACTIVITIES_CREATE),
      canEditActivities: hasPermission(userRole, PERMISSIONS.ACTIVITIES_EDIT),
      canDeleteActivities: hasPermission(userRole, PERMISSIONS.ACTIVITIES_DELETE),
      canViewAllActivities: hasPermission(userRole, PERMISSIONS.ACTIVITIES_VIEW_ALL),
      
      // Users
      canViewUsers: hasPermission(userRole, PERMISSIONS.USERS_VIEW),
      canCreateUsers: hasPermission(userRole, PERMISSIONS.USERS_CREATE),
      canEditUsers: hasPermission(userRole, PERMISSIONS.USERS_EDIT),
      canDeleteUsers: hasPermission(userRole, PERMISSIONS.USERS_DELETE),
      
      // Dashboard
      canViewAnalytics: hasPermission(userRole, PERMISSIONS.DASHBOARD_VIEW_ANALYTICS),
      canViewReports: hasPermission(userRole, PERMISSIONS.DASHBOARD_VIEW_REPORTS),
    }
  };
};

export default usePermissions;