import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAgentsApi, addAgentApi, updateAgentApi, deleteAgentApi } from '../api/services.js';
import toast from 'react-hot-toast';

const AgentsPage = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });
  const [editingAgentId, setEditingAgentId] = useState(null);
  const [errors, setErrors] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgentsApi
  });

  const agents = data?.data?.agents || [];

  const addAgentMutation = useMutation({
    mutationFn: addAgentApi,
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Agent added successfully!');
        setFormData({ name: '', email: '', mobile: '', password: '' });
        setErrors({});
        queryClient.invalidateQueries({ queryKey: ['agents'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
      } else {
        toast.error(res.message || 'Failed to add agent');
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error occurred while creating agent';
      toast.error(msg);
    }
  });

  const updateAgentMutation = useMutation({
    mutationFn: ({ id, agentData }) => updateAgentApi({ id, agentData }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Agent updated successfully!');
        setFormData({ name: '', email: '', mobile: '', password: '' });
        setEditingAgentId(null);
        setErrors({});
        queryClient.invalidateQueries({ queryKey: ['agents'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        queryClient.invalidateQueries({ queryKey: ['grouped-tasks'] });
      } else {
        toast.error(res.message || 'Failed to update agent');
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error occurred while updating agent';
      toast.error(msg);
    }
  });

  const deleteAgentMutation = useMutation({
    mutationFn: (id) => deleteAgentApi(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Agent deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['agents'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        queryClient.invalidateQueries({ queryKey: ['grouped-tasks'] });
      } else {
        toast.error(res.message || 'Failed to delete agent');
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Error occurred while deleting agent';
      toast.error(msg);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEdit = (agent) => {
    setEditingAgentId(agent._id);
    setFormData({
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      password: ''
    });
    setErrors({});
  };

  const handleCancel = () => {
    setEditingAgentId(null);
    setFormData({ name: '', email: '', mobile: '', password: '' });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!formData.mobile.startsWith('+')) {
      newErrors.mobile = 'Mobile number must start with country code (e.g. +91 or +1)';
    } else if (!/^\+\d{7,15}$/.test(formData.mobile.replace(/\s+/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number with country code (e.g., +919876543210)';
    }

    if (!editingAgentId && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (editingAgentId) {
        updateAgentMutation.mutate({
          id: editingAgentId,
          agentData: formData
        });
      } else {
        addAgentMutation.mutate(formData);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-oat-100 p-6 rounded-2xl border border-oat-400 h-fit shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {editingAgentId ? 'Edit Agent Details' : 'Add New Agent'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 bg-oat-300 text-slate-805 ${
                errors.name
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 bg-oat-300 text-slate-805 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="mobile">
              Mobile Number (with country code)
            </label>
            <input
              id="mobile"
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+919876543210"
              className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 bg-oat-300 text-slate-805 ${
                errors.mobile
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {errors.mobile && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="password">
              Password {editingAgentId && <span className="text-slate-500 font-normal">(leave blank to keep current)</span>}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-1 bg-oat-300 text-slate-805 ${
                errors.password
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {errors.password && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.password}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            {editingAgentId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-2 border border-oat-400 text-slate-800 font-bold rounded-lg text-sm bg-oat-200 hover:bg-oat-300 transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={addAgentMutation.isPending || updateAgentMutation.isPending}
              className="flex-1 py-2 bg-oat-500 hover:bg-oat-400 text-slate-850 hover:text-slate-800 font-bold rounded-lg text-sm border border-oat-400 transition-all disabled:opacity-50"
            >
              {editingAgentId ? 'Update Agent' : 'Add Agent'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-oat-100 p-6 rounded-2xl border border-oat-400 lg:col-span-2 flex flex-col shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Active Agents</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oat-500"></div>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm font-semibold">
            No agents registered yet. Use the form on the left to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-oat-400 text-left text-sm">
              <thead className="bg-oat-200 text-slate-700 uppercase text-xs font-bold border-b border-oat-400">
                <tr>
                  <th className="px-6 py-3 rounded-l-lg">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Mobile</th>
                  <th className="px-6 py-3 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oat-400 text-slate-800 bg-oat-100">
                {agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-oat-200 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{agent.name}</td>
                    <td className="px-6 py-4">{agent.email}</td>
                    <td className="px-6 py-4">{agent.mobile}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(agent)}
                        className="text-xs font-bold text-slate-800 bg-oat-300 hover:bg-oat-400 px-2.5 py-1 rounded-lg border border-oat-400 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this agent? This will also delete all of their assigned tasks.')) {
                            deleteAgentMutation.mutate(agent._id);
                          }
                        }}
                        className="text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-lg border border-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsPage;
