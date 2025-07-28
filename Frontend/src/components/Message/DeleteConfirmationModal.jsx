import React from "react";

const DeleteConfirmationModal = ({ visible, onCancel, onConfirm }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Delete Message
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this message? This action cannot be
          undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
