import React from 'react';
import { FiPlus, FiMail, FiCalendar, FiCpu, FiHardDrive, FiList, FiArrowLeft } from 'react-icons/fi';
import { ServiceType } from '../contexts/ServicesContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AddServiceCardProps {
  onAdd: (type: ServiceType, provider: string) => void;
}

const serviceTypes: Array<{ 
  type: ServiceType; 
  label: string; 
  icon: React.ElementType; 
  description: string;
  providers: Array<{ id: string; name: string; description: string }>;
}> = [
  { 
    type: 'email',
    label: 'Email',
    icon: FiMail,
    description: 'Connect email accounts from Gmail, Outlook, or custom SMTP',
    providers: [
      { id: 'gmail', name: 'Gmail', description: 'Connect with Google Gmail' },
      { id: 'outlook', name: 'Outlook', description: 'Connect with Microsoft Outlook' },
      { id: 'smtp', name: 'Custom SMTP', description: 'Connect any email service via SMTP' },
    ]
  },
  { 
    type: 'calendar',
    label: 'Calendar',
    icon: FiCalendar,
    description: 'Integrate with Google Calendar or Outlook Calendar',
    providers: [
      { id: 'google_calendar', name: 'Google Calendar', description: 'Connect with Google Calendar' },
      { id: 'outlook', name: 'Outlook Calendar', description: 'Connect with Microsoft Outlook Calendar' },
    ]
  },
  { 
    type: 'ai',
    label: 'AI',
    icon: FiCpu,
    description: 'Connect to AI providers like OpenAI, Anthropic, or Ollama',
    providers: [
      { id: 'openai', name: 'OpenAI', description: 'Use GPT-4, GPT-3.5, and other OpenAI models' },
      { id: 'anthropic', name: 'Anthropic', description: 'Use Claude and other Anthropic models' },
      { id: 'grok', name: 'Grok', description: 'Use X\'s Grok AI model' },
      { id: 'ollama', name: 'Ollama', description: 'Run open-source models locally' },
    ]
  },
  { 
    type: 'storage',
    label: 'Storage',
    icon: FiHardDrive,
    description: 'Link cloud storage from Dropbox or Google Drive',
    providers: [
      { id: 'dropbox', name: 'Dropbox', description: 'Connect with Dropbox cloud storage' },
      { id: 'gdrive', name: 'Google Drive', description: 'Connect with Google Drive' },
    ]
  },
  { 
    type: 'task',
    label: 'Tasks',
    icon: FiList,
    description: 'Integrate with task management tools like Notion',
    providers: [
      { id: 'notion', name: 'Notion', description: 'Connect with Notion workspaces' },
    ]
  },
];

const MotionButton = motion.button;

export default function AddServiceCard({ onAdd }: AddServiceCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<ServiceType | null>(null);

  const handleReset = () => {
    setSelectedType(null);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <MotionButton
        onClick={() => setIsExpanded(true)}
        className="
          h-full min-h-[120px] p-4 rounded-xl border-2 border-dashed border-sys-separator
          flex flex-col items-center justify-center text-sys-label/70
          hover:bg-sys-fill/50 hover:border-sys-label/30 hover:text-sys-label
          transition-all duration-200 relative overflow-hidden
          hover:shadow-lg hover:scale-[1.02]
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sys-fill/30 to-transparent" />
        <FiPlus className="w-8 h-8 mb-3" />
        <span className="text-base font-medium">Add Service</span>
        <span className="text-sm text-sys-label/50 mt-1">Connect a new service to Nova</span>
      </MotionButton>
    );
  }

  const selectedService = selectedType ? serviceTypes.find(s => s.type === selectedType) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="
        p-6 rounded-xl border border-sys-separator
        bg-gradient-to-br from-sys-background via-sys-background to-sys-fill/30
        shadow-xl backdrop-blur-sm
      "
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <AnimatePresence mode="wait">
            {selectedType && (
              <MotionButton
                key="back-button"
                onClick={() => setSelectedType(null)}
                className="p-2 rounded-lg hover:bg-sys-fill/50 text-sys-label/70 hover:text-sys-label"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiArrowLeft className="w-5 h-5" />
              </MotionButton>
            )}
          </AnimatePresence>
          <div>
            <h3 className="text-lg font-semibold">
              {selectedType ? `Select ${selectedService?.label} Provider` : 'Add Service'}
            </h3>
            <p className="text-sm text-sys-label/50">
              {selectedType ? 'Choose your preferred provider' : 'Select a service type to begin'}
            </p>
          </div>
        </div>
        <MotionButton
          onClick={handleReset}
          className="p-2 rounded-lg hover:bg-sys-fill/50 text-sys-label/70 hover:text-sys-label"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiPlus className="w-5 h-5 transform rotate-45" />
        </MotionButton>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType || 'service-types'}
          initial={{ opacity: 0, x: selectedType ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: selectedType ? -100 : 100 }}
          className="grid gap-3"
        >
          {!selectedType ? (
            // Show service types
            serviceTypes.map(({ type, label, icon: Icon, description }, index) => (
              <MotionButton
                key={type}
                onClick={() => setSelectedType(type)}
                className="
                  p-4 rounded-xl border border-sys-separator
                  bg-gradient-to-br from-sys-background to-sys-fill/30
                  flex items-start space-x-4 w-full text-left
                  hover:border-sys-label/30 hover:shadow-lg
                  transition-all duration-200 group relative
                "
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="
                  p-3 rounded-xl bg-sys-fill/50 text-sys-label/70
                  group-hover:text-sys-label group-hover:bg-sys-fill/70
                  transition-all duration-200
                ">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-lg">{label}</div>
                  <div className="text-sm text-sys-label/70">{description}</div>
                </div>
              </MotionButton>
            ))
          ) : (
            // Show providers for selected service type
            selectedService?.providers.map((provider, index) => (
              <MotionButton
                key={provider.id}
                onClick={() => {
                  onAdd(selectedType, provider.id);
                  handleReset();
                }}
                className="
                  p-4 rounded-xl border border-sys-separator
                  bg-gradient-to-br from-sys-background to-sys-fill/30
                  flex items-start space-x-4 w-full text-left
                  hover:border-sys-label/30 hover:shadow-lg
                  transition-all duration-200 relative
                "
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1">
                  <div className="font-medium text-lg">{provider.name}</div>
                  <div className="text-sm text-sys-label/70">{provider.description}</div>
                </div>
              </MotionButton>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
