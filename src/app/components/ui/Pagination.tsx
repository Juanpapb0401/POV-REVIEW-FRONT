'use client'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Mostrar solo un rango de páginas si hay muchas
    const getPageRange = () => {
        if (totalPages <= 7) return pages;

        if (currentPage <= 4) {
            return [...pages.slice(0, 5), '...', totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [1, '...', ...pages.slice(totalPages - 5)];
        }

        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages
        ];
    };

    const pageRange = getPageRange();

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === 1
                        ? 'bg-pov-cream/10 text-pov-cream/30 cursor-not-allowed'
                        : 'bg-pov-gold/20 text-pov-gold hover:bg-pov-gold/30'
                    }`}
            >
                ← Anterior
            </button>

            {/* Page numbers */}
            <div className="flex gap-2">
                {pageRange.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-pov-cream/50">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === pageNum
                                    ? 'bg-pov-gold text-pov-dark'
                                    : 'bg-pov-cream/10 text-pov-cream hover:bg-pov-cream/20'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {/* Next button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === totalPages
                        ? 'bg-pov-cream/10 text-pov-cream/30 cursor-not-allowed'
                        : 'bg-pov-gold/20 text-pov-gold hover:bg-pov-gold/30'
                    }`}
            >
                Siguiente →
            </button>
        </div>
    );
}
