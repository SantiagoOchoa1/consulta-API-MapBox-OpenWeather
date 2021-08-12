const inquirer = require("inquirer");
require("colors");

const question = [
  {
    type: "list",
    name: "menuPrincipal",
    message: "seleccione una opcion",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar Ciudad`,
      },
      {
        value: 2,
        name: `${"2.".green} Historial`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

const showMenu = async () => {
  console.clear();
  console.log("============================");
  console.log("   Seleccione una opción");
  console.log("============================");

  const { menuPrincipal } = await inquirer.prompt(question);
  return menuPrincipal;
};

const pausa = async () => {
  return await inquirer.prompt([
    {
      type: "input",
      name: "pausa",
      message: `Presione ${"ENTER".green} para continuar`,
    },
  ]);
};

const leerInput = async (message = "") => {
  const { lectura } = await inquirer.prompt([
    {
      type: "input",
      name: "lectura",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Debe ingresar un valor";
        }
        return true;
      },
    },
  ]);
  return lectura;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: lugar.id,
      name: `${index} ${lugar.name}`,
    };
  });
  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });

  const { id } = await inquirer.prompt({
    type: "list",
    name: "id",
    message: "Elija el lugar",
    choices,
  });
  return id;
};

const confirmar = async (message) => {
  const { confirmation } = await inquirer.prompt({
    type: "confirm",
    name: "confirmation",
    message,
  });
  return confirmation;
};

const completarTareas = async (tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: tarea.id,
      name: `${index} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false,
    };
  });
  const { ids } = await inquirer.prompt({
    type: "checkbox",
    name: "ids",
    message: "Tareas para completar",
    choices,
  });
  return ids;
};

module.exports = {
  showMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  completarTareas,
};
