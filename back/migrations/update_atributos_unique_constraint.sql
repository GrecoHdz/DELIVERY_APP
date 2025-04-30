-- Eliminar la restricción de unicidad existente en nombre_atributo
ALTER TABLE Atributos DROP INDEX nombre_atributo;

-- Crear un nuevo índice único compuesto por id_producto y nombre_atributo
ALTER TABLE Atributos ADD CONSTRAINT atributo_producto_nombre_unique UNIQUE (id_producto, nombre_atributo);
