const { Router } = require('express');
const { Ability , Character} = require('../db');
const router = Router();

router.post('/', async (req,res) => {
    const { name, mana_cost } = req.body;

    if(!name || !mana_cost) {
        return res.status(404).send("Falta enviar datos obligatorios");
    }

    const ability = await Ability.create(req.body)
    res.status(201).json(ability);
});

router.put('/setCharacter', async (req, res) => {
    const {idAbility, codeCharacter} = req.body;

    const ability = await Ability.findByPk(idAbility);
    await ability.setCharacter(codeCharacter);
    res.json(ability)

});

module.exports = router;