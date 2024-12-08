import Sequelize from "sequelize";
import dbConfig from "./database.js";
import User from "../../app/models/User.js";
import Carro from "../../app/models/./Carro.js";
import Pedido from "../../app/models/Pedido.js";
import Debito from "../../app/models/Debito.js";
import Log from "../../app/models/Log.js";

const models=[
  User,
  Carro,
  Pedido,
  Debito,
  Log,
]

async function initModels(connection) {
  for (const model of models) {
    model.init(connection);
  }

  for (const model of models) {
    if (model.associate) {
      model.associate(connection.models);
    }
  }
}

const connection = await new Sequelize(dbConfig);
console.log(dbConfig.database);

await initModels(connection);

export default connection;
