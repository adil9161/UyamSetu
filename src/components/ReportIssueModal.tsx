import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scheme } from '../data/schemes';
import { X, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

interface ReportIssueModalProps {
  scheme: Scheme;
  onClose: () => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ scheme, onClose }) => {
  const { submitIssueReport, language } = useApp();
  const [issueType, setIssueType] = useState<'outdated_info' | 'incorrect_eligibility' | 'broken_link' | 'wrong_amount' | 'translation_error'>('outdated_info');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitIssueReport({
      schemeId: scheme.id,
      schemeName: scheme.name,
      issueType,
      description: description.trim()
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A]">
            <AlertTriangle className="w-4 h-4 text-[#F97316]" />
            <span>{language === 'hi' ? 'डेटा संशोधन / त्रुटि रिपोर्ट' : 'Report Scheme Data Issue'}</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">
              {language === 'hi' ? 'धन्यवाद! आपकी रिपोर्ट दर्ज कर ली गई है' : 'Report Received by Review Queue'}
            </h3>
            <p className="text-xs text-[#475569]">
              {language === 'hi'
                ? 'हमारी मानव समीक्षा टीम 48 घंटे के भीतर आधिकारिक पोर्टल से क्रॉस-चेक करेगी।'
                : 'Our human review team reviews all community flags within 48 hours according to our Data Governance Policy.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-[#0F172A]">
                {language === 'hi' ? 'योजना:' : 'Scheme:'} <span className="font-normal text-[#475569]">{scheme.name}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                {language === 'hi' ? 'समस्या का प्रकार *' : 'Type of Issue *'}
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
              >
                <option value="outdated_info">Outdated Information / Changed Guideline</option>
                <option value="incorrect_eligibility">Incorrect Eligibility Criteria</option>
                <option value="broken_link">Broken Official Source Link</option>
                <option value="wrong_amount">Wrong Subsidy or Loan Ceiling Amount</option>
                <option value="translation_error">Hindi / Regional Translation Error</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1.5">
                {language === 'hi' ? 'विवरण (आधिकारिक संदर्भ सहित) *' : 'Description & Official Source Reference *'}
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'hi' ? 'कृपया बताएं कि क्या गलत है और यदि संभव हो तो आधिकारिक परिपत्र का संदर्भ दें...' : 'Please specify what is incorrect and reference the official circular or notification link if available...'}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A5F] hover:bg-[#162D4A] rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'समीक्षा हेतु भेजें' : 'Submit for Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
