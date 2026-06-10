USE yourDb;
-- =====================
-- Users (passwords are bcrypt hashes of "password123")
-- =====================
INSERT INTO users (id, name, email, password_hash) VALUES
('019ee8a4-f640-7000-8a00-000000000001', 'Alice Johnson',  'alice@example.com',   '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e'),
('019ee8a4-f641-7000-8a00-000000000002', 'Bob Smith',      'bob@example.com',     '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e'),
('019ee8a4-f642-7000-8a00-000000000003', 'Charlie Brown',  'charlie@example.com', '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e'),
('019ee8a4-f643-7000-8a00-000000000004', 'Diana Prince',   'diana@example.com',   '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e'),
('019ee8a4-f644-7000-8a00-000000000005', 'Ethan Hunt',     'ethan@example.com',   '$2b$10$xJwG5OqDhWZKQrOYRiSzMeKj1F8OKZQh0FqYdCEGzG0vN5b1L0X3e');
