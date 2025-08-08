import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * Component to conditionally render content based on user permissions
 * @param {Object} props
 * @param {string|string[]} props.permission - Permission(s) required to show content
 * @param {boolean} props.requireAll - If true, user must have ALL permissions (default: false - requires ANY)
 * @param {React.ReactNode} props.children - Content to show if user has permission
 * @param {React.ReactNode} props.fallback - Content to show if user lacks permission
 * @returns {React.ReactNode}
 */
export const PermissionGate = ({ 
  permission, 
  requireAll = false, 
  children, 
  fallback = null 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (typeof permission === 'string') {
    // Single permission
    hasAccess = hasPermission(permission);
  } else if (Array.isArray(permission)) {
    // Multiple permissions
    hasAccess = requireAll 
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  }

  return hasAccess ? children : fallback;
};

/**
 * Component to conditionally render content based on user role
 * @param {Object} props
 * @param {string|string[]} props.roles - Role(s) required to show content
 * @param {React.ReactNode} props.children - Content to show if user has role
 * @param {React.ReactNode} props.fallback - Content to show if user lacks role
 * @returns {React.ReactNode}
 */
export const RoleGate = ({ roles, children, fallback = null }) => {
  const { userRole } = usePermissions();

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasRole = allowedRoles.includes(userRole);

  return hasRole ? children : fallback;
};

/**
 * Higher-order component that wraps a component with permission checking
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} permissionConfig - Permission configuration
 * @returns {React.Component}
 */
export const withPermission = (WrappedComponent, permissionConfig) => {
  const { permission, requireAll = false, fallback = null } = permissionConfig;

  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGate
        permission={permission}
        requireAll={requireAll}
        fallback={fallback}
      >
        <WrappedComponent {...props} />
      </PermissionGate>
    );
  };
};

/**
 * Component to show different content based on user role level
 * @param {Object} props
 * @param {React.ReactNode} props.admin - Content for admin users
 * @param {React.ReactNode} props.manager - Content for manager users
 * @param {React.ReactNode} props.agent - Content for agent users
 * @param {React.ReactNode} props.fallback - Content for unknown roles
 * @returns {React.ReactNode}
 */
export const RoleSwitcher = ({ admin, manager, agent, fallback = null }) => {
  const { userRole } = usePermissions();

  switch (userRole) {
    case 'admin':
      return admin || fallback;
    case 'manager':
      return manager || fallback;
    case 'agent':
      return agent || fallback;
    default:
      return fallback;
  }
};

/**
 * Component to show action buttons based on permissions
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string|string[]} props.permission - Required permission(s)
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - CSS classes
 * @param {Object} props.buttonProps - Additional button props
 * @returns {React.ReactNode}
 */
export const PermissionButton = ({ 
  children, 
  permission, 
  onClick, 
  className = '', 
  ...buttonProps 
}) => {
  return (
    <PermissionGate permission={permission}>
      <button
        onClick={onClick}
        className={className}
        {...buttonProps}
      >
        {children}
      </button>
    </PermissionGate>
  );
};

export default PermissionGate;