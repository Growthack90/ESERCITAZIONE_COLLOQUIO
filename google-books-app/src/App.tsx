import React, { useState, useEffect } from 'react';
import type { BookItem, BooksApiResponse } from './types/books';
import { useDebounce } from './hooks/useDebounce';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';

export const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setBooks([]);
      setTotalItems(0);
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      const startIndex = (page - 1) * limit;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        debouncedSearch
      )}&startIndex=${startIndex}&maxResults=${limit}`;

      try {
        const res = await fetch(url);
        const data: BooksApiResponse = await res.json();
        setBooks(data.items || []);
        // Google Books a volte restituisce valori elevati non accessibili: limitiamo il calcolo
        setTotalItems(data.totalItems || 0);
      } catch (err) {
        console.error('Errore durante la chiamata API:', err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch, page, limit]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="container py-4">
      <header className="mb-4 text-center">
        <h1 className="fw-bold">Google Books Finder</h1>
        <p className="text-muted">Cerca libri in tempo reale tramite Google Books API</p>
      </header>

      {/* Controlli di ricerca e paginazione */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Scrivi per cercare (live search)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-md-end gap-2">
          <label htmlFor="limitSelect" className="text-nowrap small fw-bold">Elementi per pagina:</label>
          <select
            id="limitSelect"
            className="form-select w-auto"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stato Caricamento */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      )}

      {/* Risultati */}
      {!loading && books.length > 0 && (
        <>
          <div className="row">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} />
            ))}
          </div>

          {/* Paginatore */}
          <nav className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
            <span className="small text-muted">
              Pagina {page} di {totalPages > 0 ? totalPages : 1} ({totalItems} risultati totali)
            </span>
            <div className="btn-group">
              <button
                className="btn btn-outline-primary"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                &laquo; Precedente
              </button>
              <button
                className="btn btn-outline-primary"
                disabled={page >= totalPages || books.length < limit}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Successivo &raquo;
              </button>
            </div>
          </nav>
        </>
      )}

      {/* Stato Nessun Risultato */}
      {!loading && debouncedSearch && books.length === 0 && (
        <div className="alert alert-warning text-center mt-4">
          Nessun libro trovato per "{debouncedSearch}".
        </div>
      )}

      {/* Dettaglio modale */}
      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
};

export default App;