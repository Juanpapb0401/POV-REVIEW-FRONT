'use client'

import { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success' | 'confirm';
    confirmText?: string;
    cancelText?: string;
}

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'info',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar'
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'confirm': return '❓';
            default: return 'ℹ️';
        }
    };

    const getColorClasses = () => {
        switch (type) {
            case 'success': return 'border-green-500/50 bg-green-500/10';
            case 'error': return 'border-red-500/50 bg-red-500/10';
            case 'warning': return 'border-yellow-500/50 bg-yellow-500/10';
            case 'confirm': return 'border-pov-gold/50 bg-pov-gold/10';
            default: return 'border-blue-500/50 bg-blue-500/10';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-pov-dark border-2 rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                <div className={`border-b-2 ${getColorClasses()} p-6`}>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{getIcon()}</span>
                        <h3 className="text-2xl font-bold text-pov-cream">{title}</h3>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-pov-cream/90 text-lg leading-relaxed">{message}</p>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                    {type === 'confirm' && onConfirm ? (
                        <>
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-pov-cream/10 text-pov-cream rounded-lg hover:bg-pov-cream/20 transition-colors font-semibold border border-pov-cream/20"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="flex-1 px-4 py-3 bg-pov-gold text-pov-dark rounded-lg hover:bg-pov-gold/90 transition-colors font-semibold"
                            >
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-pov-gold text-pov-dark rounded-lg hover:bg-pov-gold/90 transition-colors font-semibold"
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
