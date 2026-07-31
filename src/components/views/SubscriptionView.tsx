import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Users,
  Sparkles,
  Calendar,
  Clock,
  Download,
  ArrowUpRight,
  Check,
  Lock,
  Building,
  RefreshCw,
  FileText,
  HelpCircle,
} from "lucide-react";
import { SubscriptionPlan, SubscriptionStatus, UserRole } from "../../types";

interface SubscriptionViewProps {
  currentRole?: UserRole;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: "plan-starter",
    name: "Starter School Plan",
    priceMonthly: 75000,
    priceAnnual: 750000,
    studentLimit: 500,
    aiCreditsMonthly: 1500,
    badge: "Basic",
    features: [
      "Up to 500 Active Student Records",
      "All Primary 1-6 Curriculum Modules",
      "1,500 Monthly AI Generation Credits",
      "Standard Report Card Generator",
      "Basic Parent SMS & Email Alerts",
      "Single School Campus Support",
    ],
  },
  {
    id: "plan-pro",
    name: "Professional Academy Plan",
    priceMonthly: 185000,
    priceAnnual: 1850000,
    studentLimit: 2500,
    aiCreditsMonthly: 5000,
    badge: "Most Popular",
    isPopular: true,
    features: [
      "Up to 2,500 Active Student Records",
      "All Primary 1-6, JSS 1-3 & SS 1-3 Curricula",
      "5,000 Monthly AI Lesson & Exam Credits",
      "Full School Website Builder & Custom Domain",
      "Automated CBT & WAEC/NECO Exam Generator",
      "Smart Fee Invoicing & Online Payment Gateway",
      "Unlimited Teachers & Staff Accounts",
      "24/7 Priority Support & Daily Backups",
    ],
  },
  {
    id: "plan-enterprise",
    name: "Enterprise Multi-Campus Plan",
    priceMonthly: 350000,
    priceAnnual: 3500000,
    studentLimit: 10000,
    aiCreditsMonthly: 25000,
    badge: "Unlimited",
    features: [
      "Up to 10,000 Active Student Records",
      "Unlimited Multi-Campus Administration",
      "25,000 Monthly AI Generation Credits",
      "Custom Subdomain & White-Label Portal",
      "Dedicated Database & SLA Guarantees",
      "Direct WhatsApp & SMS Broadcast Gateway",
      "Custom Ministry & Board Reporting Formats",
      "Dedicated Account Manager & Staff Training",
    ],
  },
];

const INITIAL_STATUS: SubscriptionStatus = {
  currentPlanId: "plan-pro",
  planName: "Professional Academy Plan",
  billingCycle: "Annual",
  status: "Active",
  activeStudentsUsed: 1248,
  maxStudentsLimit: 2500,
  aiCreditsUsed: 3420,
  maxAiCreditsLimit: 5000,
  renewalDate: "November 15, 2026",
  autoRenew: true,
  amountPaid: 1850000,
  lastPaymentDate: "November 15, 2025",
};

const INVOICE_HISTORY = [
  { id: "INV-2025-001", date: "Nov 15, 2025", amount: "₦1,850,000", plan: "Professional Academy Plan (Annual)", status: "Paid", gateway: "Paystack Card" },
  { id: "INV-2024-001", date: "Nov 15, 2024", amount: "₦1,650,000", plan: "Professional Academy Plan (Annual)", status: "Paid", gateway: "Bank Transfer" },
  { id: "INV-2023-001", date: "Nov 15, 2023", amount: "₦750,000", plan: "Starter School Plan (Annual)", status: "Paid", gateway: "Flutterwave" },
];

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ currentRole }) => {
  const [status, setStatus] = useState<SubscriptionStatus>(INITIAL_STATUS);
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Annual">("Annual");
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<SubscriptionPlan | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<"Paystack" | "Flutterwave" | "BankTransfer">("Paystack");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");
  const [topupCreditsModalOpen, setTopupCreditsModalOpen] = useState(false);
  const [creditsToBuy, setCreditsToBuy] = useState(2000);

  const isAdmin = currentRole === "Super Admin" || currentRole === "School Administrator" || currentRole === "Principal" || currentRole === "Account Officer";

  const handleSelectUpgrade = (plan: SubscriptionPlan) => {
    if (!isAdmin) {
      alert("Only School Administrators, Principals, or Account Officers can modify subscription plans.");
      return;
    }
    setSelectedUpgradePlan(plan);
  };

  const handleConfirmPayment = () => {
    if (!selectedUpgradePlan) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const newAmount = billingCycle === "Annual" ? selectedUpgradePlan.priceAnnual : selectedUpgradePlan.priceMonthly;
      setStatus((prev) => ({
        ...prev,
        currentPlanId: selectedUpgradePlan.id,
        planName: selectedUpgradePlan.name,
        billingCycle,
        maxStudentsLimit: selectedUpgradePlan.studentLimit,
        maxAiCreditsLimit: selectedUpgradePlan.aiCreditsMonthly,
        status: "Active",
        amountPaid: newAmount,
        lastPaymentDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }));
      setPaymentSuccessMsg(`Successfully upgraded to ${selectedUpgradePlan.name}!`);
      setSelectedUpgradePlan(null);
      setTimeout(() => setPaymentSuccessMsg(""), 4000);
    }, 1500);
  };

  const handleTopupCredits = () => {
    setStatus((prev) => ({
      ...prev,
      maxAiCreditsLimit: prev.maxAiCreditsLimit + creditsToBuy,
    }));
    setTopupCreditsModalOpen(false);
    setPaymentSuccessMsg(`Added +${creditsToBuy.toLocaleString()} AI Generation Credits to your school account!`);
    setTimeout(() => setPaymentSuccessMsg(""), 4000);
  };

  const handleToggleAutoRenew = () => {
    if (!isAdmin) return;
    setStatus((prev) => ({ ...prev, autoRenew: !prev.autoRenew }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                School Subscription & License Management
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage SaaS platform licenses, AI credits, student limits, and payment billing for LIVINGSTONEEDU.
              </p>
            </div>
          </div>
        </div>

        {paymentSuccessMsg && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            License: {status.status}
          </span>
        </div>
      </div>

      {/* Current Plan Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Plan Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <ShieldCheck className="w-48 h-48" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
                Active Plan
              </span>
              <span className="text-xs font-bold text-indigo-300">
                {status.billingCycle} Billing
              </span>
            </div>

            <h3 className="text-xl font-black mt-3">{status.planName}</h3>
            <p className="text-xs text-slate-300 mt-1">
              Registered Institution: <strong>Livingstone International Academy</strong>
            </p>

            <div className="mt-4 pt-4 border-t border-indigo-800/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Next Renewal Date:</span>
                <strong className="text-white">{status.renewalDate}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Last Payment Amount:</span>
                <strong className="text-emerald-400">₦{status.amountPaid.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <RefreshCw className={`w-4 h-4 ${status.autoRenew ? "text-emerald-400" : "text-amber-400"}`} />
              <span className="text-slate-300">Auto-Renewal:</span>
              <strong className={status.autoRenew ? "text-emerald-400" : "text-amber-400"}>
                {status.autoRenew ? "Enabled" : "Disabled"}
              </strong>
            </div>
            <button
              onClick={handleToggleAutoRenew}
              disabled={!isAdmin}
              className="text-[11px] font-bold text-indigo-300 hover:text-white underline disabled:opacity-50"
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Student Enrollment Capacity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500" />
                <span>Student Capacity</span>
              </h3>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {Math.round((status.activeStudentsUsed / status.maxStudentsLimit) * 100)}% Used
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {status.activeStudentsUsed.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                / {status.maxStudentsLimit.toLocaleString()} Seats
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${(status.activeStudentsUsed / status.maxStudentsLimit) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Covers all Primary 1–6, JSS 1–3, and SS 1–3 active student profiles.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-500 font-medium">
              Need capacity for over {status.maxStudentsLimit.toLocaleString()} students? Upgrade to Enterprise plan below.
            </p>
          </div>
        </div>

        {/* AI Credits Usage */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Generation Credits</span>
              </h3>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {Math.round((status.aiCreditsUsed / status.maxAiCreditsLimit) * 100)}% Used
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {status.aiCreditsUsed.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                / {status.maxAiCreditsLimit.toLocaleString()} Credits
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(status.aiCreditsUsed / status.maxAiCreditsLimit) * 100}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Used for AI Lesson Note Generation, Exam Creation & Assistant Copilot.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setTopupCreditsModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Top-Up Extra AI Credits</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans & Pricing Upgrade Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Available Subscription Plans & Upgrades
            </h2>
            <p className="text-xs text-slate-500">
              Select the optimal SaaS license plan tailored for Livingstone International Academy.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto">
            <button
              onClick={() => setBillingCycle("Monthly")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                billingCycle === "Monthly"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("Annual")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === "Annual"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = status.currentPlanId === plan.id;
            const price = billingCycle === "Annual" ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? "border-indigo-500 dark:border-indigo-600 shadow-lg ring-2 ring-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                        plan.isPopular
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {plan.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Current Plan
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      ₦{price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      / {billingCycle === "Annual" ? "year" : "month"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Supports up to <strong>{plan.studentLimit.toLocaleString()}</strong> students & <strong>{plan.aiCreditsMonthly.toLocaleString()}</strong> AI credits/mo.
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Included Features:
                    </p>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleSelectUpgrade(plan)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isCurrent
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                        : plan.isPopular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90"
                    }`}
                  >
                    <span>{isCurrent ? "Active Plan" : "Select & Upgrade"}</span>
                    {!isCurrent && <ArrowUpRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing & Invoice History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              <span>Subscription Payment Receipts & History</span>
            </h3>
            <p className="text-xs text-slate-500">
              Official invoices for audit and financial accounting.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Plan Description</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {INVOICE_HISTORY.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {inv.id}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {inv.date}
                  </td>
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">
                    {inv.plan}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {inv.gateway}
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                    {inv.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading Official PDF Receipt for ${inv.id}`)}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 inline-flex items-center gap-1 text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {selectedUpgradePlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
                  Secure Checkout
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Confirm Subscription Upgrade
                </h3>
              </div>
              <button
                onClick={() => setSelectedUpgradePlan(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Selected Plan:</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">{selectedUpgradePlan.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Billing Interval:</span>
                <span className="font-bold text-slate-900 dark:text-white">{billingCycle}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Student Record Capacity:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUpgradePlan.studentLimit.toLocaleString()} Seats</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Monthly AI Credits:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedUpgradePlan.aiCreditsMonthly.toLocaleString()} Credits</span>
              </div>
              <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Total Amount Payable:</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  ₦{(billingCycle === "Annual" ? selectedUpgradePlan.priceAnnual : selectedUpgradePlan.priceMonthly).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentGateway("Paystack")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentGateway === "Paystack"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  Paystack (Card/USSD)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentGateway("Flutterwave")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentGateway === "Flutterwave"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  Flutterwave
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentGateway("BankTransfer")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentGateway === "BankTransfer"
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  Direct Bank Transfer
                </button>
              </div>
            </div>

            {paymentGateway === "BankTransfer" && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1 font-mono">
                <p className="font-bold text-slate-900 dark:text-white">Bank: Zenith Bank PLC</p>
                <p>Account Name: Livingstone Education SaaS Ltd</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold">Account No: 1014889201</p>
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setSelectedUpgradePlan(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment}
                className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Pay ₦{(billingCycle === "Annual" ? selectedUpgradePlan.priceAnnual : selectedUpgradePlan.priceMonthly).toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP-UP AI CREDITS MODAL */}
      {topupCreditsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Top-Up AI Generation Credits
              </h3>
              <button onClick={() => setTopupCreditsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Select Additional AI Credits Package
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { amount: 1000, price: "₦15,000" },
                  { amount: 2000, price: "₦25,000" },
                  { amount: 5000, price: "₦50,000" },
                ].map((item) => (
                  <button
                    key={item.amount}
                    onClick={() => setCreditsToBuy(item.amount)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      creditsToBuy === item.amount
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/50 ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <div className="text-xs font-black text-slate-900 dark:text-white">+{item.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 font-bold mt-1">{item.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTopupCredits}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Confirm & Add +{creditsToBuy.toLocaleString()} Credits</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
