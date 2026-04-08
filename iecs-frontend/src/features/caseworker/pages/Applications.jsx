import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../../components/common/UIComponents';
import { 
  Search, 
  Filter, 
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApplications } from '../../../context/ApplicationContext';

const Applications = () => {
  const { applications } = useApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const styles = {
      'PENDING': 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400',
      'APPROVED': 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400',
      'REJECTED': 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Benefits Applications</h1>
          <p className="text-secondary-600 dark:text-secondary-400">Review and process eligibility for all incoming requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 animate-pulse">
            <AlertCircle size={20} />
          </div>
          <p className="text-sm font-semibold text-secondary-900 dark:text-white">
            {applications.filter(a => a.status === 'PENDING').length} Priority cases waiting
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-secondary-900 text-white border-none shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary-800 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-600 text-white"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              className="bg-secondary-800 border border-secondary-700 text-white rounded-lg text-xs font-bold px-3 py-2 outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Status: All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <Button variant="primary" className="gap-2">
              <Filter size={16} />
              Refine Results
            </Button>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary-50 dark:bg-secondary-800/50 text-secondary-500 dark:text-secondary-400 text-[11px] uppercase font-bold tracking-[0.1em]">
              <tr>
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Applicant Detail</th>
                <th className="px-6 py-4">Financial View</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30 transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-secondary-400 font-mono">
                    #{app.id}
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-bold text-secondary-900 dark:text-white">{app.applicant}</p>
                      <p className="text-[11px] font-semibold text-primary-600 uppercase tracking-wider mt-0.5">{app.plan}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">${app.income.toLocaleString()}/mo</p>
                      <p className="text-[11px] text-secondary-500">{app.household} Member Household</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-5 text-sm text-secondary-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {app.date || 'Today'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/caseworker/eligibility/${app.id}`)}
                      className="gap-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-600 hover:text-primary-600"
                    >
                      <Eye size={16} />
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-secondary-500 font-bold uppercase tracking-widest text-[10px]">
                    No applications match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Applications;
