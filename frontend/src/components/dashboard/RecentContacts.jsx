import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon } from '@heroicons/react/24/outline';

const RecentContacts = ({ contacts }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Recent Contacts</h2>
        <Link
          to="/contacts"
          className="text-sm text-blue-600 hover:text-blue-900"
        >
          View all
        </Link>
      </div>
      
      {contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <UsersIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm">No recent contacts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="h-8 w-8 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {contact.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.email}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {contact.company?.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentContacts;