import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function Input({ label, error, id, className = "", ...props }: InputProps) {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div>
            <label
                htmlFor={inputId}
                className="block text-sm font-medium text-pov-cream mb-2"
            >
                {label}
            </label>
            <input
                id={inputId}
                className={`w-full px-4 py-3 bg-pov-dark border ${error ? 'border-red-500' : 'border-pov-gray/30'
                    } rounded-lg text-pov-cream placeholder-pov-gray focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-pov-gold'
                    } focus:border-transparent transition ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
