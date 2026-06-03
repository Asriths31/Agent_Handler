import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/services.js';
import { setToken, setUsername } from '../utils/auth.js';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: ({ email, password }) => loginApi(email, password),
    onSuccess: (data) => {
      if (data.success && data.data?.token) {
        setToken(data.data.token);
        if (data.data.user?.username) {
          setUsername(data.data.user.username);
        }
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Invalid credentials or server error';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-oat-300 px-4">
      <div className="max-w-md w-full bg-oat-100 rounded-2xl shadow-md border border-oat-400 p-8 space-y-6">
        <div className="text-center">
        
          <h2 className="text-2xl font-bold text-slate-800">Admin Login</h2>
          <p className="text-slate-600 text-sm mt-1">Enter your credentials to access the admin portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">
              Email Address <span className="text-red-500">*</span>
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
                  : 'border-oat-400 focus:ring-oat-500 focus:border-oat-500'
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-4 pr-10 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-1 bg-oat-300 text-slate-800 ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-oat-400 focus:ring-oat-500 focus:border-oat-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2.5 rounded-lg bg-oat-500 hover:bg-oat-400 text-slate-850 hover:text-slate-800 font-bold text-sm transition-all disabled:opacity-50 flex justify-center items-center border border-oat-400"
          >
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600 pt-2 border-t border-oat-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-700 font-bold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
