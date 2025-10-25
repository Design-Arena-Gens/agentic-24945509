import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CodeEditor() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    setLoading(true);
    setOutput('');

    try {
      // Simulate AI code assistance
      setOutput(`AI assistance for "${action}" on ${language} code would be processed here with your API key.`);
    } catch (error) {
      setOutput('Error processing request');
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
        <h2 className="text-2xl font-bold mb-2">Code Assistant</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Generate, explain, and debug code with AI
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Code Input</h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="// Enter your code here..."
          />

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handleAction('explain')}
              disabled={!code || loading}
              className="btn-secondary flex-1"
            >
              Explain
            </button>
            <button
              onClick={() => handleAction('debug')}
              disabled={!code || loading}
              className="btn-secondary flex-1"
            >
              Debug
            </button>
            <button
              onClick={() => handleAction('optimize')}
              disabled={!code || loading}
              className="btn-secondary flex-1"
            >
              Optimize
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">AI Output</h3>
          <div className="w-full h-96 p-4 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="spinner"></div>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-gray-500">AI output will appear here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
