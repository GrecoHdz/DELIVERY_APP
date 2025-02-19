const ValorAtributo = require("../models/ValorAtributo");

// Obtener todos los valores de atributos
const getValoresAtributos = async (req, res) => {
  try {
    const valoresAtributos = await ValorAtributo.findAll();
    res.json(valoresAtributos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los valores de atributos", error });
  }
};

// Obtener un valor de atributo por su ID
const getValorAtributoById = async (req, res) => {
  try {
    const valorAtributo = await ValorAtributo.findByPk(req.params.id);
    if (!valorAtributo) {
      return res.status(404).json({ message: "Valor de atributo no encontrado" });
    }
    res.json(valorAtributo);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el valor de atributo", error });
  }
};

// Crear un nuevo valor de atributo
const createValorAtributo = async (req, res) => {
  const { id_atributo, valor } = req.body;

  try {
    const valorAtributo = await ValorAtributo.create({
      id_atributo,
      valor,
    });

    res.status(201).json({ message: "Valor de atributo creado exitosamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El atributo no existe" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El valor ya está registrado para este atributo" });
    }
    res.status(500).json({ message: "Error al crear el valor de atributo", error });
  }
};

// Actualizar un valor de atributo
const updateValorAtributo = async (req, res) => {
  const { id } = req.params;
  const { id_atributo, valor } = req.body;

  try {
    const valorAtributo = await ValorAtributo.findByPk(id);
    if (!valorAtributo) {
      return res.status(404).json({ message: "Valor de atributo no encontrado" });
    }

    await valorAtributo.update({
      id_atributo,
      valor,
    });

    res.status(200).json({ message: "Valor de atributo actualizado correctamente" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "El atributo no existe" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "El valor ya está registrado para este atributo" });
    }
    res.status(500).json({ message: "Error al actualizar el valor de atributo", error });
  }
};

// Eliminar un valor de atributo
const deleteValorAtributo = async (req, res) => {
  try {
    const valorAtributo = await ValorAtributo.findByPk(req.params.id);
    if (!valorAtributo) {
      return res.status(404).json({ message: "Valor de atributo no encontrado" });
    }

    await valorAtributo.destroy();
    res.status(200).json({ message: "Valor de atributo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el valor de atributo", error });
  }
};

module.exports = {
  getValoresAtributos,
  getValorAtributoById,
  createValorAtributo,
  updateValorAtributo,
  deleteValorAtributo,
};