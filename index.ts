import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = mongoose.connection;

const db_url:any = process.env.DB_URL;

mongoose.connect(
  db_url
);

const TemperaturaSchema = new mongoose.Schema({
  temperatura: String,
});

const Temperatura = mongoose.model("Temperatura", TemperaturaSchema);

db.on("error", () => {
  console.log("Houve um erro");
});
db.once("open", () => {
  console.log("DataBase loaded");
});

interface formatedData {
  temperature: String;
  humidity: String;
}

async function loop() {
  const data = await fetch("http://192.168.18.14:80/");

  const formatedData: formatedData | any = await data.json();

  let temp = formatedData.temperature;

  const addTemp = await Temperatura.create({
    temperatura: temp,
  });
  if (addTemp) {
    console.log("Temperatura: " + temp + " inserida com sucesso!");
  } else {
    console.log("Erro na insercao da temperatura");
  }

  // Code to execute every 1 minute
  console.log("1 minute passed!");
  setTimeout(loop, 60000); // 60 seconds
}

loop();
