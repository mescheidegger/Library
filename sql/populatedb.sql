CREATE TABLE books
(
	ID int NOT NULL identity(1,1) PRIMARY KEY, 
	title nvarchar(255),
	author nvarchar(255)
)

INSERT INTO books 
(title, author)
VALUES
('myBook', 'myAuthor'),
('Childhood', 'Lev Nikolayevich Tolstoy'),
('Life On The mississippi', 'Mark Twain'),
('The Wind in the Willows', 'Kenneth Grahame'),
('The Dark World', 'Henry Kuttnet'),
('A Journey into the Center of the Earth','Jules Verne')

CREATE TABLE users
(
    ID int NOT NULL identity(1,1) PRIMARY KEY,
    username nvarchar(255),
    CONSTRAINT UC_Username UNIQUE(username),
    password nvarchar(255)
)