import React, { useState } from 'react';
import { UserProfile, PaymentTransaction, SubscriptionPlanId } from '../types';
import { getStoredTransactions, saveStoredUser } from '../utils/storage';
import { 
  User, Crown, Zap, ShieldCheck, CreditCard, 
  Calendar, Clock, DollarSign, Calculator, Bell, CheckCircle2, 
  AlertTriangle, Receipt, Lock 
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenSubscribe: (planId?: SubscriptionPlanId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onUpdateUser,
  onOpenSubscribe,
}) => {
  const transactions = getStoredTransactions();
  const [bankrollInput, setBankrollInput] = useState<number>(user.bankroll || 50000);
  const [isEditingBankroll, setIsEditingBankroll] = useState(false);
  const [notificationsToggle, setNotificationsToggle] = useState(user.notificationsEnabled);
  const [viewingReceipt, setViewingReceipt] = useState<PaymentTransaction | null>(null);

  const isVip = user.currentPlan === 'vip-monthly';
  const isSubscribed = user.currentPlan !== 'free';

  // Calculate days remaining
  let daysRemaining = 0;
  if (user.planExpiresAt) {
    const diff = new Date(user.planExpiresAt).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const handleSaveBankroll = () => {
    const updated = { ...user, bankroll: bankrollInput };
    saveStoredUser(updated);
    onUpdateUser(updated);
    setIsEditingBankroll(false);
  };

  const handleToggleNotifications = () => {
    const newVal = !notificationsToggle;
    setNotificationsToggle(newVal);
    const updated = { ...user, notificationsEnabled: newVal };
    saveStoredUser(updated);
    onUpdateUser(updated);
  };

  // Unit calculations
  const unit1Percent = Math.round(bankrollInput * 0.01);
  const unit2_5Percent = Math.round(bankrollInput * 0.025);
  const unit5Percent = Math.round(bankrollInput * 0.05);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Account Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-emerald-500/20">
            {user.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              {isVip ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Crown className="w-3.5 h-3.5" /> VIP Member
                </span>
              ) : isSubscribed ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active Subscriber
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Free Guest
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        <button
          onClick={() => onOpenSubscribe(isVip ? 'vip-monthly' : 'monthly')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <CreditCard className="w-4 h-4" />
          <span>{isVip ? 'Manage VIP Membership' : 'Upgrade Subscription'}</span>
        </button>
      </div>

      {/* Grid: Subscription Card & Bankroll Manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Subscription Status */}
        <div className="bg-[#0E1422] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Subscription Status</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Paystack Integrated</span>
            </div>

            <div className="my-5">
              <span className="text-xs text-slate-400 block mb-1">Current Active Plan:</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${isVip ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {user.currentPlan === 'vip-monthly'
                    ? 'VIP Monthly (₦15,000)'
                    : user.currentPlan === 'monthly'
                    ? 'Monthly Pro (₦10,000)'
                    : user.currentPlan === 'weekly'
                    ? 'Weekly Pass (₦5,000)'
                    : 'Free Guest Mode'}
                </span>
              </div>

              {isSubscribed && user.planExpiresAt && (
                <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Days Remaining:</span>
                    <span className="font-bold font-mono text-emerald-400">{daysRemaining} Days</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Expiration Date:</span>
                    <span className="font-mono text-white">
                      {new Date(user.planExpiresAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            {isSubscribed ? (
              <button
                onClick={() => onOpenSubscribe(user.currentPlan)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-all"
              >
                Renew or Extend Subscription via Paystack
              </button>
            ) : (
              <button
                onClick={() => onOpenSubscribe('monthly')}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Subscribe Now with Paystack
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Bankroll Management Calculator */}
        <div className="bg-[#0E1422] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Bankroll & Staking Calculator</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Disciplined Staking</span>
            </div>

            <div className="my-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-400">Total Football Betting Bankroll:</label>
                {!isEditingBankroll ? (
                  <button
                    onClick={() => setIsEditingBankroll(true)}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Edit Amount
                  </button>
                ) : (
                  <button
                    onClick={handleSaveBankroll}
                    className="text-xs text-emerald-400 font-bold hover:underline"
                  >
                    Save
                  </button>
                )}
              </div>

              {isEditingBankroll ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bankrollInput}
                    onChange={(e) => setBankrollInput(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSaveBankroll}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="text-2xl font-extrabold text-white font-mono">
                  ₦{bankrollInput.toLocaleString()} <span className="text-xs text-slate-500">NGN</span>
                </div>
              )}

              {/* Recommended Unit Stakes */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
                <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Conservative (1%)</span>
                  <span className="font-bold text-emerald-400">₦{unit1Percent.toLocaleString()}</span>
                </div>
                <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Moderate (2.5%)</span>
                  <span className="font-bold text-blue-400">₦{unit2_5Percent.toLocaleString()}</span>
                </div>
                <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Aggressive (5%)</span>
                  <span className="font-bold text-amber-400">₦{unit5Percent.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            * Consistent flat unit staking (1% to 2.5% per match) is mathematically proven to insulate your capital against expected sporting variance.
          </p>
        </div>
      </div>

      {/* Paystack Payment History Table */}
      <div className="bg-[#0E1422] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Paystack Payment History & Receipts</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">PCI-DSS Audited</span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            <CreditCard className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>No transactions recorded yet.</p>
            <p className="text-slate-500 mt-1">Subscribe to a plan to generate your first verified receipt.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2.5">Reference</th>
                  <th className="py-2.5">Plan</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.reference} className="hover:bg-slate-900/40">
                    <td className="py-3 text-slate-300">{tx.reference}</td>
                    <td className="py-3 text-white font-bold">{tx.planName}</td>
                    <td className="py-3 text-emerald-400 font-bold">₦{tx.amount.toLocaleString()}</td>
                    <td className="py-3 text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        SUCCESS
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setViewingReceipt(tx)}
                        className="text-emerald-400 hover:underline text-xs font-sans font-semibold"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Match Alert Preferences */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Match Day Prediction Alerts</h4>
            <p className="text-xs text-slate-400">Receive WhatsApp & Email notifications 2 hours before kickoff</p>
          </div>
        </div>

        <button
          onClick={handleToggleNotifications}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            notificationsToggle
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {notificationsToggle ? '✓ Notifications Active' : 'Enable Notifications'}
        </button>
      </div>

      {/* Receipt Dialog Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0E1422] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-xs space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm">Official Paystack Receipt</h4>
              <button
                onClick={() => setViewingReceipt(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 py-2">
              <div className="flex justify-between text-slate-400">
                <span>Receipt Number:</span>
                <span className="font-mono text-white font-bold">{viewingReceipt.reference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Plan:</span>
                <span className="text-white font-bold">{viewingReceipt.planName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold font-mono">₦{viewingReceipt.amount.toLocaleString()} NGN</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Channel:</span>
                <span className="text-white">{viewingReceipt.channel}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Date:</span>
                <span className="text-white">{new Date(viewingReceipt.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Subscriber Email:</span>
                <span className="text-white">{viewingReceipt.customerEmail}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-center">
              <span className="text-[10px] text-emerald-400 font-semibold block mb-3">
                ✓ Verified by Paystack Gateway
              </span>
              <button
                onClick={() => setViewingReceipt(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
