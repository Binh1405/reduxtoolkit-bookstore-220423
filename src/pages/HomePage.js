import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import PaginationBar from "../components/PaginationBar";
import SearchForm from "../components/SearchForm";
import { FormProvider } from "../form";
import { useForm } from "react-hook-form";
import {
  Container,
  Alert,
  Box,
  Card,
  Stack,
  CardMedia,
  CardActionArea,
  Typography,
  CardContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "./bookReducer";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const HomePage = () => {
  const [pageNum, setPageNum] = useState(1);
  const totalPage = 10;
  const limit = 10;
  const isLoading = useSelector((state) => state.book.loading);
  const [query, setQuery] = useState("");
  const errorMessage = useSelector((state) => state.book.error);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const allBooks = useSelector((state) => state.book.books);
  useEffect(() => {
    dispatch(getBooks(pageNum, limit, query));
  }, [dispatch, pageNum, limit, query]);

  const defaultValues = {
    searchQuery: "",
  };
  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit, reset, watch } = methods;

  const filter = watch();
  const { searchQuery } = filter;
  const filterBooks = applyFilter(allBooks, searchQuery);
  console.log("filterBooks", filterBooks);
  const onSubmit = (data) => {
    setQuery(data.searchQuery);
    navigate(`/books/${filterBooks[0]?.id}`);
    reset();
  };
  const handleClickBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };
  return (
    <Container>
      <Stack sx={{ display: "flex", alignItems: "center", m: "2rem" }}>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Book Store
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            mb={2}
          >
            <SearchForm />
          </Stack>
        </FormProvider>
        <PaginationBar
          pageNum={pageNum}
          setPageNum={setPageNum}
          totalPageNum={totalPage}
        />
      </Stack>
      <div>
        {isLoading ? (
          <Box sx={{ textAlign: "center", color: "primary.main" }}>
            <ClipLoader color="inherit" size={150} loading={true} />
          </Box>
        ) : (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-around"
            flexWrap="wrap"
          >
            {filterBooks.length !== 0
              ? filterBooks.map((book) => (
                  <Card
                    key={book.id}
                    onClick={() => handleClickBook(book.id)}
                    sx={{
                      width: "12rem",
                      height: "27rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={`${BACKEND_API}/${book.imageLink}`}
                        alt={`${book.title}`}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {`${book.title}`}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))
              : allBooks?.map((book) => (
                  <Card
                    key={book.id}
                    onClick={() => handleClickBook(book.id)}
                    sx={{
                      width: "12rem",
                      height: "27rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={`${BACKEND_API}/${book.imageLink}`}
                        alt={`${book.title}`}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {`${book.title}`}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
          </Stack>
        )}
      </div>
    </Container>
  );
};

const applyFilter = (books, filter) => {
  let filterBooks = [];
  if (filter && books.length) {
    filterBooks = books.filter(
      (book) =>
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase()) ||
        book.country.toLowerCase().includes(filter.toLowerCase()) ||
        book.language.toLowerCase().includes(filter.toLowerCase())
    );
  }
  return filterBooks;
};

export default HomePage;
