import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    footer?: ReactNode;
}

export default function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-pov-primary px-4">
            <div className="bg-pov-secondary p-8 rounded-lg shadow-2xl w-full max-w-md border border-pov-gold/10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <span className="text-5xl">🎬</span>
                    </div>
                    <h1 className="text-3xl font-bold text-pov-cream mb-2">{title}</h1>
                    <p className="text-pov-gray">{subtitle}</p>
                </div>

                {/* Content */}
                {children}

                {/* Footer */}
                {footer && (
                    <div className="mt-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
