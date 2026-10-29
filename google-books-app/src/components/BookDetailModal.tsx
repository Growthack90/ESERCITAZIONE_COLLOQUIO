import React from 'react';
import type { BookItem } from '../types/books';

interface BookDetailModalProps {
  book: BookItem | null;
  onClose: () => void;
}

const FALLBACK_IMAGE = 'https://placehold.co/400x600/FF5039/FFF?text=Book+Cover';

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  if (!book) return null;

  const { volumeInfo } = book;
  const coverUrl = volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || FALLBACK_IMAGE;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{volumeInfo.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-4">
              <div className="col-md-4 text-center">
                <img
                  src={coverUrl}
                  alt={volumeInfo.title}
                  className="img-fluid rounded shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="col-md-8">
                <h6 className="text-muted">
                  Autori: {volumeInfo.authors?.join(', ') || 'Non indicati'}
                </h6>
                {volumeInfo.publisher && (
                  <p className="small text-secondary mb-1">
                    Editore: {volumeInfo.publisher} {volumeInfo.publishedDate ? `(${volumeInfo.publishedDate})` : ''}
                  </p>
                )}
                {volumeInfo.pageCount && (
                  <p className="small text-secondary mb-2">Pagine: {volumeInfo.pageCount}</p>
                )}
                <hr />
                <h6>Descrizione:</h6>
                <div 
                  className="small" 
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: volumeInfo.description || 'Nessuna descrizione disponibile.' }}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href={volumeInfo.infoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Vedi su Google Books (infoLink)
            </a>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};