'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import AuthForm from './AuthForm';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 px-4 text-white">
      <motion.div
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md border border-gray-800 shadow-xl bg-white/5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to URL Shortener
        </motion.h1>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 rounded-full bg-slate-800 p-1">
            <TabsTrigger value="login" className="rounded-full">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-full">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <AuthForm type="login" />
          </TabsContent>

          <TabsContent value="register">
            <AuthForm type="register" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
