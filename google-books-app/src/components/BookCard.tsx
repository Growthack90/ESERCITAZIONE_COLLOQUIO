import React from 'react';
import type { BookItem } from '../types/books'; 

interface BookCardProps {
  book: BookItem;
  onSelect: (book: BookItem) => void;
}

const FALLBACK_IMAGE = 'https://placehold.co/400x600/FF5039/FFF?text=Book+Cover';

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  const { volumeInfo } = book;
  const coverUrl = volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || FALLBACK_IMAGE;

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div 
        className="card h-100 shadow-sm cursor-pointer" 
        style={{ cursor: 'pointer' }}
        onClick={() => onSelect(book)}
      >
        <div style={{ height: '260px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
          <img
            src={coverUrl}
            alt={volumeInfo.title}
            className="card-img-top w-100 h-100"
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate mb-1" title={volumeInfo.title}>
            {volumeInfo.title}
          </h6>
          <small className="text-muted mb-2">
            {volumeInfo.authors?.join(', ') || 'Autore sconosciuto'}
          </small>
          <p className="card-text text-secondary small line-clamp-2 mt-auto">
            {volumeInfo.description || 'Nessuna descrizione disponibile.'}
          </p>
        </div>
      </div>
    </div>
  );
};