import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../api/apiService";
import { current } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  singleBook: {},
  readingBooks: [],
  error: "",
  loading: false,
};

export const getBooks = createAsyncThunk(
  "book/getBooks",
  async (pageNum, limit, query) => {
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const res = await apiService.get(url);
    return res.data;
  }
);

export const getReadingBooks = createAsyncThunk(
  "readingBooks/getReadingBooks",
  async () => {
    const res = await apiService.get(`/favorites`);
    console.log("res", res);
    return res.data;
  }
);

export const addReadingBooks = createAsyncThunk(
  "book/addReadingBooks",
  async (book) => {
    const res = await apiService.post("/favorites", book);
    toast.success("The book has been added to the reading list!");
    console.log("res", res);
    return res.data;
  }
);

export const removeReadingBooks = createAsyncThunk(
  "book/removeReadingBooks",
  async (bookId, { dispatch }) => {
    const res = await apiService.delete(`/favorites/${bookId}`);
    toast.success("The book has been removed");
    dispatch(getReadingBooks());
    console.log("data", res.data);
    return res.data;
  }
);

export const getSingleBook = createAsyncThunk(
  "book/getSingleBook",
  async (bookId) => {
    const res = await apiService.get(`/books/${bookId}`);
    console.log("res", res);
    return res.data;
  }
);

export const bookSlice = createSlice({
  name: "books",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(removeReadingBooks.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(removeReadingBooks.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        const newReadingBooks = state.readingBooks.filter(
          (book) => book.id !== action.payload
        );
        console.log("newReadingBooks", newReadingBooks);
        state.readingBooks = newReadingBooks;
      })
      .addCase(removeReadingBooks.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
        state.loading = false;
      });
    builder
      .addCase(getReadingBooks.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getReadingBooks.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.readingBooks = action.payload;
      })
      .addCase(getReadingBooks.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
        state.loading = false;
      });
    builder
      .addCase(addReadingBooks.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(addReadingBooks.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.readingBooks.push(action.payload);
      })
      .addCase(addReadingBooks.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(getSingleBook.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getSingleBook.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.singleBook = action.payload;
      })
      .addCase(getSingleBook.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(getBooks.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.status = "idle";
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bookSlice.reducer;
