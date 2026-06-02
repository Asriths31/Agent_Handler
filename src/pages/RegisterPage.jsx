import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/services.js';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: ({ email, password }) => registerApi(email, password),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Registration failed or server error';
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

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate({
        email: formData.email,
        password: formData.password
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-oat-300 px-4">
      <div className="max-w-md w-full bg-oat-100 rounded-2xl shadow-md border border-oat-400 p-8 space-y-6">
        <div className="text-center">

          <h2 className="text-2xl font-bold text-slate-800">Admin Registration</h2>
          <p className="text-slate-600 text-sm mt-1">Register a new admin user</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-1 bg-oat-300 text-slate-800 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-1 bg-oat-300 text-slate-800 ${
                errors.password
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {errors.password && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-1 bg-oat-300 text-slate-800 ${
                errors.confirmPassword
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2.5 rounded-lg bg-oat-500 hover:bg-oat-400 text-slate-850 hover:text-slate-800 font-bold text-sm transition-all disabled:opacity-50 flex justify-center items-center border border-oat-400"
          >
            {mutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-700 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
