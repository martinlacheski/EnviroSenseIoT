type ConfirmationDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
};

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmationDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}