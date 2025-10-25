import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  const quickLinks = [
    {
      title: 'Start Chatting',
      description: 'Have conversations with AI models',
      icon: '💬',
      path: '/chat',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Code Assistant',
      description: 'Generate and debug code with AI',
      icon: '💻',
      path: '/code',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'AI Agents',
      description: 'Use specialized AI tools',
      icon: '🤖',
      path: '/agents',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Manage API Keys',
      description: 'Add or update your API keys',
      icon: '🔑',
      path: '/keys',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          What would you like to do today?
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={link.path}>
              <div className="card p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center text-2xl mb-4`}>
                  {link.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{link.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {link.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Add your API keys in the Key Manager</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Choose a model from OpenAI, Anthropic, or Google</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Start chatting, coding, or using AI agents</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Your conversations are saved automatically</span>
            </li>
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Multi-model support</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Persistent memory & context</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Code generation & debugging</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>Specialized AI agents</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              <span>100% free forever</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
