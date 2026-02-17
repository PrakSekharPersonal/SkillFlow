import { createPortal } from "react-dom";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center border border-red-100">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Path?</h2>
        <p className="text-slate-500 mb-6 text-sm">
          Are you sure you want to delete <b>"{title}"</b>?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DeleteModal;
