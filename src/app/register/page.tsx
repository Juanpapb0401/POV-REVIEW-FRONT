'use client'

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../store/auth";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    // Usar Zustand store
    const { register } = useAuthStore();

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "El nombre debe tener al menos 3 caracteres";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El correo electrónico es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Ingresa un correo electrónico válido";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setServerError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            console.log("Registro exitoso");

            // Redirigir al dashboard después del registro exitoso
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Error al registrarse:", err);
            setServerError(err.response?.data?.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <div className="text-center">
            <p className="text-pov-gray text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-pov-gold hover:text-pov-gold-dark font-semibold transition">
                    Inicia sesión aquí
                </Link>
            </p>
        </div>
    );

    return (
        <AuthLayout
            title="Crear Cuenta"
            subtitle="Regístrate en POV Review"
            footer={footer}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {serverError && (
                    <Alert type="error" message={serverError} onClose={() => setServerError("")} />
                )}

                <Input
                    label="Nombre Completo"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Juan Pérez"
                    required
                    disabled={loading}
                    error={errors.name}
                />

                <Input
                    label="Correo Electrónico"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    required
                    disabled={loading}
                    error={errors.email}
                />

                <Input
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    error={errors.password}
                />

                <Input
                    label="Confirmar Contraseña"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    error={errors.confirmPassword}
                />

                <Button type="submit" loading={loading} fullWidth>
                    Crear Cuenta
                </Button>
            </form>
        </AuthLayout>
    );
}
