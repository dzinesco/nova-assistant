import React from 'react';
import { FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '../contexts/ServicesContext';
import { testService } from '../utils/serviceTests';

interface ServiceConfigProps {
  service: Service;
  onClose: () => void;
  onUpdate: (updates: Partial<Service>) => void;
}

const MotionButton = motion.button;

export default function ServiceConfig({ service, onClose, onUpdate }: ServiceConfigProps) {
  const [isTesting, setIsTesting] = React.useState(false);
  const [testError, setTestError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: service.name || '',
    credentials: service.credentials || {},
  });

  const handleTest = async () => {
    setIsTesting(true);
    setTestError(null);
    try {
      await testService(service.type, service.provider, formData.credentials);
      onUpdate({ ...formData, status: 'connected' });
    } catch (error) {
      setTestError(error instanceof Error ? error.message : 'Failed to test connection');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  const isValid = formData.name.trim() !== '' && 
    Object.values(formData.credentials).every(val => val && val.trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="
          w-full max-w-lg bg-gradient-to-br from-sys-background via-sys-background to-sys-fill/30
          rounded-xl shadow-2xl border border-sys-separator overflow-hidden
        "
      >
        {/* Header */}
        <div className="p-6 border-b border-sys-separator flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Configure {service.provider}</h2>
            <p className="text-sm text-sys-label/50">Set up your connection details</p>
          </div>
          <MotionButton
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-sys-fill/50 text-sys-label/70 hover:text-sys-label"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="w-5 h-5" />
          </MotionButton>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Service Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="
                w-full px-4 py-2 rounded-lg
                bg-sys-fill/50 border border-sys-separator
                focus:border-sys-label/30 focus:ring-1 focus:ring-sys-label/30
                text-sys-label placeholder:text-sys-label/50
                transition-all duration-200
              "
              placeholder="Enter a name for this service"
            />
          </div>

          {/* Credentials */}
          <div className="space-y-4">
            <div className="text-sm font-medium">Credentials</div>
            {Object.entries(formData.credentials).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label htmlFor={key} className="block text-sm capitalize text-sys-label/70">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="password"
                  id={key}
                  value={value}
                  onChange={(e) => 
                    setFormData({
                      ...formData,
                      credentials: { ...formData.credentials, [key]: e.target.value }
                    })
                  }
                  className="
                    w-full px-4 py-2 rounded-lg
                    bg-sys-fill/50 border border-sys-separator
                    focus:border-sys-label/30 focus:ring-1 focus:ring-sys-label/30
                    text-sys-label placeholder:text-sys-label/50
                    transition-all duration-200
                  "
                  placeholder={`Enter your ${key.replace(/_/g, ' ').toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          {/* Test Results */}
          <AnimatePresence>
            {testError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500"
              >
                {testError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-sys-separator bg-sys-fill/30 flex justify-between items-center">
          <MotionButton
            onClick={handleTest}
            disabled={!isValid || isTesting}
            className={`
              px-4 py-2 rounded-lg flex items-center space-x-2
              ${isValid && !isTesting
                ? 'bg-sys-fill/50 hover:bg-sys-fill text-sys-label'
                : 'bg-sys-fill/30 text-sys-label/50 cursor-not-allowed'
              }
              transition-all duration-200
            `}
            whileHover={isValid && !isTesting ? { scale: 1.02 } : {}}
            whileTap={isValid && !isTesting ? { scale: 0.98 } : {}}
          >
            {isTesting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                <span>Test Connection</span>
              </>
            )}
          </MotionButton>

          <div className="flex items-center space-x-3">
            <MotionButton
              onClick={onClose}
              className="
                px-4 py-2 rounded-lg
                hover:bg-sys-fill/50 text-sys-label/70 hover:text-sys-label
                transition-all duration-200
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </MotionButton>
            <MotionButton
              onClick={handleSave}
              disabled={!isValid}
              className={`
                px-4 py-2 rounded-lg
                ${isValid
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-500/50 text-white/50 cursor-not-allowed'
                }
                transition-all duration-200
              `}
              whileHover={isValid ? { scale: 1.02 } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
            >
              Save Changes
            </MotionButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
