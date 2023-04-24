import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./dados/knex";

const app = express();
app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});
app.use(express.json());
app.use(cors());

app.get("/users", async (req: Request, res: Response) => {
  try {
    const retorno = await db("usuarios");
    if (retorno.length < 1) {
      res.status(404);
      throw new Error("Usuario não existe");
    }
    res.status(200).send(retorno);
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, nome, email, senha } = req.body;
    const consulta = await db("usuarios").where({ id });
    const consultaEmail = await db("usuarios").where({email})

    if (consulta.length > 0) {
      res.status(404);
      throw new Error("Este Id de usuário já existe");
    }
    if(consultaEmail.length> 0){
      res.status(404);
      throw new Error("Este email de usuário já existe");
    }

     await db("usuarios").insert({
      id,
      nome: nome,
      email: email,
      senha: senha,
    });

    res.status(200).send(`Usuario Cadastrado`);
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, nome, valor, descricao, img } = req.body;
    const consulta = await db("produtos").where({ id });

    if (consulta.length > 0) {
      res.status(404);
      throw new Error("Este id de produto já existe");
    } else {
      await db("produtos").insert({
        id,
        nome: nome,
        valor: valor,
        descricao: descricao,
        img: img,
      });
    }
    res.status(200).send("Produto cadastrado");
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const retorno = await db("produtos");
    if (retorno.length < 1) {
      res.status(404);
      throw new Error("Não há produtos disponíveis");
    }
    res.status(200).send(retorno);
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const nome = req.query.nome as string;
    const retorno = await db
      .select("*")
      .from("produtos")
      .whereRaw("LOWER(nome) like ?", [`%${nome.toLowerCase()}%`]);
    if (retorno.length === 0) {
      res.status(404);
      throw new Error("Este produto não está disponível");
    }
    res.status(200).send(retorno);
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id, nome, valor, descricao, img } = req.body;

    const [consulta] = await db.select("*").from("produtos").where({ id });
    if (consulta) {
      await db("produtos")
        .where({ id })
        .update({
          id: id || consulta.id,
          nome: nome || consulta.nome,
          valor: valor || consulta.valor,
          descricao: descricao || consulta.descricao,
          img: img || consulta.img,
        });
    }else{
      res.status(404)
      throw new Error("Este produto não pode ser alterado");
      
    }

    res.status(200).send("Produto alterado");
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, total, comprador } = req.body;
    const consulta = await db("compras").where({ id });

    if (consulta.length > 0) {
      res.status(404);
      throw new Error("Este id de compra já está em uso");
    } else {
      await db("compras").insert({
        id,
        total: total,
        comprador: comprador,
      });
    }
    res.status(200).send("Compra cadastrada");
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const consulta = await db("compras").where({
      id: id,
    });
    if (consulta.length < 0) {
      res.status(404);
      throw new Error("Esta compra não está disponível");
    }

    await db("compras").del().where({
      id: id,
    });
    res.status(200).send("Compra deletada.");
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const consulta = await db("compras").where({
      id: id,
    });
    if (consulta.length < 1) {
      res.status(400);
      throw new Error("Esta compra não está disponível");
    }
    const retorno = await db("compras")
      .select()
      .where({
        "compras.id": id,
      })
      .innerJoin("usuarios", "compras.comprador", "=", "usuarios.id");
    const produtos = await db("compras_produtos")
      .select()
      .where({
        compra_id: id,
      })
      .innerJoin(
        "produtos",
        "compras_produtos.produto_id",
        "=",
        "produtos.id"
      );

    const compra = {
      ...retorno,
      produtos: produtos,
    };
    res.status(200).send(compra);
  } catch (error: any) {
    console.log(error);
    if (error.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});

app.get("/purchases", async (req: Request, res: Response) => {
  try {
    const retorno = await db("compras");
    res.status(200).send(retorno);
  } catch (error: any) {
    console.log(error);
    if (error.statuCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Um erro inesperado ocorreu");
    }
  }
});