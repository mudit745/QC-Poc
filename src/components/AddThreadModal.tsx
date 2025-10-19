import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface AddThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
  ruleDescription?: string;
}

const AddThreadModal: React.FC<AddThreadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ruleDescription
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setIsSubmitting(false);
      // Focus the input when modal opens
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setIsSubmitting(true);
      onConfirm(title.trim());
      // Reset form after a brief delay
      setTimeout(() => {
        setTitle('');
        setIsSubmitting(false);
        onClose();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all"
              onKeyDown={handleKeyDown}
            >
              {/* Header */}
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Add New Thread
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Create a new discussion thread
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-4">
                  {ruleDescription && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Related Rule:</span> {ruleDescription}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="thread-title-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thread Title
                    </label>
                    <input
                      ref={inputRef}
                      id="thread-title-input"
                      type="text"
                      value={title}
                      onChange={handleInputChange}
                      placeholder="Enter a descriptive title for this thread..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
                      required
                      maxLength={100}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {title.length}/100 characters
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() || isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create Thread</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddThreadModal;
