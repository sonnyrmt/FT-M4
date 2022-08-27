const { Router } = require("express");
const { Op, Character, Role } = require("../db");
const router = Router();

router.post("/", async (req, res) => {
  const { code, name, age, race, hp, mana, date_added } = req.body;

  if (!code || !name || !hp || !mana) {
    return res.status(404).send("Falta enviar datos obligatorios");
  }

  try {
    const character = await Character.create(req.body);
    res.status(201).json(character);
  } catch (error) {
    res.status(404).send("Error en alguno de los datos provistos");
  }
});

// Volvamos a la ruta que habíamos hecho en la parte uno, ahora vamos a agregarle tambien que pueda recibir un age por query y que el filtro sea un AND de ambos campos, es decir que traiga aquellos personajes que tengan la raza dada en race y la edad dada en age.

router.get("/", async (req, res) => {
  const { race, age, value } = req.query;

  const condition = {};
  const where = {};

  if (race) where.race = race;
  if (age) where.age = age;
  if (where) condition.where = where;

  if (!condition) {
    const characters = await Character.findAll();
    return res.json(characters);
  } else {
    const characters = await Character.findAll(condition);
    res.json(characters);
  }
});

router.get("/young", async (req, res) => {
  try {
    const findYoung = await Character.findAll({
      where: {
        age: {
          [Op.lt]: 25,
        },
      },
    });
    res.status(200).send(findYoung);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/:code", async (req, res) => {
  const { code } = req.params;

  const finded = await Character.findByPk(code);
  if (finded) {
    res.send(finded);
  } else {
    res
      .status(404)
      .send(`El código ${code} no corresponde a un personaje existente`);
  }
});

router.put('/addAbilities', async (req,res) => {
  const { codeCharacter, abilities} = req.body;

  const character = await Character.findByPk(codeCharacter);
  const promises = abilities.map( a => character.createAbility(a));
  await Promise.all(promises);
  res.send('OK')

});

router.put("/:attribute", async (req, res) => {
  const { attribute } = req.params;
  const { value } = req.query;

  try {
    await Character.update(
      { [attribute]: value },
      {
        where: {
          [attribute]: { [Op.is]: null },
        },
      }
    );

    res.send("Personajes actualizados");
  } catch (error) {
    res.status(400).send(error);
  }
});



module.exports = router;
