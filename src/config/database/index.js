import Sequelize from "sequelize";
import dbConfig from "./database.js";
import Veiculo from "../../app/models/Veiculo.js";
import Log from "../../app/models/Log.js";

const models = [Veiculo, Log];

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
