const guard = require("../../guard");
const { Card } = require("./card.model");
const { CardValid } = require("./cards.joi");
const { getLoggedUserId } = require("../../config");
const { User } = require("../user/user.model");

module.exports = app => {
    const isCardMine = async (cardId, req, res) => {
        const user_id = getLoggedUserId(req, res);
        const card = await Card.findOne({ _id: cardId, user_id });

        return Boolean(card);
    }

    app.get('/cards', async (req, res) => {
        const cards = await Card.find();
        res.send(cards);
    });

    app.get('/cards/my-cards', guard, async (req, res) => {
        const user_id = getLoggedUserId(req, res);
        const myCards = await Card.find({ user_id });
        res.send(myCards);
    });

    app.get('/cards/:id', guard, async (req, res) => {
        const card = await Card.findOne({ _id: req.params.id });

        if (!card) {
            return res.status(403).send("Card not found");
        }

        res.send(card);
    });

    app.post('/cards', guard, async (req, res) => {
        const { title, subtitle, description, phone, email, web, image, address } = req.body;

        const validate = CardValid.validate(req.body, { abortEarly: false });

        const user_id = getLoggedUserId(req, res);
        const user = await User.findById(user_id);

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }

        if (!user.isBusiness) {
            return res.status(401).send('User not authorized');
        };

        const card = new Card({ title, subtitle, description, phone, email, web, image, address, user_id });

        const newCard = await card.save();

        res.send(newCard);
    });

    app.put('/cards/:id', guard, async (req, res) => {
        const { title, subtitle, description, phone, email, web, image, address } = req.body;

        const validate = CardValid.validate(req.body, { abortEarly: false });

        const user_id = getLoggedUserId(req, res);

        if (validate.error) {
            const errors = validate.error.details.map(err => err.message);
            return res.status(403).send(errors);
        }

        if (!await isCardMine(req.params.id, req, res)) {
            return res.status(401).send("User not authorized");
        }

        const editedCard = await Card.findByIdAndUpdate(req.params.id, { title, subtitle, description, phone, email, web, image, address })

        if (!editedCard) {
            return res.status(403).send("Product not found");
        }

        res.send(editedCard);
    })

    app.patch('/cards/:id', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);

        if (!userId) {
            return res.status(401).send('User not authorized');
        };

        const card = await Card.findById(req.params.id);

        const isLiked = card.likes.includes(userId);

        if (!isLiked) {
            card.likes.push(userId);
        }

        await card.save();
        res.send(card);

    })

    app.delete('/cards/:id', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);
        const user = await User.findById(userId);

        if (!await isCardMine(req.params.id, req, res) && !user?.isAdmin) {
            return res.status(401).send('User not authorized');
        }

        try {
            await Card.findByIdAndDelete(req.params.id);
        } catch (err) {
            return res.status(403).send("Card not found");
        }

        res.send();
    })

}