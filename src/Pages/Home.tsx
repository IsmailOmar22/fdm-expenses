import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon 
} from "@heroicons/react/24/outline";

interface Claim {
  id: number;
  title: string;
  amount: number;
  status: string;
  expense_date: string;
  type_name: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/api/claims");
        console.log("API Response:", response.data); // Debug log
        
        // Check if the response is wrapped in a data property
        const claimsData = Array.isArray(response.data) ? response.data : 
                         (response.data.data && Array.isArray(response.data.data)) ? 
                         response.data.data : null;
        
        if (!claimsData) {
          throw new Error("Invalid data format received");
        }
  
        const formattedClaims = claimsData.map(claim => ({
          id: claim.id,
          title: claim.title || "Untitled Claim",
          expense_type: claim.expense_type,
          amount: Number(claim.amount) || 0,
          status: claim.status || "pending",
          expense_date: claim.expense_date,
          submission_date: claim.submission_date,
          description: claim.description,
          email: claim.email,
          receipt_path: claim.receipt_path,
          type_name: claim.type_name || "Other"
        }));
  
        setClaims(formattedClaims);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || 
                 err.message || 
                 "Failed to load claims. Please try again.");
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);

  const stats = [
    { name: "Total Claims", value: claims.length.toString(), icon: "total" },
    { 
      name: "Approved", 
      value: claims.filter(c => c.status === "approved").length.toString(),
      icon: "approved" 
    },
    { 
      name: "Pending", 
      value: claims.filter(c => c.status === "pending").length.toString(),
      icon: "pending" 
    },
    { 
      name: "Rejected", 
      value: claims.filter(c => c.status === "rejected").length.toString(),
      icon: "rejected" 
    },
  ];

  const statusStyles = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    {stat.icon === "total" && (
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    )}
                    {stat.icon === "approved" && <CheckCircleIcon className="h-6 w-6 text-white" />}
                    {stat.icon === "pending" && <ClockIcon className="h-6 w-6 text-white" />}
                    {stat.icon === "rejected" && <ExclamationCircleIcon className="h-6 w-6 text-white" />}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Claims Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Claims</h3>
            <p className="mt-1 text-sm text-gray-500">A list of your most recent expense claims.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claims.map((claim) => (
                  <tr key={claim.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {claim.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {claim.type_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${claim.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(claim.expense_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusStyles[claim.status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
                      }`}>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {claims.length === 0 && !loading && (
              <div className="text-center py-12">
                <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No claims found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {error ? error : "Get started by submitting a new claim."}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/claims')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit New Claim
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;