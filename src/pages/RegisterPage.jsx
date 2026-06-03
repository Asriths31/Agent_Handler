import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerApi, checkUsernameApi } from '../api/services.js';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ checked: false, available: true, checking: false });
  const debounceTimeoutRef = useRef(null);

  const mutation = useMutation({
    mutationFn: ({ username, email, password }) => registerApi(username, email, password),
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

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const checkAvailability = async (username) => {
    const trimmed = username.trim();
    if (trimmed.length < 3) {
      setUsernameStatus({ checked: false, available: true, checking: false });
      return;
    }
    try {
      const res = await checkUsernameApi(trimmed);
      setUsernameStatus({ checked: true, available: res.data?.available, checking: false });
    } catch (e) {
      setUsernameStatus({ checked: false, available: true, checking: false });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === 'username') {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const trimmed = value.trim();
      if (trimmed.length < 3) {
        setUsernameStatus({ checked: false, available: true, checking: false });
      } else {
        setUsernameStatus({ checked: false, available: true, checking: true });
        debounceTimeoutRef.current = setTimeout(() => {
          checkAvailability(value);
        }, 500);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (usernameStatus.checked && !usernameStatus.available) {
      newErrors.username = 'Username is already taken';
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!usernameStatus.checked) {
      setUsernameStatus(prev => ({ ...prev, checking: true }));
      try {
        const res = await checkUsernameApi(formData.username.trim());
        if (!res.data?.available) {
          setUsernameStatus({ checked: true, available: false, checking: false });
          setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
          return;
        }
        setUsernameStatus({ checked: true, available: true, checking: false });
      } catch (err) {
        // Fallback
      }
    }

    mutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
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
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="username">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-1 bg-oat-300 text-slate-800 ${
                errors.username
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {usernameStatus.checking && <p className="text-slate-500 text-xs mt-1">Checking availability...</p>}
            {!usernameStatus.checking && usernameStatus.checked && usernameStatus.available && (
              <p className="text-green-600 text-xs mt-1 font-semibold">✓ Username available</p>
            )}
            {!usernameStatus.checking && usernameStatus.checked && !usernameStatus.available && (
              <p className="text-red-600 text-xs mt-1 font-semibold">✗ Username already taken</p>
            )}
            {errors.username && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.username}</p>}
          </div>

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
                  : 'border-oat-400 focus:ring-oat-500'
              }`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center justify-between" htmlFor="password">
              <span>Password <span className="text-red-500">*</span></span>
              <span className="text-xs text-slate-500 font-normal">(Min 6 characters)</span>
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
                    : 'border-oat-400 focus:ring-oat-500'
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-4 pr-10 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-1 bg-oat-300 text-slate-800 ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-oat-400 focus:ring-oat-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
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
