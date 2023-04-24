"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("./dados/knex");
const errorMessage = "Erro Inesperado";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield knex_1.db.raw(`
    SELECT * FROM purchases
  `);
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (error.statuCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("users");
        if (result.length < 1) {
            res.status(404);
            throw new Error("Não existem usuarios criados");
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, email, password } = req.body;
        const verify = yield (0, knex_1.db)("users").where({ id });
        if (verify.length > 0) {
            res.status(404);
            throw new Error("Id do usuário já está em uso");
        }
        const result = yield (0, knex_1.db)("users").insert({
            id,
            name: name,
            email: email,
            password: password,
        });
        res.status(200).send(`Usuario cadastrado com sucesso`);
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, price, description, image_url } = req.body;
        const verify = yield (0, knex_1.db)("products").where({ id });
        if (verify.length > 0) {
            res.status(404);
            throw new Error("Id do produto já está em uso");
        }
        else {
            yield (0, knex_1.db)("products").insert({
                id,
                name: name,
                price: price,
                description: description,
                image_url: image_url,
            });
        }
        res.status(200).send("Produto cadastrado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("products");
        if (result.length < 1) {
            res.status(404);
            throw new Error("Não existem produtos criados.");
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/products/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name;
        const result = yield knex_1.db
            .select("*")
            .from("products")
            .whereRaw("LOWER(name) like ?", [`%${name.toLowerCase()}%`]);
        if (result.length === 0) {
            res.status(404);
            throw new Error("Produto não encontrado");
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro Inesperado");
        }
    }
}));
app.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, price, description, image_url } = req.body;
        const [verify] = yield knex_1.db.select("*").from("products").where({ id });
        if (verify) {
            yield (0, knex_1.db)("products")
                .where({ id })
                .update({
                id: id || verify.id,
                name: name || verify.name,
                price: price || verify.price,
                description: description || verify.description,
                image_url: image_url || verify.image_url,
            });
        }
        res.status(200).send("Produto editado com sucesso!");
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.post("/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, totalPrice, buyerId } = req.body;
        const verify = yield (0, knex_1.db)("purchases").where({ id });
        if (verify.length > 0) {
            res.status(404);
            throw new Error("Id da compra já está em uso");
        }
        else {
            yield (0, knex_1.db)("purchases").insert({
                id,
                total_price: totalPrice,
                buyer_id: buyerId,
            });
        }
        res.status(200).send("Purchase cadastrada com sucesso");
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.delete("/purchases/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const verify = yield (0, knex_1.db)("purchases").where({
            id: id,
        });
        if (verify.length < 0) {
            res.status(404);
            throw new Error("Compra não cadastrada");
        }
        yield (0, knex_1.db)("purchases").del().where({
            id: id,
        });
        res.status(200).send("Compra deletada com sucesso.");
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/purchases/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const verify = yield (0, knex_1.db)("purchases").where({
            id: id,
        });
        if (verify.length < 1) {
            res.status(400);
            throw new Error("Compra inexistente!");
        }
        const result = yield (0, knex_1.db)("purchases")
            .select()
            .where({
            "purchases.id": id,
        })
            .innerJoin("users", "purchases.buyer_id", "=", "users.id");
        const produtos = yield (0, knex_1.db)("purchases_products")
            .select()
            .where({
            purchase_id: id,
        })
            .innerJoin("products", "purchases_products.product_id", "=", "products.id");
        const compra = Object.assign(Object.assign({}, result), { produtos: produtos });
        res.status(200).send(compra);
    }
    catch (error) {
        console.log(error);
        if (error.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
//# sourceMappingURL=index.js.map