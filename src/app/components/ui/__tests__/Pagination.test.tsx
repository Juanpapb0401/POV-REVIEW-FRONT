import { render, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
    it('renders all pages when totalPages is small', () => {
        const onPageChange = jest.fn();
        const { getByText } = render(
            <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
        );

        Array.from({ length: 5 }, (_, i) => i + 1).forEach((page) => {
            expect(getByText(String(page))).toBeInTheDocument();
        });

        const nextButton = getByText('Siguiente →') as HTMLButtonElement;
        expect(nextButton.disabled).toBe(false);

        fireEvent.click(getByText('2'));
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('disables previous button on first page', () => {
        const { getByText } = render(
            <Pagination currentPage={1} totalPages={3} onPageChange={jest.fn()} />
        );

        const prevButton = getByText('← Anterior') as HTMLButtonElement;
        expect(prevButton.disabled).toBe(true);
    });

    it('renders condensed range when many pages', () => {
        const { getByText, queryAllByText } = render(
            <Pagination currentPage={6} totalPages={10} onPageChange={jest.fn()} />
        );

        expect(getByText('1')).toBeInTheDocument();
        expect(getByText('6')).toBeInTheDocument();
        expect(getByText('10')).toBeInTheDocument();
        expect(queryAllByText('...').length).toBeGreaterThan(0);
    });
});

