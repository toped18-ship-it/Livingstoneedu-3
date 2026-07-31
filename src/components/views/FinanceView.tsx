import React, { useState } from "react";
import { CreditCard, DollarSign, ArrowUpRight, Check, AlertCircle, FileText, Download, ShieldCheck, Lock } from "lucide-react";
import { initialInvoices } from "../../data/initialData";
import { FinanceInvoice } from "../../types";

export const FinanceView: React.FC = () => {
  const [invoices, setInvoices] = useState<FinanceInvoice[]>(initialInvoices);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<FinanceInvoice | null>(null);
  const [paymentGateway, setPaymentGateway] = useState<"Flutterwave" | "Paystack">("Paystack");
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");

  const handleSimulatePayment = (inv: FinanceInvoice) => {
    setActivePaymentInvoice(inv);
  };

  const handleConfirmPayment = () => {
    if (!activePaymentInvoice) return;
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === activePaymentInvoice.id
          ? { ...i, paidAmount: i.totalAmount, status: "Paid" }
          : i
      )
    );
    setPaymentSuccessMsg(
      `Payment of ₦${(activePaymentInvoice.totalAmount - activePaymentInvoice.paidAmount).toLocaleString()} via ${paymentGateway} successfully confirmed!`
    );
    setActivePaymentInvoice(null);
    setTimeout(() => setPaymentSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Financial Management & Tuition Billing
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated student fee invoicing, expense ledgers, digital receipts, and integrated Paystack / Flutterwave gateways.
          </p>
        </div>

        {paymentSuccessMsg && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Term Total Tuition Expected</span>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">₦46,950,000</div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
            1st Term 2026/2027 Budget
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Tuition Collected To Date</span>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">₦42,100,000</div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
            89.7% Collection Rate
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Outstanding Pending Deficit</span>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">₦4,850,000</div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1 block">
            34 Students Pending Clearance
          </span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Student Tuition Invoices</h3>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Class Stream</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-right">Amount Paid</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Pay via Gateway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{inv.id}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{inv.studentName}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{inv.class}</td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                    ₦{inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    ₦{inv.paidAmount.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === "Paid"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                          : inv.status === "Partial"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                          : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {inv.status !== "Paid" ? (
                      <button
                        onClick={() => handleSimulatePayment(inv)}
                        className="px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      >
                        Pay Balance
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">Receipt Issued</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal Simulator */}
      {activePaymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Secure Tuition Payment Gateway</span>
              </h3>
              <button
                onClick={() => setActivePaymentInvoice(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
              <span className="text-slate-400 block">Paying Tuition For:</span>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {activePaymentInvoice.studentName} ({activePaymentInvoice.class})
              </p>
              <div className="flex justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700">
                <span className="text-slate-500">Balance Due:</span>
                <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                  ₦{(activePaymentInvoice.totalAmount - activePaymentInvoice.paidAmount).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                Select Payment Processor Gateway
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentGateway("Paystack")}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    paymentGateway === "Paystack"
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  Paystack Gateway
                </button>
                <button
                  onClick={() => setPaymentGateway("Flutterwave")}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    paymentGateway === "Flutterwave"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                      : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  Flutterwave
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Simulate Gateway Authorization</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
