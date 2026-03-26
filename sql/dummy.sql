USE yourDb;
-- =====================
-- Users (passwords are bcrypt hashes of "password123")
-- =====================
INSERT INTO users (id, name, email, password_hash) VALUES
(1, 'Alice Johnson', 'alice@example.com', '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e'),
(2, 'Bob Smith', 'bob@example.com', '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e'),
(3, 'Charlie Brown', 'charlie@example.com', '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e'),
(4, 'Diana Prince', 'diana@example.com', '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e'),
(5, 'Ethan Hunt', 'ethan@example.com', '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e');
