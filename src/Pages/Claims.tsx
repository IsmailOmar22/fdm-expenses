import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Claims = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      title: '',
      expense_type: '',
      expense_date: '',
      description: '',
      email: '',
      amount: '0.00',
      receipt: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleFileChange = (e) => {
      setFormData(prev => ({ ...prev, receipt: e.target.files[0] }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');
  
      try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('expense_type', formData.expense_type);
        data.append('expense_date', formData.expense_date);
        data.append('description', formData.description);
        data.append('email', formData.email);
        data.append('amount', formData.amount);
        if (formData.receipt) {
          data.append('receipt', formData.receipt);
        }
  
        // Updated API endpoint with explicit URL
        const response = await axios.post(
          'http://localhost:5000/api/claims', 
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            // Add timeout to prevent hanging
            timeout: 10000 
          }
        );
  
        navigate(`/claim/${response.data.claimId}`);
      } catch (err) {
        // Enhanced error handling
        if (err.response) {
          // Server responded with error status
          setError(err.response.data.error || 
            `Server error: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          // Request was made but no response
          setError('No response from server. Please check:'
            + '\n1. Is the backend server running?'
            + '\n2. Are you using the correct port (5000)?'
            + '\n3. Is there a CORS issue?');
        } else {
          // Other errors
          setError(`Submission failed: ${err.message}`);
        }
        console.error('Submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-10'>
          <h1 className='text-3xl font-bold text-gray-900'>Make a Claim</h1>
          <p className='mt-2 text-gray-600'>Fill out the form below to submit your expense claim</p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white shadow-lg rounded-xl overflow-hidden'>
          {/* Form Header */}
          <div className='bg-indigo-700 px-6 py-4'>
            <h2 className='text-xl font-semibold text-white'>Expense Details</h2>
          </div>
          
          {/* Form Body */}
          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Title Field */}
              <div>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>
                  Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='title'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition'
                  placeholder='Brief description of expense'
                  required
                />
              </div>
              
              {/* Email Field */}
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                  Confirm Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition'
                  placeholder='johndoe@example.com'
                  required
                />
              </div>
              
              {/* Type Field */}
              <div>
                <label htmlFor='expense_type' className='block text-sm font-medium text-gray-700 mb-1'>
                  Expense Type <span className='text-red-500'>*</span>
                </label>
                <select
                  id='expense_type'
                  name='expense_type'
                  value={formData.expense_type}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition'
                  required
                >
                  <option value="">Select an expense type</option>
                  <option value="1">Travel</option>
                  <option value="2">Food</option>
                  <option value="3">Accommodation</option>
                  <option value="4">Other</option>
                </select>
              </div>
              
              {/* Amount Field */}
              <div>
                <label htmlFor='amount' className='block text-sm font-medium text-gray-700 mb-1'>
                  Amount <span className='text-red-500'>*</span>
                </label>
                <div className='relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <span className='text-gray-500 sm:text-sm'>$</span>
                  </div>
                  <input
                    type='number'
                    id='amount'
                    name='amount'
                    value={formData.amount}
                    onChange={handleChange}
                    className='w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition'
                    placeholder='0.00'
                    step='0.01'
                    min='0'
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Date Field */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor='expense_date' className='block text-sm font-medium text-gray-700 mb-1'>
                  Date of Expense <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  id='expense_date'
                  name='expense_date'
                  value={formData.expense_date}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition'
                  required
                />
              </div>
              
              {/* Receipt Upload */}
              <div>
                <label htmlFor='receipt' className='block text-sm font-medium text-gray-700 mb-1'>
                  Receipt <span className='text-red-500'>*</span>
                </label>
                <div className='flex items-center justify-center w-full'>
                  <label className='flex flex-col w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition'>
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                      </svg>
                      <p className='text-sm text-gray-500'>
                        <span className='font-semibold text-indigo-600'>Click to upload</span> or drag and drop
                      </p>
                      <p className='text-xs text-gray-500'>PNG, JPG, PDF up to 5MB</p>
                    </div>
                    <input 
                      id='receipt' 
                      name='receipt'
                      type='file' 
                      className='hidden' 
                      accept='.png,.jpg,.jpeg,.pdf' 
                      onChange={handleFileChange}
                      required 
                    />
                  </label>
                </div>
                {formData.receipt && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {formData.receipt.name}
                  </p>
                )}
              </div>
            </div>
            
            {/* Description Field */}
            <div>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <textarea
                id='description'
                name='description'
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition'
                placeholder='Additional details about this expense'
              ></textarea>
            </div>
          </div>
          
          {/* Form Footer */}
          <div className='bg-gray-50 px-6 py-4 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Claims;