'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import authService from "./services/auth/auth.service";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return (
    <div className="min-h-screen bg-pov-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navbar */}
        <nav className="bg-pov-dark/80 backdrop-blur-sm border-b border-pov-gold/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🎬</span>
                <h1 className="text-2xl font-bold text-pov-cream">POV Review</h1>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/movies"
                  className="text-pov-cream hover:text-pov-gold transition font-medium"
                >
                  Películas
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-pov-cream hover:text-pov-gold transition font-medium"
                    >
                      Panel
                    </Link>
                    <button
                      onClick={() => {
                        authService.logout();
                        setIsAuthenticated(false);
                        router.refresh();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-pov-cream font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-pov-cream hover:text-pov-gold transition font-medium"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/register"
                      className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <span className="text-9xl inline-block animate-pulse">🎬</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-pov-cream mb-6">
              Bienvenido a <span className="text-pov-gold">POV Review</span>
            </h1>

            <p className="text-xl md:text-2xl text-pov-gray max-w-3xl mx-auto mb-12">
              La plataforma definitiva para descubrir, reseñar y compartir tus opiniones sobre películas.
              Únete a nuestra comunidad de cinéfilos apasionados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/register"
                    className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-bold py-4 px-8 rounded-lg transition duration-200 shadow-xl text-lg w-full sm:w-auto"
                  >
                    🎬 Comenzar Ahora
                  </Link>
                  <Link
                    href="/login"
                    className="bg-pov-secondary hover:bg-pov-dark text-pov-cream font-semibold py-4 px-8 rounded-lg transition duration-200 border border-pov-gold/30 text-lg w-full sm:w-auto"
                  >
                    Iniciar Sesión
                  </Link>
                </>
              ) : (
                <Link
                  href="/movies"
                  className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-bold py-4 px-8 rounded-lg transition duration-200 shadow-xl text-lg"
                >
                  Explorar Películas →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-pov-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-pov-cream text-center mb-16">
            ¿Qué puedes hacer en POV Review?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-pov-secondary rounded-lg p-8 border border-pov-gold/10 hover:border-pov-gold/30 transition">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-pov-cream mb-3">Descubre Películas</h3>
              <p className="text-pov-gray">
                Explora nuestra extensa colección de películas de todos los géneros y épocas.
                Encuentra tu próxima película favorita.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-pov-secondary rounded-lg p-8 border border-pov-gold/10 hover:border-pov-gold/30 transition">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-pov-cream mb-3">Escribe Reseñas</h3>
              <p className="text-pov-gray">
                Comparte tu opinión sobre las películas que has visto. Ayuda a otros usuarios
                a decidir qué ver a continuación.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-pov-secondary rounded-lg p-8 border border-pov-gold/10 hover:border-pov-gold/30 transition">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-pov-cream mb-3">Únete a la Comunidad</h3>
              <p className="text-pov-gray">
                Conecta con otros amantes del cine. Lee reseñas, comenta y descubre
                nuevas perspectivas sobre tus películas favoritas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-pov-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-pov-gold mb-2">1000+</div>
              <div className="text-pov-gray text-lg">Películas en Catálogo</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-pov-gold mb-2">500+</div>
              <div className="text-pov-gray text-lg">Usuarios Activos</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-pov-gold mb-2">5000+</div>
              <div className="text-pov-gray text-lg">Reseñas Publicadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-pov-dark py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-pov-cream mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-pov-gray mb-8">
            Únete a POV Review hoy y descubre un mundo de películas y opiniones cinematográficas.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-bold py-4 px-8 rounded-lg transition duration-200 shadow-xl text-lg"
              >
                Crear Cuenta Gratis
              </Link>
              <Link
                href="/movies"
                className="bg-pov-secondary hover:bg-pov-primary text-pov-cream font-semibold py-4 px-8 rounded-lg transition duration-200 border border-pov-gold/30 text-lg"
              >
                Ver Películas
              </Link>
            </div>
          ) : (
            <Link
              href="/movies"
              className="inline-block bg-pov-gold hover:bg-pov-gold-dark text-pov-dark font-bold py-4 px-8 rounded-lg transition duration-200 shadow-xl text-lg"
            >
              Ir a Películas →
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-pov-primary border-t border-pov-gold/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎬</span>
              <span className="text-pov-cream font-bold text-lg">POV Review</span>
            </div>

            <div className="text-pov-gray text-sm">
              © 2025 POV Review. Todos los derechos reservados.
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}
