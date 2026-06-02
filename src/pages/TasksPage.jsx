import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasksGroupedApi, completeTaskApi, deleteTaskApi } from '../api/services.js';
import { FiUser, FiChevronDown, FiChevronUp, FiPhone, FiBookOpen, FiCheck, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TasksPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['grouped-tasks'],
    queryFn: getTasksGroupedApi
  });

  const [expandedAgentId, setExpandedAgentId] = useState(null);

  const grouped = data?.data?.grouped || [];

  const completeMutation = useMutation({
    mutationFn: (id) => completeTaskApi(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Task marked as completed');
        queryClient.invalidateQueries({ queryKey: ['grouped-tasks'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
      } else {
        toast.error(res.message || 'Failed to complete task');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error completing task');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTaskApi(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Task deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['grouped-tasks'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
      } else {
        toast.error(res.message || 'Failed to delete task');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error deleting task');
    }
  });

  const toggleExpand = (id) => {
    if (expandedAgentId === id) {
      setExpandedAgentId(null);
    } else {
      setExpandedAgentId(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oat-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 font-semibold text-sm">
        Failed to load tasks. Please try reloading the page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Agent Task View</h2>
          <p className="text-xs text-slate-650 mt-0.5 font-medium">View all distributed leads grouped by their assigned agents.</p>
        </div>
        <div className="bg-oat-100 px-3 py-1.5 rounded-lg border border-oat-400 text-xs font-bold text-slate-700 shadow-sm">
          Total Agents: {grouped.length}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="bg-oat-100 p-12 text-center rounded-2xl border border-oat-400 text-slate-500 font-bold text-sm">
          No agents found. Add agents and upload tasks to see assignments.
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => {
            const isExpanded = expandedAgentId === group._id;
            const taskCount = group.tasks.length;

            return (
              <div key={group._id} className="bg-oat-100 rounded-2xl border border-oat-400 overflow-hidden shadow-sm transition-all hover:shadow-md">
                <button
                  onClick={() => toggleExpand(group._id)}
                  className="w-full flex items-center justify-between p-5 bg-oat-100 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-oat-200 text-slate-800 border border-oat-400 flex items-center justify-center font-bold">
                      <FiUser className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black text-sm">{group.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {group.email} • {group.mobile}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      taskCount > 0
                        ? 'bg-oat-500 text-slate-850 border-oat-400'
                        : 'bg-oat-200 text-slate-500 border-oat-400'
                    }`}>
                      {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                    </span>
                    {isExpanded ? (
                      <FiChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-oat-400 bg-oat-300/40 p-4 lg:p-6">
                    {taskCount === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-xs font-bold">
                        No tasks assigned to this agent.
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-oat-400 bg-oat-100">
                        <table className="min-w-full divide-y divide-oat-400 text-left text-xs">
                          <thead className="bg-oat-200 text-slate-700 uppercase font-bold border-b border-oat-400">
                            <tr>
                              <th className="px-4 lg:px-6 py-3">First Name</th>
                              <th className="px-4 lg:px-6 py-3">Phone</th>
                              <th className="px-4 lg:px-6 py-3">Notes</th>
                              <th className="px-4 lg:px-6 py-3">Status</th>
                              <th className="px-4 lg:px-6 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-oat-400 text-slate-800">
                            {group.tasks.map((task, index) => (
                              <tr key={task._id || index} className="hover:bg-oat-200 transition-colors">
                                <td className="px-4 lg:px-6 py-3.5 font-bold text-slate-900">{task.firstName}</td>
                                <td className="px-4 lg:px-6 py-3.5 text-slate-700">
                                  <span className="inline-flex items-center gap-1.5">
                                    <FiPhone className="w-3.5 h-3.5 text-slate-500" />
                                    {task.phone}
                                  </span>
                                </td>
                                <td className="px-4 lg:px-6 py-3.5 text-slate-650 max-w-xs lg:max-w-md truncate">
                                  <span className="inline-flex items-start gap-1.5">
                                    <FiBookOpen className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                                    <span>{task.notes || <em className="text-slate-400">None</em>}</span>
                                  </span>
                                </td>
                                <td className="px-4 lg:px-6 py-3.5">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                                    task.status === 'Completed'
                                      ? 'bg-oat-500 text-slate-850 border-oat-400'
                                      : 'bg-oat-200 text-slate-600 border-oat-400'
                                  }`}>
                                    {task.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="px-4 lg:px-6 py-3.5 text-right space-x-2 whitespace-nowrap">
                                  {task.status !== 'Completed' && (
                                    <button
                                      onClick={() => completeMutation.mutate(task._id)}
                                      disabled={completeMutation.isPending}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-oat-500 hover:bg-oat-400 border border-oat-400 text-slate-850 hover:text-slate-800 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      <FiCheck className="w-3.5 h-3.5" /> Complete
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this task?')) {
                                        deleteMutation.mutate(task._id);
                                      }
                                    }}
                                    disabled={deleteMutation.isPending}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-red-100 hover:bg-red-200 border border-red-300 text-red-700 rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TasksPage;
