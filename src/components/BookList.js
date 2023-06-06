import React, { useState, useEffect } from 'react';

const BookList = () => {
  const [books, setBooks] = useState([]);

  // Получение списка книг из localStorage при загрузке компонента
  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('bookList') || '[]');
    setBooks(storedBooks);
  }, []);

  // Сохранение списка книг в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('bookList', JSON.stringify(books));
  }, [books]);

  const addBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const updateBook = (updatedBook) => {
    setBooks(
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  const BookForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState(['']);
    const [genre, setGenre] = useState('');
    const [pages, setPages] = useState('');
    const [cover, setCover] = useState('');

    const handleSubmit = (event) => {
      event.preventDefault();
      // Генерация уникального id для новой книги
      const id = Date.now().toString();
      onSubmit({
        id,
        title,
        author: authors.join(', '),
        genre,
        pages,
        cover,
        status: 'буду читать',
        readPages: 0,
      });
      // Сброс формы после отправки
      setTitle('');
      setAuthors(['']);
      setGenre('');
      setPages('');
      setCover('');
    };

    const handleAuthorChange = (event, index) => {
      const newAuthors = [...authors];
      newAuthors[index] = event.target.value;
      setAuthors(newAuthors);
    };

    const addAuthorField = () => {
      setAuthors([...authors, '']);
    };

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="title" className="text-lg font-medium">
          Название книги:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {authors.map((author, index) => (
          <div key={index} className="flex flex-col gap-4">
            <label htmlFor={`author${index + 1}`} className="text-lg font-medium">
              Автор {index + 1}:
            </label>
            <input
              type="text"
              id={`author${index + 1}`}
              value={author}
              onChange={(event) => handleAuthorChange(event, index)}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addAuthorField}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Добавить автора
        </button>
        <label htmlFor="genre" className="text-lg font-medium">
          Жанр:
        </label>
        <input
          type="text"
          id="genre"
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <label htmlFor="pages" className="text-lg font-medium">
          Количество страниц:
        </label>
        <input
          type="number"
          id="pages"
          value={pages}
          onChange={(event) => setPages(event.target.value)}
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <label htmlFor="cover" className="text-lg font-medium">
          Обложка:
        </label>
        <input
          type="file"
          id="cover"
          accept="image/*"
          onChange={(event) =>
            setCover(URL.createObjectURL(event.target.files[0]))
          }
          className="py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Добавить
        </button>
      </form>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-medium">Список книг</h2>
      {books.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <li key={book.id} className="border border-gray-300 rounded-md p-4">
              <h3 className="text-xl font-medium">{book.title}</h3>
              <p className="text-lg font-medium">Автор: {book.author}</p>
              <p className="text-lg font-medium">Жанр: {book.genre}</p>
              <p className="text-lg font-medium">Количество страниц: {book.pages}</p>
              <p className="text-lg font-medium">Статус: {book.status}</p>
              <img
                src={book.cover}
                alt={`Обложка книги "${book.title}"`}
                className="w-full h-auto"
              />
              <button
                onClick={() => deleteBook(book.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Удалить
              </button>
              <button
                onClick={() => updateBook({ ...book, status: 'читаю' })}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Читаю
              </button>
              <button
                onClick={() =>
                  updateBook({ ...book, status: 'буду читать' })
                }
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Буду читать
              </button>
              {book.status === 'читаю' && (
                <p className="text-lg font-medium">
                  Прочитано страниц: {book.readPages}/{book.pages} (
                  {Math.round((book.readPages / book.pages) * 100)}%)
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg font-medium">Список книг пуст</p>
      )}
      <h2 className="text-2xl font-medium">Добавить книгу</h2>
      <BookForm onSubmit={addBook} />
    </div>
  );
};

export default BookList;
