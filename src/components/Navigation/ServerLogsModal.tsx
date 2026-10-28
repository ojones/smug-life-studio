import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Terminal, CheckCircle2, AlertTriangle, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { playSoftClick } from '../../utils/audio';

interface ServerLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerLogsModal: React.FC<ServerLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatusAndLogs = async () => {
    setLoading(true);
    try {
      const [statusRes, logsRes] = await Promise.all([
        fetch('/api/shopify/status').catch(() => null),
        fetch('/api/shopify/logs').catch(() => null)
      ]);

      if (statusRes && statusRes.ok) {
        const sData = await statusRes.json();
        setStatus(sData);
      }
      if (logsRes && logsRes.ok) {
        const lData = await logsRes.json();
        setLogs(lData.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatusAndLogs();
      const interval = setInterval(fetchStatusAndLogs, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLogs = () => {
    playSoftClick();
    navigator.clipboard.writeText(JSON.stringify({ status, logs }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-3xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-900 text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-zinc-950 text-base">Backend & Integration Live Inspector</h3>
              <p className="text-xs text-zinc-500">Gemini 2.5 Flash • Shopify Checkout • Printify Webhooks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatusAndLogs}
              disabled={loading}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleCopyLogs}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={() => {
                playSoftClick();
                onClose();
              }}
              className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Status summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-500 font-semibold">Gemini AI API</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-extrabold text-zinc-950">Active & Ready</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">gemini-2.5-flash</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-500 font-semibold">Shopify Storefront</span>
                {status?.shopifyConfigured ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-sm font-extrabold text-zinc-950">
                {status?.shopifyConfigured ? 'Connected' : 'Fallback / Simulation Ready'}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {status?.storeDomain || 'Standard Seamless Flow'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-500 font-semibold">11oz Mug Price</span>
                <span className="text-xs font-bold text-amber-600">$9.50</span>
              </div>
              <p className="text-sm font-extrabold text-zinc-950">Ceramic Sublimation</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">8.25" × 3.85" Flat 2D Wrap</p>
            </div>
          </div>

          {/* Webhook Endpoint Info */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Shopify Order Webhook Receiver
              </span>
              <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200 text-amber-900">
                POST /api/shopify/webhook/orders-create
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              When an order is created on Shopify, this endpoint receives the payload and automatically initiates Printify fulfillment dispatch.
            </p>
          </div>

          {/* Logs Terminal */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Recent Server Events</h4>
            <div className="bg-zinc-950 text-zinc-300 font-mono text-xs p-4 rounded-2xl border border-zinc-800 space-y-2 max-h-60 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-zinc-500 italic">No events logged yet. Trigger an AI art generation or checkout to view live logs.</div>
              ) : (
                logs.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 border-b border-zinc-900/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-zinc-500 text-[10px] shrink-0">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                      item.type === 'error' ? 'bg-rose-950 text-rose-300' :
                      item.type === 'shopify' ? 'bg-emerald-950 text-emerald-300' :
                      item.type === 'ai' ? 'bg-amber-950 text-amber-300' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {item.type || 'info'}
                    </span>
                    <span className="break-all">{item.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            onClick={() => {
              playSoftClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
