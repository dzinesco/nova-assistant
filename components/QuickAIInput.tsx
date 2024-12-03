import React, { useState } from 'react';
import { RiSendPlaneFill, RiMicFill, RiLoader4Line } from 'react-icons/ri';

interface QuickAIInputProps {
  onSubmit: (message: string) => Promise<void>;
  placeholder?: string;
}

const QuickAIInput: React.FC<QuickAIInputProps> = ({
  onSubmit,
  placeholder = "Ask me anything..."
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onSubmit(message);
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-sys-fill 
                    rounded-ios-lg border border-sys-separator
                    transition-all duration-300
                    focus-within:border-[var(--neon-blue)]
                    focus-within:card-glow-blue">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-transparent text-sys-label
                     placeholder-sys-label-tertiary
                     focus:outline-none
                     rounded-ios-lg"
          />
          
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2 mx-1 rounded-full
                     transition-all duration-300
                     ${isListening 
                       ? 'text-[var(--neon-pink)] card-glow-pink' 
                       : 'text-sys-label-secondary hover:text-[var(--neon-blue)]'}`}
          >
            <RiMicFill className="w-5 h-5" />
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`p-2 mx-2 rounded-full
                     transition-all duration-300
                     ${message.trim() && !isLoading
                       ? 'text-[var(--neon-blue)] hover:text-[var(--neon-purple)]'
                       : 'text-sys-label-tertiary'}`}
          >
            {isLoading ? (
              <RiLoader4Line className="w-5 h-5 animate-spin" />
            ) : (
              <RiSendPlaneFill className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickAIInput;
