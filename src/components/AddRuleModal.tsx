import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (description: string, severity: string) => void;
  moduleName: string;
}

const AddRuleModal: React.FC<AddRuleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  moduleName
}) => {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'Critical' | 'Major' | 'Significant'>('Critical');

  const handleConfirm = () => {
    if (description.trim()) {
      onConfirm(description.trim(), severity);
      setDescription('');
      setSeverity('Critical');
      onClose();
    }
  };

  const handleCancel = () => {
    setDescription('');
    setSeverity('Critical');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity backdrop-blur-sm"></div>

          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                  Add New Rule
                </h3>
                <button
                  type="button"
                  className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={handleCancel}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="module-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Module
                  </label>
                  <input
                    type="text"
                    id="module-name"
                    value={moduleName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100 bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="rule-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rule Description *
                  </label>
                  <textarea
                    id="rule-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter rule description..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="rule-severity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Issue Severity *
                  </label>
                  <select
                    id="rule-severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as 'Critical' | 'Major' | 'Significant')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Significant">Significant</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirm}
                  disabled={!description.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddRuleModal;







