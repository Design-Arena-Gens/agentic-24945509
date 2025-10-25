import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-20"
        >
          <h1 className="text-3xl font-bold text-white">AI Playground</h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-white hover:text-primary-200 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-white text-primary-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-white mb-6"
          >
            Bring Your API Key,
            <br />
            <span className="text-primary-300">Unlock AI Magic</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 mb-12"
          >
            100% Free, Open-Source AI Platform. Connect your OpenAI, Anthropic, or Google API keys
            and start building with AI—no subscriptions, no hidden costs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center space-x-4"
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-xl"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white/10 text-white text-lg font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          id="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-32 grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: '🔐',
              title: 'Your Keys, Your Control',
              description: 'Bring your own API keys. We never see or store them in plaintext.',
            },
            {
              icon: '💬',
              title: 'Multi-Model Chat',
              description: 'Chat with GPT-4, Claude, Gemini, and more from one interface.',
            },
            {
              icon: '💻',
              title: 'Code Assistant',
              description: 'Generate, explain, and debug code with AI-powered assistance.',
            },
            {
              icon: '🤖',
              title: 'Agentic Tools',
              description: 'Research, math solving, task automation, and more built-in agents.',
            },
            {
              icon: '🧠',
              title: 'Persistent Memory',
              description: 'AI remembers context across conversations for personalized responses.',
            },
            {
              icon: '📝',
              title: 'Chat History',
              description: 'Save, search, and export all your conversations.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-32 text-center"
        >
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to unlock AI power?
          </h3>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-primary-900 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
          >
            Create Free Account
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
