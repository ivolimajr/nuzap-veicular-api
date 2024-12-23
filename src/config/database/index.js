import Sequelize from "sequelize";
import dbConfig from "./database.js";
import Veiculo from "../../app/models/Veiculo.js";
import Pedido from "../../app/models/Pedido.js";
import Log from "../../app/models/Log.js";
import Debito from "../../app/models/Debito.js";

const models = [Veiculo, Log, Pedido, Debito];

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
