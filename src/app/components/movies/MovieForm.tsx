'use client'

import { useState, FormEvent } from "react";
import { Movies } from "../../interfaces/movies-response.interface";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface MovieFormProps {
    movie?: Movies;
    onSubmit: (data: MovieFormData) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
}

export interface MovieFormData {
    title: string;
    description: string;
    director: string;
    releaseDate: string;
    genre: string;
}

export default function MovieForm({ movie, onSubmit, onCancel, isEditing = false }: MovieFormProps) {
    const [formData, setFormData] = useState<MovieFormData>({
        title: movie?.title || "",
        description: movie?.description || "",
        director: movie?.director || "",
        releaseDate: movie?.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : "",
        genre: movie?.genre || ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (field: keyof MovieFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "El título es requerido";
        } else if (formData.title.trim().length < 2) {
            newErrors.title = "El título debe tener al menos 2 caracteres";
        }

        if (!formData.description.trim()) {
            newErrors.description = "La descripción es requerida";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "La descripción debe tener al menos 10 caracteres";
        }

        if (!formData.director.trim()) {
            newErrors.director = "El director es requerido";
        } else if (formData.director.trim().length < 2) {
            newErrors.director = "El nombre del director debe tener al menos 2 caracteres";
        }

        if (!formData.releaseDate) {
            newErrors.releaseDate = "La fecha de estreno es requerida";
        } else {
            const selectedDate = new Date(formData.releaseDate);
            const today = new Date();
            if (selectedDate > today) {
                newErrors.releaseDate = "La fecha no puede ser futura";
            }
        }

        if (!formData.genre.trim()) {
            newErrors.genre = "El género es requerido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await onSubmit(formData);
        } catch (error: any) {
            console.error("Error al guardar película:", error);
            setSubmitError(
                error.response?.data?.message ||
                `Error al ${isEditing ? 'actualizar' : 'crear'} la película`
            );
        } finally {
            setLoading(false);
        }
    };

    const genres = [
        { value: "action", label: "Acción" },
        { value: "comedy", label: "Comedia" },
        { value: "drama", label: "Drama" },
        { value: "horror", label: "Terror" },
        { value: "romance", label: "Romance" },
        { value: "sci-fi", label: "Ciencia Ficción" },
        { value: "thriller", label: "Thriller" }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {submitError}
                </div>
            )}

            <Input
                label="Título de la Película"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ej: El Padrino"
                required
                disabled={loading}
                error={errors.title}
            />

            <div>
                <label className="block text-sm font-medium text-pov-cream mb-2">
                    Descripción / Sinopsis
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={5}
                    className={`w-full px-4 py-3 bg-pov-dark border ${errors.description ? 'border-red-500' : 'border-pov-gray/30'
                        } rounded-lg text-pov-cream placeholder-pov-gray focus:outline-none focus:ring-2 ${errors.description ? 'focus:ring-red-500' : 'focus:ring-pov-gold'
                        } focus:border-transparent transition resize-none`}
                    placeholder="Escribe una breve descripción de la película..."
                    required
                    disabled={loading}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                )}
            </div>

            <Input
                label="Director"
                type="text"
                value={formData.director}
                onChange={(e) => handleChange('director', e.target.value)}
                placeholder="Ej: Francis Ford Coppola"
                required
                disabled={loading}
                error={errors.director}
            />

            <Input
                label="Fecha de Estreno"
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleChange('releaseDate', e.target.value)}
                required
                disabled={loading}
                error={errors.releaseDate}
            />

            <div>
                <label className="block text-sm font-medium text-pov-cream mb-2">
                    Género
                </label>
                <select
                    value={formData.genre}
                    onChange={(e) => handleChange('genre', e.target.value)}
                    className={`w-full px-4 py-3 bg-pov-dark border ${errors.genre ? 'border-red-500' : 'border-pov-gray/30'
                        } rounded-lg text-pov-cream focus:outline-none focus:ring-2 ${errors.genre ? 'focus:ring-red-500' : 'focus:ring-pov-gold'
                        } focus:border-transparent transition`}
                    required
                    disabled={loading}
                >
                    <option value="">Selecciona un género</option>
                    {genres.map(genre => (
                        <option key={genre.value} value={genre.value}>{genre.label}</option>
                    ))}
                </select>
                {errors.genre && (
                    <p className="mt-1 text-sm text-red-400">{errors.genre}</p>
                )}
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" loading={loading} fullWidth>
                    {isEditing ? '💾 Guardar Cambios' : '➕ Crear Película'}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
}
