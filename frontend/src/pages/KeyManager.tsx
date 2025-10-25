import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { AI_PROVIDERS, AIProvider } from '@ai-playground/shared';
import { encryptAPIKey, generateEncryptionPassword, setEncryptionPassword, getEncryptionPassword } from '../utils/encryption';

export default function KeyManager() {
  const [keys, setKeys] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadKeys();
    // Initialize encryption password if not set
    if (!getEncryptionPassword()) {
      setEncryptionPassword(generateEncryptionPassword());
    }
  }, []);

  const loadKeys = async () => {
    try {
      const response = await api.get('/keys');
      setKeys(response.data);
    } catch (error) {
      console.error('Failed to load keys:', error);
    }
  };

  const handleValidate = async () => {
    if (!apiKey) return;

    setValidating(true);
    setMessage('');

    try {
      const response = await api.post('/keys/validate', { provider, apiKey });
      if (response.data.isValid) {
        setMessage(`✓ Valid API key! Found ${response.data.models.length} models.`);
      } else {
        setMessage(`✗ Invalid API key: ${response.data.error}`);
      }
    } catch (error) {
      setMessage('✗ Validation failed');
    } finally {
      setValidating(false);
    }
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const encPassword = getEncryptionPassword()!;
      const encryptedKey = await encryptAPIKey(apiKey, encPassword);

      await api.post('/keys', {
        provider,
        encryptedKey,
      });

      setMessage('✓ API key added successfully!');
      setApiKey('');
      setShowAddForm(false);
      loadKeys();
    } catch (error) {
      setMessage('✗ Failed to add API key');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (provider: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    try {
      await api.delete(`/keys/${provider}`);
      loadKeys();
    } catch (error) {
      console.error('Failed to delete key:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">API Key Manager</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Securely manage your AI provider API keys
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            {showAddForm ? 'Cancel' : '+ Add Key'}
          </button>
        </div>
      </motion.div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">Add New API Key</h3>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('✓')
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAddKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as AIProvider)}
                className="input"
              >
                {Object.entries(AI_PROVIDERS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input"
                placeholder="sk-..."
                required
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleValidate}
                disabled={!apiKey || validating}
                className="btn-secondary flex-1"
              >
                {validating ? 'Validating...' : 'Validate Key'}
              </button>
              <button
                type="submit"
                disabled={!apiKey || loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Adding...' : 'Add Key'}
              </button>
            </div>
          </form>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              🔒 Your API keys are encrypted client-side before being stored. We never see your plaintext keys.
            </p>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {keys.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No API keys added yet</p>
            <p className="text-sm">Add your first API key to start using AI features</p>
          </div>
        ) : (
          keys.map((key, index) => (
            <motion.div
              key={key.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {AI_PROVIDERS[key.provider as AIProvider]?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {key.models.length} models available
                  </p>
                  <p className="text-xs text-gray-500">
                    Added {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    key.isValid
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {key.isValid ? 'Valid' : 'Invalid'}
                  </span>
                  <button
                    onClick={() => handleDeleteKey(key.provider)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
