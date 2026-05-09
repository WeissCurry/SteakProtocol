import React from 'react';
import { X, Download, CheckCircle2, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  stakeInfo: any;
  maturityDate: string;
  certificateId: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  stakeInfo,
  maturityDate,
  certificateId,
}) => {
  if (!isOpen || !stakeInfo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border-4 border-black w-full max-w-4xl rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-black p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-grass-primary rounded-xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <span className="text-black text-xl">🥩</span>
            </div>
            <h3 className="font-black uppercase italic tracking-tighter text-2xl">
              Investment Certificate Generated!
            </h3>
          </div>
          <button onClick={onClose} className="hover:scale-110 transition-transform">
            <X size={28} />
          </button>
        </div>

        <div className="p-8 md:p-12 bg-grass-bg flex flex-col md:flex-row gap-12 items-stretch">
          <div className="w-full md:w-80 bg-white border-4 border-black p-4 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-6 relative group">
            <div className="absolute -top-4 -right-4 bg-grass-primary border-2 border-black p-2 rounded-xl rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </div>
            <div className="p-4 bg-zinc-50 border-2 border-black rounded-2xl">
              <QRCodeSVG value={`https://steak-protocol.io/verify/${certificateId}`} size={160} />
            </div>
            <p className="text-[10px] font-black uppercase text-grass-subtext tracking-[0.2em]">
              Scan to Verify On-Chain
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-8">
              <div className="border-b-4 border-black border-dotted pb-6">
                <p className="text-xs font-black uppercase text-grass-subtext mb-1 opacity-60">
                  Certificate ID
                </p>
                <h4 className="text-xl font-mono font-black break-all uppercase">{certificateId}</h4>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase text-grass-subtext mb-1">
                    Amount Invested
                  </p>
                  <p className="text-2xl font-black italic">
                    {stakeInfo.amount.toLocaleString('id-ID')} IDRX
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-grass-subtext mb-1">
                    Est. Yield (APY)
                  </p>
                  <p className="text-2xl font-black italic text-emerald-500">{stakeInfo.apy}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-grass-subtext mb-1">
                    Maturity Date
                  </p>
                  <p className="text-2xl font-black italic">{maturityDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-grass-subtext mb-1">Status</p>
                  <span className="bg-grass-primary border-2 border-black px-3 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    SECURED
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <button className="flex-1 py-4 bg-black text-white font-black uppercase text-xs tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(181,255,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                <Download size={18} /> Download NFT
              </button>
              {stakeInfo.txSig && (
                <a
                  href={`https://explorer.solana.com/tx/${stakeInfo.txSig}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-white text-black font-black uppercase text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
