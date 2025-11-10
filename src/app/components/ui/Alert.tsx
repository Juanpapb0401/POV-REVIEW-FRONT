interface AlertProps {
    type?: 'error' | 'success' | 'warning' | 'info';
    message: string;
    onClose?: () => void;
}

export default function Alert({ type = 'error', message, onClose }: AlertProps) {
    const typeStyles = {
        error: 'bg-red-500/10 border-red-500 text-red-400',
        success: 'bg-green-500/10 border-green-500 text-green-400',
        warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-400',
        info: 'bg-blue-500/10 border-blue-500 text-blue-400'
    };

    const icons = {
        error: '❌',
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️'
    };

    return (
        <div className={`${typeStyles[type]} border px-4 py-3 rounded-lg text-sm flex items-start justify-between gap-2`}>
            <div className="flex items-start gap-2">
                <span className="text-base">{icons[type]}</span>
                <span>{message}</span>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-current hover:opacity-70 transition"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
