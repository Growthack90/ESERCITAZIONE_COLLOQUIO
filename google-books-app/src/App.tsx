import React from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setSearchTerm, setCurrentPage, setMaxResults, setSelectedBook } from './store/bookSlice';
import { useGetBooksQuery } from './services/booksApi';
import { useDebounce } from './hooks/useDebounce';
import { BookCard } from './components/BookCard';
import { BookDetailModal } from './components/BookDetailModal';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, currentPage, maxResults, selectedBook } = useAppSelector((state) => state.booksUi);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const startIndex = (currentPage - 1) * maxResults;

  // Query eseguita solo se c'è testo da cercare
  const { data, error, isFetching } = useGetBooksQuery(
    {
      query: debouncedSearch,
      startIndex,
      maxResults,
    },
    {
      skip: debouncedSearch.trim() === '',
    }
  );

  const books = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / maxResults);

  return (
    <div className="container py-4">
      <header className="mb-4 text-center">
        <h1 className="fw-bold">Google Books Finder</h1>
        <p className="text-muted">SPA con React, Redux Toolkit, RTK Query e TypeScript</p>
      </header>

      {/* Controlli di ricerca e paginazione */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Scrivi per cercare (live search)..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-md-end gap-2">
          <label htmlFor="limitSelect" className="text-nowrap small fw-bold">Elementi per pagina:</label>
          <select
            id="limitSelect"
            className="form-select w-auto"
            value={maxResults}
            onChange={(e) => dispatch(setMaxResults(Number(e.target.value)))}
          >
            {[5, 10, 15, 20].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Caricamento */}
      {isFetching && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      )}

      {/* Gestione Errori */}
      {error && !isFetching && (
        <div className="alert alert-danger text-center">
          Si è verificato un errore durante il recupero dei dati da Google Books API.
        </div>
      )}

      {/* Risultati */}
      {!isFetching && !error && books.length > 0 && (
        <>
          <div className="row">
            {books.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onSelect={(b) => dispatch(setSelectedBook(b))} 
              />
            ))}
          </div>

          {/* Barra di Paginazione */}
          <nav className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
            <span className="small text-muted">
              Pagina {currentPage} di {totalPages > 0 ? totalPages : 1} ({totalItems} libri trovati)
            </span>
            <div className="btn-group">
              <button
                className="btn btn-outline-primary"
                disabled={currentPage <= 1 || isFetching}
                onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))}
              >
                &laquo; Precedente
              </button>
              <button
                className="btn btn-outline-primary"
                disabled={currentPage >= totalPages || books.length < maxResults || isFetching}
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
              >
                Successivo &raquo;
              </button>
            </div>
          </nav>
        </>
      )}

      {/* Nessun risultato */}
      {!isFetching && !error && debouncedSearch && books.length === 0 && (
        <div className="alert alert-warning text-center mt-4">
          Nessun libro trovato per "{debouncedSearch}".
        </div>
      )}

      {/* Modale Dettagli */}
      <BookDetailModal 
        book={selectedBook} 
        onClose={() => dispatch(setSelectedBook(null))} 
      />
    </div>
  );
};

export default App;