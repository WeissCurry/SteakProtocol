import React from 'react';
import { useWallet, Wallet } from '@solana/wallet-adapter-react';
import { X } from 'lucide-react';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({ isOpen, onClose }) => {
  const { wallets, select } = useWallet();

  if (!isOpen) return null;

  const handleSelect = (walletName: string) => {
    // @ts-expect-error - branded type
    select(walletName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border-4 border-black w-full max-w-md rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-300 relative">
        {/* Header */}
        <div className="bg-black p-6 flex items-center justify-between text-white">
          <h3 className="font-black uppercase italic tracking-tighter text-xl">
            Connect Wallet 🚀
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-4">
          <p className="text-[10px] font-black uppercase text-grass-subtext tracking-widest mb-6 bg-grass-primary/10 p-3 border-2 border-black border-dashed rounded-2xl text-center">
            Select your Solana wallet to continue investing in Steak Protocol. 🐐🌿
          </p>

          <div className="grid grid-cols-1 gap-4">
            {wallets.map((wallet: Wallet) => (
              <button
                key={wallet.adapter.name}
                onClick={() => handleSelect(wallet.adapter.name)}
                className="flex items-center justify-between p-5 bg-white border-4 border-black rounded-3xl hover:bg-grass-primary hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black border-2 border-black rounded-xl p-1 shadow-[2px_2px_0px_0px_rgba(181,255,0,1)]">
                    <img
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-black uppercase tracking-tight text-lg">
                    {wallet.adapter.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                    {wallet.readyState === 'Installed' ? 'Installed' : 'Detected'}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-black group-hover:animate-ping" />
                </div>
              </button>
            ))}
          </div>

          <div className="pt-6 text-center">
            <p className="text-[9px] font-black uppercase text-grass-subtext italic">
              New to Solana?{' '}
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noreferrer"
                className="text-black underline hover:text-grass-primary transition-colors"
              >
                Download Phantom
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
