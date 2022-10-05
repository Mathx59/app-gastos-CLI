const prompts = require("prompts");
const expensesData = require("./expensesData");
const colors = require("colors");

console.log(" ***** ************* ***** ".bgBrightBlue);
console.log(" ***** APP DE GASTOS ***** ".bgBrightBlue);
console.log(" ***** ************* ***** ".bgBrightBlue);

const mainMenu = async () => {
  const commandSelected = await prompts({
    type: "select",
    name: "value",
    message: "Opciones".inverse,
    choices: [
      {
        title: "Registrar Nuevo Gasto",
        description: "Agrega un nuevo gasto a la lista",
        value: "register",
      },
      {
        title: "Gestionar Gastos",
        description: "Ver y Borrar gastos realizados",
        value: "list",
      },
      {
        title: "Total Gastos",
        description: "Ver el importe total de gastos",
        value: "expensesTotal",
      },
      {
        title: "Salir de la App".rainbow,
        description: "Bye, bye",
        value: "bye",
      },
    ],
    initial: 0,
  });

  if (commandSelected.value == "bye") {
    return;
  }

  if (commandSelected.value == "expensesTotal") {
    let totalValue = 0;
    const expenses = await expensesData.getData();

    for (let i = 0; i < expenses.length; i++) {
      let formatPrice = expenses[i].description;
      formatPrice = formatPrice.replace(/[$.]/g, "");
      const price = parseInt(formatPrice);
      totalValue = totalValue + price;
    }
    console.log(
      " El importe total de tus gastos es de: ".green + "$" + totalValue
    );
    console.log("Volviendo al menú...".yellow);
    setTimeout(() => {
      mainMenu();
    }, 5000);
  }

  if (commandSelected.value == "register") {
    const expenseData = await prompts([
      {
        type: "text",
        name: "value",
        message: "Descripción: ",
      },
      { type: "number", name: "description", message: "Importe: " },
    ]);
    const expenses = await expensesData.getData();
    stringData = {
      value: expenseData.value,
      description: "$" + expenseData.description,
    };

    expenses.push(stringData);
    await expensesData.saveData(expenses);

    console.log(`Se guardo el nuevo gasto de [${expenseData.value}]`);
    console.log("Volviendo al menú...".yellow);
    setTimeout(() => {
      mainMenu();
    }, 4000);
  }

  if (commandSelected.value == "list") {
    const expenses = await expensesData.getData();

    const response = await prompts({
      type: "select",
      name: "value",
      message: "Lista - Borrar Gasto?",
      choices: [
        { title: "[...volver al Menú]".green, value: "back" },
        ...expenses,
      ],
      initial: 0,
    });

    if (response.value == "back") {
      mainMenu();
      return;
    }

    let deleteData = {
      value: response.value,
    };

    const commandSelected = await prompts({
      type: "toggle",
      name: "value",
      message: `Seguro querés borrar el gasto de [${response.value}]?`.red,
      initial: false,
      active: "Si",
      inactive: "No",
    });

    if (commandSelected.value == true) {
      const expenses = await expensesData.getData();

      for (let i = 0; i < expenses.length; i++) {
        if (response.value === expenses[i].value) {
          expenses.splice(i, 1);
        }
      }
      await expensesData.saveData(expenses);
      console.log(`Se borró el gasto [${deleteData.value}]`.green);
      console.log("Volviendo al menu...".yellow);
      setTimeout(() => {
        mainMenu();
      }, 4000);
    } else {
      console.log("Se canceló".cyan);
      console.log("Volviendo al menu...".yellow);
      setTimeout(() => {
        mainMenu();
      }, 4000);
    }
  }
  return;
};

mainMenu();
