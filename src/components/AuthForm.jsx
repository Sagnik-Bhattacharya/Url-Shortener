'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function AuthForm({ type }) {
  const router = useRouter();
  const isRegister = type === 'register';

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    try {
      const endpoint = type === 'login' ? '/api/users/login' : '/api/users/register';
      const res = await axios.post(endpoint, formData);

      toast.success(
        type === 'login' ? 'Logged in successfully!' : 'Registered successfully!'
      );

      if (type === 'login') {
        setTimeout(() => {
          router.push('/dashboard'); // ✅ redirect after login
        }, 1000);
      } else {
        setFormData({ name: '', username: '', email: '', password: '' });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isRegister && (
          <>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="unique_handle"
                required
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="bg-slate-800 border-slate-700"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="bg-slate-800 border-slate-700"
          />
        </div>

        <Button type="submit" className="w-full">
          {type === 'login' ? 'Login' : 'Register'}
        </Button>

        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white underline underline-offset-4"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.form>
    </>
  );
}
