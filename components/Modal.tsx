type BookingModalProps = {
  updateIsModalOpen: (open: boolean) => void;
  header: string;
  children: React.ReactNode;
};

function BookingModal({
  updateIsModalOpen,
  header,
  children,
}: BookingModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={() => updateIsModalOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
        <p className="text-lg font-semibold mb-4">{header}</p>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default BookingModal;
