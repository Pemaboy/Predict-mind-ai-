import React from 'react';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';
import { SubscriptionPlanId, UserProfile } from '../types';
import { 
  Check, Crown, Zap, ShieldCheck, CreditCard, 
  HelpCircle, ArrowRight, Sparkles, Lock 
} from 'lucide-react';

interface SubscriptionViewProps {
  user: UserProfile;
  onOpenSubscribe: (planId?: SubscriptionPlanId) => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  user,
  onOpenSubscribe,
}) => {
  return (
    <div className="space-y-12">
      {/* Pricing Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent, Disciplined Subscription Tiers
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Invest in <span className="text-emerald-400">Quantitative Edge</span>
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
          Access verified AI football predictions, statistical goal models, and VIP banker selections. Seamless and instant payments powered by Paystack.
        </p>
      </div>

      {/* 3 Main Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = user.currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all ${
                plan.isVip
                  ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-[#0E1422] border-amber-500/50 shadow-xl shadow-amber-500/10'
                  : plan.popular
                  ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-[#0E1422] border-emerald-500/50 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'bg-[#0E1422] border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  plan.isVip
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  {plan.isVip ? (
                    <Crown className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Zap className="w-5 h-5 text-emerald-400" />
                  )}
                  <h3 className="font-extrabold text-white text-lg">{plan.name}</h3>
                </div>

                <p className="text-xs text-slate-400 mb-6 min-h-[34px]">
                  {plan.tagline}
                </p>

                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {plan.priceFormatted}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">NGN</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">
                    Full AI prediction access {plan.durationLabel}
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    Included Features:
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {isCurrent ? (
                  <div className="w-full py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs text-center border border-slate-700">
                    ✓ Your Current Active Plan
                  </div>
                ) : (
                  <button
                    id={`btn-subscribe-plan-${plan.id}`}
                    onClick={() => onOpenSubscribe(plan.id)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                      plan.isVip
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Subscribe via Paystack</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <span className="text-[10px] text-slate-500 text-center block mt-2.5">
                  Instant activation • Card, Bank Transfer, USSD
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paystack Trust & Payment Methods Banner */}
      <div className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black text-xl shrink-0">
            P
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Secured & Processed by Paystack</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              PCI-DSS Level 1 certified gateway. Pay securely with Nigerian Naira (NGN) via Mastercard, Visa, Verve, Kuda, Bank Transfer, or USSD.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 whitespace-nowrap">
          <ShieldCheck className="w-4 h-4" />
          <span>Instant Access on Payment</span>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto pt-6">
        <h3 className="text-xl font-bold text-white text-center mb-6">
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          <div className="bg-[#0E1422] p-5 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-1.5">
              How does the Predict Mind AI model generate football predictions?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our AI engine ingests multi-factor data points including past 10 matches, home vs away goal differentials, expected goals (xG) over-performance, rest days, injuries, and historical head-to-head patterns. It maps these factors through probabilistic distributions to find market value.
            </p>
          </div>

          <div className="bg-[#0E1422] p-5 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-1.5">
              What is the difference between Monthly Pro (₦10,000) and VIP Monthly (₦15,000)?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              While Monthly Pro gives you all standard match 1X2, BTTS, and Over/Under models, VIP members receive our highest-confidence "Banker of the Day" selections, curated 3-to-5 odds accumulators, the Custom Match AI analyzer, and deep tactical notes on bookings/corners.
            </p>
          </div>

          <div className="bg-[#0E1422] p-5 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-1.5">
              Are prediction results guaranteed?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              No. Football is inherently unpredictable and no algorithm can guarantee match results. Our platform generates statistical probabilities to help you make informed, value-driven decisions instead of emotional bets. Please wager responsibly within your personal budget.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
