import * as React from "react";
import { X, QrCode } from "lucide-react";


export interface RecordPaymentDialogProps {
    isOpen: boolean;
    booking: any;
    onClose: () => void;
    onSave: (payload: {
        paymentMethod: "CASH" | "ONLINE" | "SPLIT";
        totalAmount: number;
        amountPaid: number;
        cashAmount: number;
        onlineAmount: number;
        status: "COMPLETED" | "PENDING";
        transactionId?: string;
    }) => Promise<boolean>;
}

export function RecordPaymentDialog({
    isOpen,
    booking,
    onClose,
    onSave,
}: RecordPaymentDialogProps) {
    const [paymentTotalAmount, setPaymentTotalAmount] = React.useState<number>(0);
    const [paymentAmountPaid, setPaymentAmountPaid] = React.useState<number>(0);
    const [paymentCashAmount, setPaymentCashAmount] = React.useState<number>(0);
    const [paymentOnlineAmount, setPaymentOnlineAmount] = React.useState<number>(0);
    const [paymentTransactionId, setPaymentTransactionId] = React.useState<string>("");
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (booking) {
            const method = booking.payment?.paymentMethod || "CASH";
            setPaymentTotalAmount(booking.payment?.totalAmount || booking.totalPrice || 0);
            
            const cash = booking.payment?.cashAmount;
            const online = booking.payment?.onlineAmount;
            if (cash !== undefined && online !== undefined) {
                setPaymentCashAmount(cash);
                setPaymentOnlineAmount(online);
            } else {
                if (method === "ONLINE") {
                    setPaymentCashAmount(0);
                    setPaymentOnlineAmount(booking.payment?.amountPaid || booking.totalPrice || 0);
                } else {
                    setPaymentCashAmount(booking.payment?.amountPaid || booking.totalPrice || 0);
                    setPaymentOnlineAmount(0);
                }
            }
            setPaymentTransactionId(booking.payment?.transactionId || "");
        }
    }, [booking]);

    React.useEffect(() => {
        setPaymentAmountPaid(paymentCashAmount + paymentOnlineAmount);
    }, [paymentCashAmount, paymentOnlineAmount]);

    if (!isOpen || !booking) return null;

    const handleSave = async () => {
        setIsSaving(true);
        const method = paymentCashAmount > 0 && paymentOnlineAmount > 0 ? "SPLIT" : (paymentOnlineAmount > 0 ? "ONLINE" : "CASH");
        const payload = {
            paymentMethod: method as "CASH" | "ONLINE" | "SPLIT",
            totalAmount: paymentTotalAmount,
            amountPaid: paymentAmountPaid,
            cashAmount: paymentCashAmount,
            onlineAmount: paymentOnlineAmount,
            status: (paymentAmountPaid >= paymentTotalAmount ? "COMPLETED" : "PENDING") as "COMPLETED" | "PENDING",
            transactionId: paymentOnlineAmount > 0 ? paymentTransactionId.trim() : undefined,
        };
        const success = await onSave(payload);
        setIsSaving(false);
        if (success) {
            onClose();
        }
    };

    return (
        <div 
            aria-modal="true" 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200"
            role="dialog"
        >
            <div className="w-full max-w-sm rounded-xl bg-white p-5 border border-slate-200 shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">
                            Record Payment - Room {booking.roomNumber || booking.room?.roomNumber}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Booking ID: #{booking.id}</p>
                    </div>
                    <button
                        type="button"
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-650 transition-colors cursor-pointer"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-3.5 text-xs text-slate-700">
                    {/* Cash Paid */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500 block">Cash Paid (₹) *</label>
                        <input
                            type="number"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={paymentCashAmount}
                            onChange={e => setPaymentCashAmount(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    {/* Online Paid */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500 block">Online Paid (₹) *</label>
                        <input
                            type="number"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={paymentOnlineAmount}
                            onChange={e => setPaymentOnlineAmount(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    {/* Total Price */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500 block">Original Price (₹)</label>
                        <input
                            type="number"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-705"
                            value={paymentTotalAmount}
                            readOnly
                        />
                    </div>

                    {/* Total Amount Paid */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500 block">Total Amount Paid (₹)</label>
                        <input
                            type="number"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-blue-600"
                            value={paymentAmountPaid}
                            readOnly
                        />
                    </div>

                    {/* Transaction ID Reference */}
                    {paymentOnlineAmount > 0 && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-500 block">Transaction Reference ID</label>
                            <div className="relative">
                                <QrCode className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="UPI Ref / Transaction Number"
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={paymentTransactionId}
                                    onChange={e => setPaymentTransactionId(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-5">
                    <button
                        type="button"
                        className="flex-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        onClick={handleSave}
                    >
                        {isSaving ? "Saving..." : "Save Payment"}
                    </button>
                </div>
            </div>
        </div>
    );
}
