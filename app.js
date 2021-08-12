require("dotenv").config();
require("colors");

const {
  showMenu,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busqueda");

console.log(process.env);

const main = async () => {
  let opt;
  const busquedas = new Busquedas();
  do {
    opt = await showMenu();

    switch (opt) {
      case 1:
        const ciudad = await leerInput("Ciudad: ");
        const lugares = await busquedas.buscarCiudad(ciudad);
        const idLugar = await listarLugares(lugares);
        if (idLugar === "0") continue;
        const LugarElegido = lugares.find((lugar) => lugar.id === idLugar);
        busquedas.guardarLugar(LugarElegido.name);
        const lugarTemp = await busquedas.buscarClimaLugar(
          LugarElegido.lat,
          LugarElegido.lon
        );

        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad:", LugarElegido.name.green);
        console.log("Latitud:", LugarElegido.lat.toString().brightYellow);
        console.log("Longitud:", LugarElegido.lon.toString().brightYellow);
        console.log("Temperatura:", lugarTemp.temp.toString().brightYellow);
        console.log("Mínima:", lugarTemp.min.toString().brightYellow);
        console.log("Máxima:", lugarTemp.max.toString().brightYellow);
        console.log("Descripción del clima:", lugarTemp.desc.green);
        break;

      case 2:
        busquedas.historialCapitalize.forEach((lugar, i) => {
          const index = `${i + 1}.`.green;
          console.log(`${index} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
