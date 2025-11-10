'use client'

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "../services/auth/auth.service";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            console.log("Login exitoso:", response);

            // Redirigir al dashboard después del login exitoso
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Error al hacer login:", err);
            setError(err.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.");
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <>
            <div className="text-center">
                <p className="text-pov-gray text-sm">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-pov-gold hover:text-pov-gold-dark font-semibold transition">
                        Regístrate aquí
                    </Link>
                </p>
            </div>

            <div className="mt-4 p-4 bg-pov-dark/50 rounded-lg border border-pov-gold/20">
                <p className="text-xs text-pov-gray text-center mb-2">Credenciales de prueba:</p>
                <p className="text-xs text-pov-cream"><strong className="text-pov-gold">Admin:</strong> admin@example.com / admin123</p>
                <p className="text-xs text-pov-cream"><strong className="text-pov-gold">Usuario:</strong> alice@example.com / alice123</p>
            </div>
        </>
    );

    return (
        <AuthLayout
            title="POV Review"
            subtitle="Inicia sesión para continuar"
            footer={footer}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <Alert type="error" message={error} onClose={() => setError("")} />}

                <Input
                    label="Correo Electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    disabled={loading}
                />

                <Input
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                />

                <Button type="submit" loading={loading} fullWidth>
                    Iniciar Sesión
                </Button>
            </form>
        </AuthLayout>
    );
}
