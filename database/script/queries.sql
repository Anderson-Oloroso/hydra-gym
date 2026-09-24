-- ================= HU =================00
SELECT * FROM clientes WHERE id_cliente = 3;

SELECT * FROM clientes WHERE dpi = '2541987650101';

SELECT * FROM clientes WHERE nombre LIKE '%al%' OR apellido LIKE '%an%';

DELETE FROM clientes WHERE id_cliente = 3;

UPDATE clientes SET nombre = 'Alondra', correo = 'alondra.garcia@gmail.com' WHERE id_cliente = 2;

SELECT * FROM clientes WHERE activo = TRUE;

SELECT * FROM plan_entrenamiento WHERE activo = TRUE;

UPDATE clientes SET activo = false WHERE id_cliente = 1;
