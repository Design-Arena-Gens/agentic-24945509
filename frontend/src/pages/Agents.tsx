import { useState } from 'react';
import { motion } from 'framer-motion';
import { AGENT_TOOLS } from '@ai-playground/shared';

export default function Agents() {
  const [selectedTool, setSelectedTool] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!selectedTool || !input) return;

    setLoading(true);
    setOutput('');

    try {
      // Simulate agent execution
      setOutput(`Agent "${selectedTool}" would process: "${input}"\n\nThis requires your API key configuration.`);
    } catch (error) {
      setOutput('Error executing agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2">AI Agents</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Specialized tools for research, math, and automation
        </p>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-4 mb-6">
        {AGENT_TOOLS.map((tool, index) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedTool(tool.id)}
            className={`card p-4 text-center cursor-pointer transition-all ${
              selectedTool === tool.id
                ? 'ring-2 ring-primary-500 shadow-lg'
                : 'hover:shadow-md'
            }`}
          >
            <div className="text-3xl mb-2">{tool.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{tool.description}</p>
          </motion.button>
        ))}
      </div>

      {selectedTool && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Input</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Enter your request..."
            />
            <button
              onClick={handleExecute}
              disabled={!input || loading}
              className="mt-4 w-full btn-primary"
            >
              {loading ? 'Executing...' : 'Execute Agent'}
            </button>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Output</h3>
            <div className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="spinner"></div>
                </div>
              ) : output ? (
                <pre className="whitespace-pre-wrap text-sm">{output}</pre>
              ) : (
                <p className="text-gray-500">Agent output will appear here</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
