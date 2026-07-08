function PaymentPolicyModal({ onAcknowledge }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-8">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-800">
          Before you continue
        </h2>
        <p className="mt-2 text-slate-500">
          A quick note about how payments work on DoubtConnect.
        </p>

        <div className="mt-6 space-y-4 rounded-2xl bg-blue-50 p-5 leading-7 text-blue-900">
          <p>
            <strong>DoubtConnect does not process, collect, hold, or
            transfer payments.</strong> Payments happen directly between
            students and teachers — no money passes through the platform.
          </p>
          <p>
            The platform's role is limited to scheduling sessions,
            generating Google Meet links, sending reminders, and securely
            sharing payment details at the appropriate stage.
          </p>
          <p>
            DoubtConnect does not guarantee payment, guarantee refunds, or
            mediate financial disputes. Refund requests, failed transfers,
            or incorrect payments must be resolved directly between the
            student and teacher.
          </p>
        </div>

        <a
          href="/payment-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-medium text-blue-600 hover:underline"
        >
          Read the full Payment Policy →
        </a>

        <button
          onClick={onAcknowledge}
          className="mt-6 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-500"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}

export default PaymentPolicyModal;
