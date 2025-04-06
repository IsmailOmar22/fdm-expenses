import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ClaimDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await axios.get(`/api/claims/${id}`);
        setClaim(response.data);
      } catch (err) {
        setError('Failed to load claim details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Claim</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Claim Not Found</h2>
          <p className="text-gray-600 mb-4">The requested claim could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Expense Claim #{claim.id}</h1>
          <p className="mt-2 text-gray-600">
            Submitted on {new Date(claim.submission_date).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Claim Details</h2>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                <p className="mt-1 text-sm text-gray-900">{claim.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expense Type</h3>
                <p className="mt-1 text-sm text-gray-900">{claim.type_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Expense</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(claim.expense_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="mt-1 text-sm text-gray-900">
                  ${parseFloat(claim.amount).toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                    claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {claim.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1) : 'Pending'}
                  </span>
                </p>
              </div>
              {claim.receipt_path && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Receipt</h3>
                  <a 
                    href={claim.receipt_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {claim.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;