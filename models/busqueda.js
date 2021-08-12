const fs = require("fs");
const axios = require("axios");

class Busquedas {
  pathDB = "./db/database.json";
  constructor() {
    this.historial = [];
    this.leerDB();
  }

  get historialCapitalize() {
    const cap = this.historial.map((lugar) => {
      const lugarSeparado = lugar.split(" ");
      const upperCase = lugarSeparado.map(
        (elem) => elem.charAt(0).toUpperCase() + elem.slice(1)
      );
      return upperCase.join(" ");
    });
    return cap;
  }
  get paramsInstanceMapBoxAPI() {
    return {
      access_token: process.env.TOKEN_MAPBOX,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenWeatherAPI() {
    return { units: "metric", lang: "es", appid: process.env.TOKE_OPENWEATHER };
  }

  async buscarCiudad(lugar) {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsInstanceMapBoxAPI,
      });
      const resp = await instance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        name: lugar.place_name,
        lon: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {}
  }

  async buscarClimaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          lat,
          lon,
          ...this.paramsOpenWeatherAPI,
        },
      });
      const res = await instance.get();
      const { weather, main } = res.data;
      return {
        temp: main.temp,
        min: main.temp_min,
        max: main.temp_max,
        desc: weather[0].description,
      };
    } catch (error) {
      console.log(error);
    }
  }

  guardarLugar(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }

    this.historial.unshift(lugar.toLocaleLowerCase());
    if (this.historial.length == 6) this.historial.pop();
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.pathDB, JSON.stringify(payload));
  }

  leerDB() {
    if (fs.existsSync(this.pathDB)) {
      const info = fs.readFileSync(this.pathDB, { encoding: "utf-8" });
      const data = JSON.parse(info);
      this.historial = data.historial;
    }
  }
}

module.exports = Busquedas;
