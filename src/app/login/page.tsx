'use client'

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../store/auth";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    // Usar Zustand store
    const { login } = useAuthStore();

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        // Validar email
        if (!email) {
            newErrors.email = "El correo electrónico es requerido";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "El correo electrónico no es válido";
        }

        // Validar password
        if (!password) {
            newErrors.password = "La contraseña es requerida";
        } else if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            console.log("Login exitoso");

            // Redirigir a películas después del login exitoso
            router.push("/movies");
        } catch (err: any) {
            console.error("Error al hacer login:", err);
            setError(err.response?.data?.message || "Credenciales incorrectas. Por favor verifica tus datos.");
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

                <div>
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="ejemplo@ejemplo.com"
                        disabled={loading}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                    )}
                </div>

                <div>
                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors({ ...errors, password: undefined });
                        }}
                        placeholder="••••••••"
                        disabled={loading}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                    )}
                </div>

                <Button type="submit" loading={loading} fullWidth>
                    Iniciar Sesión
                </Button>
            </form>
        </AuthLayout>
    );
}
