import React from 'react';
import { X, ShieldAlert, CheckCircle2, Copy } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'error' | 'success';
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
}) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    // Optional: add a small "Copied" toast logic here if needed
  };

  const isError = type === 'error';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border-4 border-black w-full max-w-xl rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div
          className={`${isError ? 'bg-red-500' : 'bg-black'} p-6 flex items-center justify-between text-white`}
        >
          <div className="flex items-center gap-3">
            {isError ? (
              <ShieldAlert size={24} />
            ) : (
              <CheckCircle2 className="text-grass-primary" size={24} />
            )}
            <h3 className="font-black uppercase italic tracking-tighter text-xl">{title}</h3>
          </div>
          <button onClick={onClose} className="hover:scale-110 transition-transform">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-grass-subtext font-black uppercase text-[10px] mb-4 tracking-widest">
            {isError ? 'Details (Copyable):' : 'Status Message:'}
          </p>

          <div className="bg-zinc-100 border-2 border-black p-6 rounded-2xl mb-8 relative group">
            <code className="text-xs font-mono break-all text-black block max-h-[200px] overflow-auto pr-8">
              {message}
            </code>
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 bg-white border-2 border-black rounded-lg hover:bg-grass-primary transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
          </div>

          <button
            onClick={onClose}
            className={`w-full py-5 ${isError ? 'bg-black text-white' : 'bg-grass-primary text-black'} font-black uppercase text-xs border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
          >
            {isError ? 'Got it, Close' : 'Great, Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
