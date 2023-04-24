-- Active: 1682307158437@@127.0.0.1@3306
CREATE TABLE
    usuarios (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        criado TEXT DEFAULT(DATETIME('now')) 
    );
    
INSERT INTO usuarios (id,nome,email,senha)
VALUES  ("u1","Tony","tonydorgas@gmail.com","tony01"),
        ("u2","Isazul","isazul@gmail.com","isa01");

DROP TABLE usuarios;

CREATE TABLE
    compras (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        comprador TEXT NOT NULL,
        total REAL NOT NULL,
        criado TEXT DEFAULT(DATETIME('now')),
        pago INTEGER DEFAULT(0),
        FOREIGN KEY (comprador) REFERENCES usuarios(id)
    );

INSERT INTO compras (id,total,criado,pago,comprador)
  VALUES  ("c1",15.00,datetime("now"),1,"u01"),
          ("c2",22.00,datetime("now"),0,"u01"),
          ("c3",35.00,datetime("now"),0,"u02");
    
DROP TABLE compras;

CREATE TABLE
    produtos (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        valor REAL NOT NULL,
        descricao TEXT NOT NULL,
        img TEXT NOT NULL
    );
    
INSERT INTO produtos
VALUES  ("p1","Mouse", 72.00,"Periféricos","https://http2.mlstatic.com/D_NQ_NP_2X_832302-MLB50910246163_072022-F.webp"),
        ("p2", "HeadSet", 230.00, "Periféricos","https://i.dell.com/is/image/DellContent//content/dam/images/products/electronics-and-accessories/dell/headphones/wl5022/wl5022-xau-02-bk.psd?fmt=pjpg&pscan=auto&scl=1&hei=402&wid=406&qlt=100,1&resMode=sharp2&size=406,402&chrss=full");

DROP TABLE produtos;

CREATE TABLE
    compras_produtos(
        compra_id TEXT NOT NULL,
        produto_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (compra_id) REFERENCES compras(id),
        FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );

INSERT INTO
    compras_produtos
VALUES ('c1', 'p1', 1),
       ('c1', 'p1', 1),
       ('c2', 'p2', 1),
       ('c2', 'p2', 1);
       
Drop TABLE compras_produtos;