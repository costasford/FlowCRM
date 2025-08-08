import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { dealsAPI, contactsAPI, companiesAPI } from '../../utils/api';

const NewDealModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'lead',
    status: 'open',
    value: '',
    probability: '50',
    priority: 'medium',
    closeDate: '',
    contactId: '',
    companyId: '',
  });
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
      fetchCompanies();
    }
  }, [isOpen]);

  const fetchContacts = async () => {
    try {
      const response = await contactsAPI.getAll({ limit: 100 });
      setContacts(response.contacts || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companiesAPI.getAll({ limit: 100 });
      setCompanies(response.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const dealData = {
        ...formData,
        value: formData.value ? parseFloat(formData.value) : null,
        probability: parseInt(formData.probability),
        closeDate: formData.closeDate || null,
        contactId: formData.contactId || null,
        companyId: formData.companyId || null,
      };

      await dealsAPI.create(dealData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create deal:', error);
      
      // Handle field-level validation errors
      if (error.response?.data?.validationErrors) {
        setFieldErrors(error.response.data.validationErrors);
        setError('Please correct the errors below.');
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Handle array of field errors
        const fieldErrorMap = {};
        error.response.data.errors.forEach(err => {
          if (err.field) {
            fieldErrorMap[err.field] = err.message;
          }
        });
        if (Object.keys(fieldErrorMap).length > 0) {
          setFieldErrors(fieldErrorMap);
          setError('Please correct the errors below.');
        } else {
          setError(error.userMessage || error.response?.data?.error || 'Failed to create deal. Please try again.');
        }
      } else {
        setError(error.userMessage || error.response?.data?.error || 'Failed to create deal. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Create New Deal
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="font-medium">Error</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          )}

          {/* Deal Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`input-field ${
                fieldErrors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="e.g., Downtown Office Lease Renewal"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`input-field ${
                fieldErrors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Deal details, property info, special terms..."
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
            )}
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deal Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Value ($)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`input-field ${
                  fieldErrors.value ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="50000"
              />
              {fieldErrors.value && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.value}</p>
              )}
            </div>

            {/* Probability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Win Probability (%)
              </label>
              <input
                type="number"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                min="0"
                max="100"
                className={`input-field ${
                  fieldErrors.probability ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
              {fieldErrors.probability && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.probability}</p>
              )}
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className={`input-field ${
                  fieldErrors.stage ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              >
                <option value="lead">New Lead</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal Sent</option>
                <option value="negotiation">Negotiating</option>
                <option value="closed_won">Won</option>
                <option value="closed_lost">Lost</option>
              </select>
              {fieldErrors.stage && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.stage}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`input-field ${
                  fieldErrors.priority ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {fieldErrors.priority && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.priority}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Contact
              </label>
              <select
                name="contactId"
                value={formData.contactId}
                onChange={handleChange}
                className={`input-field ${
                  fieldErrors.contactId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              >
                <option value="">Select a contact...</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} - {contact.email}
                  </option>
                ))}
              </select>
              {fieldErrors.contactId && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.contactId}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property/Company
              </label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className={`input-field ${
                  fieldErrors.companyId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              >
                <option value="">Select a property...</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name} - {company.location}
                  </option>
                ))}
              </select>
              {fieldErrors.companyId && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.companyId}</p>
              )}
            </div>
          </div>

          {/* Close Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Close Date
            </label>
            <input
              type="date"
              name="closeDate"
              value={formData.closeDate}
              onChange={handleChange}
              className={`input-field ${
                fieldErrors.closeDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {fieldErrors.closeDate && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.closeDate}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDealModal;