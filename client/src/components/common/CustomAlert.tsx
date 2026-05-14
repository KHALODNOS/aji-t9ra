import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const CustomAlert: React.FC<AlertProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'bg-[#f2f8f7] border-[#5DA296]/20 text-[#3d6b64]',
    error: 'bg-[#FFF5F5] border-[#E53E3E]/20 text-[#C53030]',
    info: 'bg-[#f2f8f7] border-[#5DA296]/20 text-[#5DA296]',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#5DA296]" />,
    error: <AlertCircle className="w-5 h-5 text-[#E53E3E]" />,
    info: <Info className="w-5 h-5 text-[#5DA296]" />,
  };

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] min-w-[320px] max-w-[90%] p-4 rounded-xl border shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${styles[type]}`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-grow font-medium text-sm">
        {message}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-black/5 p-1 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </div>
  );
};

export default CustomAlert;
