import logo from "@/assets/logo.png";
import type { PrintableOrderReceipt as PrintableOrderReceiptData } from "../types/orders.types";

interface PrintableOrderReceiptProps {
  receipt: PrintableOrderReceiptData | null;
}

const formatCurrency = (value?: number) =>
  `\u20B1${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value?: string | Date) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatList = (value?: string[]) => {
  if (!value || value.length === 0) return "-";
  return value.join(", ");
};

export const PrintableOrderReceipt = ({
  receipt,
}: PrintableOrderReceiptProps) => {
  if (!receipt) return null;

  return (
    <div className="order-receipt-print-shell" aria-hidden="true">
      <style>
        {`
          .order-receipt-print-shell {
            position: fixed;
            left: -10000px;
            top: 0;
            width: 58mm;
            background: #fff;
            color: #000;
            font-family: Inter, Arial, sans-serif;
            pointer-events: none;
          }

          @media print {
            @page {
              size: 58mm 210mm;
              margin: 2mm 0mm;
            }

            body * {
              visibility: hidden !important;
            }

            .order-receipt-print-shell,
            .order-receipt-print-shell * {
              visibility: visible !important;
            }

            .order-receipt-print-shell {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 58mm !important;
              padding: 0 !important;
              margin: 0 !important;
              pointer-events: auto !important;
            }
          }
        `}
      </style>

      <div className="px-[2mm] py-[1mm] text-[10px] leading-tight text-black">
        <div className="mb-2 flex items-center gap-2">
          <img
            src={logo}
            alt="PSITS"
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-bold leading-none">Official Receipt</p>
            <p className="mt-1 text-[9px]">Order Copy</p>
          </div>
        </div>

        <div className="mb-2 w-full border-b border-dashed border-black pb-2 text-center">
          <p className="text-[11px] font-bold">
            University of Cebu Main Campus
          </p>
          <p className="text-[9px]">Sanciangko Street Cebu City, 6000</p>
        </div>

        <div className="space-y-1 border-b border-dashed border-black pb-2">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {receipt.student_name || "-"}
          </p>
          <p>
            <span className="font-semibold">Student ID:</span>{" "}
            {receipt.id_number || "-"}
          </p>
          <p>
            <span className="font-semibold">Course & Year:</span>{" "}
            {receipt.course || "-"} {receipt.year ? `- ${receipt.year}` : ""}
          </p>
          <p>
            <span className="font-semibold">Reference:</span>{" "}
            {receipt.reference_code || "-"}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {formatDateTime(receipt.transaction_date || receipt.order_date)}
          </p>
        </div>

        {receipt.membership_discount || receipt.promo_name ? (
          <div className="space-y-1 border-b border-dashed border-black py-2">
            {receipt.membership_discount ? (
              <p>
                <span className="font-semibold">Membership:</span> Discounted
              </p>
            ) : null}
            {receipt.promo_name ? (
              <p>
                <span className="font-semibold">Promo:</span>{" "}
                {receipt.promo_name}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="border-b border-dashed border-black py-2">
          <p className="mb-1 font-semibold">Items</p>
          <div className="space-y-2">
            {receipt.items.map((item, index) => (
              <div key={`${item.product_name}-${index}`}>
                <p className="font-semibold break-words">
                  {item.product_name}
                </p>
                <div className="flex justify-between gap-1">
                  <p className="text-[9px]">
                    Qty {item.quantity}
                    {item.price !== undefined
                      ? ` x ${formatCurrency(item.price)}`
                      : ""}
                  </p>
                  <p className="shrink-0 font-semibold">
                    {formatCurrency(item.sub_total)}
                  </p>
                </div>
                <p className="text-[9px] break-words">
                  Batch: {item.batch ?? "-"} | Size: {formatList(item.sizes)} |
                  Variation: {formatList(item.variation)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 border-b border-dashed border-black py-2">
          <div className="flex justify-between">
            <span>Cash</span>
            <span>{formatCurrency(receipt.cash)}</span>
          </div>
          <div className="flex justify-between">
            <span>Change</span>
            <span>{formatCurrency(receipt.change)}</span>
          </div>
          <div className="flex justify-between pt-1 text-[12px] font-bold">
            <span>Total</span>
            <span>{formatCurrency(receipt.total)}</span>
          </div>
        </div>

        <div className="border-b border-dashed border-black pb-2 pt-1">
          <p>
            Managed by:{" "}
            <span className="font-semibold">{receipt.admin || "-"}</span>
          </p>
        </div>

        <div className="pt-2 text-center">
          <p className="text-[11px] font-bold">{receipt.reference_code}</p>
          <p className="mt-1 text-[9px]">Thank you for your purchase!</p>
          <p className="mt-1 text-[9px]">
            PSITS - University of Cebu Main Campus
          </p>
        </div>
      </div>
    </div>
  );
};
