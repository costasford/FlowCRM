import React, { useState, useEffect } from 'react';
import { contactsAPI } from '../utils/api';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionGate, PermissionButton } from '../components/common/PermissionGate';
import { PERMISSIONS } from '../utils/permissions';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalContacts, setTotalContacts] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const { ui: permissions, canEditRecord, canViewAllRecords, userId } = usePermissions();

  useEffect(() => {
    fetchContacts();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1);
        fetchContacts(searchTerm, 1);
      } else {
        fetchContacts('', 1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchContacts(searchTerm, newPage);
  };

  const fetchContacts = async (search = searchTerm, page = currentPage) => {
    try {
      const params = {
        page,
        limit: itemsPerPage,
        search: search.trim(),
        ...(canViewAllRecords('contacts') ? {} : { userId })
      };
      
      const response = await contactsAPI.getAll(params);
      setContacts(response.contacts || []);
      setTotalContacts(response.total || 0);
      setCurrentPage(response.page || 1);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      if (showEditModal && selectedContact) {
        await contactsAPI.update(selectedContact.id, formData);
        setShowEditModal(false);
      } else {
        await contactsAPI.create(formData);
        setShowAddModal(false);
      }
      setFormData({ name: '', email: '', phone: '', company: '' });
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      console.error('Failed to save contact:', error);
      setSubmitError(error.userMessage || 'Failed to save contact. Please check your input and try again.');
    }
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company?.name || ''
    });
    setSubmitError('');
    setShowEditModal(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    
    try {
      await contactsAPI.delete(contactId);
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact. Please try again.');
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalContacts / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalContacts);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your property contacts, leads, and clients
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
          <PermissionButton
            permission={PERMISSIONS.CONTACTS_CREATE}
            className="btn-primary w-full sm:w-auto"
            onClick={() => {
              setSubmitError('');
              setFormData({ name: '', email: '', phone: '', company: '' });
              setShowAddModal(true);
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Contact
          </PermissionButton>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          className="pl-10 w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results info */}
      {!loading && (
        <div className="text-sm text-gray-700">
          Showing {contacts.length === 0 ? 0 : startItem} to {endItem} of {totalContacts} contacts
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}

      {/* Contacts List */}
      <div className="card">
        {contacts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
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
        ) : (
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
                          onClick={() => handleViewContact(contact)}
                        >
                          View
                        </button>
                        {canEditRecord('contacts', contact) && (
                          <button 
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                            onClick={() => handleEditContact(contact)}
                            title="Edit Contact"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                        <PermissionGate permission={PERMISSIONS.CONTACTS_DELETE}>
                          {canEditRecord('contacts', contact) && (
                            <button 
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                              onClick={() => handleDeleteContact(contact.id)}
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
                        onClick={() => handleViewContact(contact)}
                      >
                        View
                      </button>
                      {canEditRecord('contacts', contact) && (
                        <button 
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                          onClick={() => handleEditContact(contact)}
                        >
                          Edit
                        </button>
                      )}
                      <PermissionGate permission={PERMISSIONS.CONTACTS_DELETE}>
                        {canEditRecord('contacts', contact) && (
                          <button 
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                            onClick={() => handleDeleteContact(contact.id)}
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
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalContacts}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pageNum === currentPage
                          ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Contact</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name *</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email *</label>
                      <input
                        type="email"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {showEditModal ? 'Update Contact' : 'Add Contact'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedContact(null);
                      setSubmitError('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowViewModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Contact Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.email}</p>
                  </div>
                  
                  {selectedContact.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedContact.phone}</p>
                    </div>
                  )}
                  
                  {selectedContact.company && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedContact.company.name}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(selectedContact.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                {canEditRecord('contacts', selectedContact) && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditContact(selectedContact);
                    }}
                  >
                    Edit
                  </button>
                )}
                <PermissionGate permission={PERMISSIONS.CONTACTS_DELETE}>
                  {canEditRecord('contacts', selectedContact) && (
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setShowViewModal(false);
                        handleDeleteContact(selectedContact.id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </PermissionGate>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;