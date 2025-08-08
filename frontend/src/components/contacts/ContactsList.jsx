import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PermissionGate } from '../common/PermissionGate';
import { PERMISSIONS } from '../../utils/permissions';
import { usePermissions } from '../../hooks/usePermissions';

const ContactsList = ({ 
  contacts, 
  searchTerm, 
  onViewContact, 
  onEditContact, 
  onDeleteContact 
}) => {
  const { canEditRecord } = usePermissions();

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {searchTerm ? 'No contacts found' : 'No contacts'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm 
            ? `No contacts match "${searchTerm}". Try a different search term.`
            : 'Get started by creating a new contact.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {contacts.map((contact) => (
          <li key={contact.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {contact.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {contact.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {contact.email}
                  </div>
                  <div className="mt-1 sm:hidden text-xs text-gray-500 space-y-1">
                    {contact.company && (
                      <div>Company: {contact.company.name}</div>
                    )}
                    {contact.phone && (
                      <div>Phone: {contact.phone}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Desktop layout */}
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                {contact.company && (
                  <div className="text-sm text-gray-500">
                    {contact.company.name}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  {contact.phone}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    onClick={() => onViewContact(contact)}
                  >
                    View
                  </button>
                  {canEditRecord('contacts', contact) && (
                    <button 
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                      onClick={() => onEditContact(contact)}
                      title="Edit Contact"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
                  <PermissionGate permission={PERMISSIONS.CONTACTS_DELETE}>
                    {canEditRecord('contacts', contact) && (
                      <button 
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                        onClick={() => onDeleteContact(contact.id)}
                        title="Delete Contact"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </PermissionGate>
                </div>
              </div>
              
              {/* Mobile actions */}
              <div className="mt-3 flex justify-end space-x-3 sm:hidden">
                <button 
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  onClick={() => onViewContact(contact)}
                >
                  View
                </button>
                {canEditRecord('contacts', contact) && (
                  <button 
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                    onClick={() => onEditContact(contact)}
                  >
                    Edit
                  </button>
                )}
                <PermissionGate permission={PERMISSIONS.CONTACTS_DELETE}>
                  {canEditRecord('contacts', contact) && (
                    <button 
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                      onClick={() => onDeleteContact(contact.id)}
                    >
                      Delete
                    </button>
                  )}
                </PermissionGate>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsList;