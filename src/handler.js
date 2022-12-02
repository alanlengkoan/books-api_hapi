const {
    nanoid
} = require('nanoid');
const books = require('./books');

// untuk handle tambah books
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });

        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// untuk handle menampilkan semua books
const getAllBooksHandler = (request, h) => {
    const {
        reading,
        finished,
        name
    } = request.query;

    if (reading) {
        if (reading === '1') {
            const response = h.response({
                status: 'success',
                data: {
                    books: books.filter((book) => book.reading === true),
                },
            });
            response.code(200);
            return response;
        } else if (reading === '0') {
            const response = h.response({
                status: 'success',
                data: {
                    books: books.filter((book) => book.reading === false),
                },
            });
            response.code(200);
            return response;
        }
    } else if (finished) {
        if (finished === '1') {
            const response = h.response({
                status: 'success',
                data: {
                    books: books.filter((book) => book.finished === true),
                },
            });
            response.code(200);
            return response;
        } else if (finished === '0') {
            const response = h.response({
                status: 'success',
                data: {
                    books: books.filter((book) => book.finished === false),
                },
            });
            response.code(200);
            return response;
        }
    } else if (name) {
        const response = h.response({
            status: 'success',
            data: {
                books: books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())),
            },
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'success',
            data: {
                books
            },
        });
        response.code(200);
        return response;
    }
};

// untuk handle menampilkan books berdasarkan id
const getBooksByIdHandler = (request, h) => {
    const {
        id
    } = request.params;

    const note = books.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// untuk handle ubah books berdasarkan id
const editBooksByIdHandler = (request, h) => {
    const {
        id
    } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((note) => note.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// untuk handle hapus books berdasarkan id
const deleteBooksByIdHandler = (request, h) => {
    const {
        id
    } = request.params;

    const index = books.findIndex((note) => note.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler
};