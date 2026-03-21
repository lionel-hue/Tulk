// components/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { X, AlertCircle, CheckCircle, HelpCircle, Info } from 'lucide-react';

// Modal Component
const Modal = ({ modal, setModal }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && modal?.show) {
                handleClose();
            }
        };

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && modal?.show) {
                if (modal?.overlayClose !== false) {
                    handleClose();
                }
            }
        };

        if (modal?.show) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [modal]);

    const handleClose = () => {
        if (modal?.onClose) {
            modal.onClose();
        }
        setModal({ show: false });
    };

    const handleConfirm = () => {
        if (modal?.onConfirm) {
            modal.onConfirm();
        }
        setModal({ show: false });
    };

    const handleCancel = () => {
        if (modal?.onCancel) {
            modal.onCancel();
        }
        setModal({ show: false });
    };

    const getIcon = () => {
        switch (modal?.type) {
            case 'success':
                return <CheckCircle className="text-green-500 flex-shrink-0" size={24} />;
            case 'warning':
                return <AlertCircle className="text-yellow-500 flex-shrink-0" size={24} />;
            case 'error':
                return <AlertCircle className="text-red-500 flex-shrink-0" size={24} />;
            case 'confirm':
                return <HelpCircle className="text-blue-500 flex-shrink-0" size={24} />;
            default:
                return <Info className="text-gray-400 flex-shrink-0" size={24} />;
        }
    };

    const getTitle = () => {
        if (modal?.title) return modal.title;
        
        switch (modal?.type) {
            case 'success':
                return 'Succès';
            case 'warning':
                return 'Attention';
            case 'error':
                return 'Erreur';
            case 'confirm':
                return 'Confirmation';
            default:
                return 'Information';
        }
    };

    if (!modal?.show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity data-[active=true]:opacity-100 data-[active=true]:pointer-events-auto"
             data-active={modal?.show}>
            <div 
                ref={modalRef}
                className="bg-[#141414] border border-[#262626] rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-200 scale-95 opacity-0 data-[active=true]:scale-100 data-[active=true]:opacity-100"
                data-active={modal?.show}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#262626]">
                    <div className="flex items-center gap-3">
                        {getIcon()}
                        <h3 className="text-lg font-semibold text-white">{getTitle()}</h3>
                    </div>
                    <button 
                        className="p-1 text-gray-400 hover:text-white transition-colors rounded"
                        onClick={handleClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {modal?.message && (
                        <p className="text-gray-300 leading-relaxed">{modal.message}</p>
                    )}
                    {modal?.content && (
                        <div className="text-gray-300">
                            {modal.content}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end p-6 border-t border-[#262626]">
                    {modal?.type === 'confirm' ? (
                        <>
                            <button 
                                className="px-4 py-2 bg-[#262626] text-gray-300 border border-[#404040] rounded-lg font-medium hover:bg-[#363636] hover:text-white transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                onClick={handleCancel}
                            >
                                {modal.cancelText || 'Annuler'}
                            </button>
                            <button 
                                className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                onClick={handleConfirm}
                            >
                                {modal.confirmText || 'Confirmer'}
                            </button>
                        </>
                    ) : (
                        <button 
                            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            onClick={handleClose}
                        >
                            {modal?.confirmText || 'OK'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Custom Hook for using modal (same as before)
export const useModal = () => {
    const [modal, setModal] = React.useState({
        show: false,
        type: 'info',
        title: '',
        message: '',
        content: null,
        confirmText: '',
        cancelText: '',
        onConfirm: null,
        onCancel: null,
        onClose: null,
        overlayClose: true
    });

    const alert = (message, title = 'Information', options = {}) => {
        return new Promise((resolve) => {
            setModal({
                show: true,
                type: 'info',
                title,
                message,
                confirmText: 'OK',
                onClose: resolve,
                ...options
            });
        });
    };

    const confirm = (message, title = 'Confirmation', options = {}) => {
        return new Promise((resolve) => {
            setModal({
                show: true,
                type: 'confirm',
                title,
                message,
                confirmText: 'Confirmer',
                cancelText: 'Annuler',
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false),
                ...options
            });
        });
    };

    const success = (message, title = 'Succès', options = {}) => {
        return new Promise((resolve) => {
            setModal({
                show: true,
                type: 'success',
                title,
                message,
                confirmText: 'OK',
                onClose: resolve,
                ...options
            });
        });
    };

    const warning = (message, title = 'Attention', options = {}) => {
        return new Promise((resolve) => {
            setModal({
                show: true,
                type: 'warning',
                title,
                message,
                confirmText: 'Compris',
                onClose: resolve,
                ...options
            });
        });
    };

    const error = (message, title = 'Erreur', options = {}) => {
        return new Promise((resolve) => {
            setModal({
                show: true,
                type: 'error',
                title,
                message,
                confirmText: 'OK',
                onClose: resolve,
                ...options
            });
        });
    };

    const custom = (content, options = {}) => {
        return new Promise((resolve) => {
            setModal({
                show: true,
                type: 'custom',
                content,
                onClose: resolve,
                ...options
            });
        });
    };

    return {
        modal,
        setModal,
        alert,
        confirm,
        success,
        warning,
        error,
        custom
    };
};

export default Modal;