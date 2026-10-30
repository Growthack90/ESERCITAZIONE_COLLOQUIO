import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { BookItem } from "../types/books";

interface BooksState {
  searchTerm: string;
  currentPage: number;
  maxResults: number;
  selectedBook: BookItem | null;
}

const initialState: BooksState = {
  searchTerm: "",
  currentPage: 1,
  maxResults: 10,
  selectedBook: null,
};

export const bookSlice = createSlice({
  name: "booksUi",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset alla prima pagina ad ogni nuova ricerca
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setMaxResults: (state, action: PayloadAction<number>) => {
      state.maxResults = action.payload;
      state.currentPage = 1;
    },
    setSelectedBook: (state, action: PayloadAction<BookItem | null>) => {
      state.selectedBook = action.payload;
    },
  },
});

export const { setSearchTerm, setCurrentPage, setMaxResults, setSelectedBook } =
  bookSlice.actions;
export default bookSlice.reducer;
