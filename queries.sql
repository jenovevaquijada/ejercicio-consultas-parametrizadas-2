DROP TABLE IF EXISTS clientes_01;

CREATE TABLE clientes_01 (
  rut    VARCHAR(20) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  edad   INT NOT NULL
);

INSERT INTO clientes_01 (rut, nombre, edad) VALUES 
('11.111.111-1', 'Jeno Creativa', 28),
('22.222.222-2', 'Soporte Tech', 35);