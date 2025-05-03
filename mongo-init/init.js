// Selecciona o crea la DB
db = db.getSiblingDB('envirosense');

// Crear la colección de usuarios y agregar un usuario
db.createCollection('User');
db.User.insertOne({
  _id: ObjectId("67dabe7883678c9954fe08a9"),
  username: "admin",
  password: "$2b$12$t0oFXS.n5NvBBK3diwi39.x4DXHqWDvXtcLM5VZxQr.dCwDRTtkHm",
  name: "Admin",
  surname: "EnviroSense",
  email: "envirosense@gmail.com",
  enabled: true,
  is_admin: true
});

// Crear la colección de Paises y agregar algunos países
db.createCollection('Country');
db.Country.insertOne({
  _id: ObjectId("67deaedb573afde3736f6d13"),
  name: "Argentina"
});
db.Country.insertOne({
  _id: ObjectId("67eeebb683bb1500d2d76a4c"),
  name: "Brasil"
});

// Crear la colección de Provincias y agregar algunas provincias
db.createCollection('Province');
db.Province.insertOne({
  _id: ObjectId("67deaee5573afde3736f6d14"),
  country: {
    $ref: "Country",  // Ref a la colección "Country"
    $id: ObjectId("67deaedb573afde3736f6d13")  // ID del país al que hace referencia
  },
  name: "Misiones"
});

// Crear la colección de Ciudades y agregar algunas ciudades
db.createCollection('City');
db.City.insertOne({
  _id: ObjectId("67deaf93573afde3736f6d15"),
  province: {
    $ref: "Province",  // Ref a la colección "Province"
    $id: ObjectId("67deaee5573afde3736f6d14")  // ID de la provincia al que hace referencia
  },
  name: "Montecarlo",
  postal_code: "3384"
});
db.City.insertOne({
  _id: ObjectId("67deaf9e573afde3736f6d16"),
  province: {
    $ref: "Province",  // Ref a la colección "Province"
    $id: ObjectId("67deaee5573afde3736f6d14")  // ID de la provincia al que hace referencia
  },
  name: "Eldorado",
  postal_code: "3380"
});

// Crear la colección de Empresas y agregar una empresa
db.createCollection('Company');
db.Company.insertOne({
  _id: ObjectId("67deb0ec573afde3736f6d1f"),  // El ID específico que deseas
  name: "EnviroSense",
  address: "Guillermo Volz 440",
  city: DBRef('City', ObjectId('67deaf93573afde3736f6d15')),  // Referencia a la ciudad
  email: "martinlacheskis@gmail.com",
  phone: "+5493764718021",
  webpage: "https://www.linkedin.com/in/martin-lacheski/",
  logo: "sin logo"
});

// Crear la colección de Tipos de Ambiente y agregar algunos tipos
db.createCollection('EnvironmentType');
db.EnvironmentType.insertOne({
  _id: ObjectId("67deb01e573afde3736f6d1c"),
  name: "Invernadero hidropónico"
});

// Crear la colección de Ambientes y agregar algunos ambientes
db.createCollection('Environment');
db.Environment.insertOne({
  _id: ObjectId("67deb155573afde3736f6d20"),
  company: {
    $ref: "Company",  // Ref a la colección "Company"
    $id: ObjectId("67deb0ec573afde3736f6d1f")  // ID de la compañía a la que hace referencia
  },
  city: {
    $ref: "City",  // Ref a la colección "City"
    $id: ObjectId("67deaf93573afde3736f6d15")  // ID de la ciudad a la que hace referencia
  },
  type: {
    $ref: "EnvironmentType",  // Ref a la colección "EnvironmentType"
    $id: ObjectId("67deb01e573afde3736f6d1c")  // ID del tipo de entorno al que hace referencia
  },
  name: "Invernadero NFT Casa",
  address: "Guillermo Volz 440",
  gps_location: "-26.56370430439182, -54.76147477875187",
  description: "Casa"
});
db.Environment.insertOne({
  _id: ObjectId("67deb19e573afde3736f6d21"),
  company: {
    $ref: "Company",  // Ref a la colección "Company"
    $id: ObjectId("67deb0ec573afde3736f6d1f")  // ID de la compañía a la que hace referencia
  },
  city: {
    $ref: "City",  // Ref a la colección "City"
    $id: ObjectId("67deaf9e573afde3736f6d16")  // ID de la ciudad a la que hace referencia
  },
  type: {
    $ref: "EnvironmentType",  // Ref a la colección "EnvironmentType"
    $id: ObjectId("67deb01e573afde3736f6d1c")  // ID del tipo de entorno al que hace referencia
  },
  name: "Invernadero NFT en FCF",
  address: "Bertoni 124",
  gps_location: "-26.404666518585714, -54.66400009887927",
  description: "Invernadero hidropónico tipo NFT de la FCF"
});

// Crear la colección de Tipos de Nutrientes y agregar algunos tipos
db.createCollection('NutrientType');
db.NutrientType.insertMany([
  {
    _id: ObjectId("67deafb7573afde3736f6d17"),
    name: "Sin nutrientes"
  },
  {
    _id: ObjectId("67deafc0573afde3736f6d18"),
    name: "pH +"
  },
  {
    _id: ObjectId("67deafcc573afde3736f6d19"),
    name: "pH -"
  },
  {
    _id: ObjectId("67deafeb573afde3736f6d1a"),
    name: "Macronutrientes"
  },
  {
    _id: ObjectId("67deb00e573afde3736f6d1b"),
    name: "Micronutrientes"
  }
]);

// Crear la colección de Actuadores y agregar algunos actuadores
db.createCollection('Actuator');
db.Actuator.insertOne({
  _id: ObjectId("67deb414573afde3736f6d29"),
  environment: {
    $ref: "Environment",  // Ref a la colección "Environment"
    $id: ObjectId("67deb155573afde3736f6d20")  // ID del entorno al que hace referencia
  },
  description: "Actuador en invernadero hidropónico piloto",
  actuator_code: "AC001",
  relay_water_enabled: true,
  relay_water_time: 5,
  relay_aerator_enabled: true,
  relay_aerator_time: 5,
  relay_vent_enabled: true,
  relay_vent_time: 10,
  relay_light_enabled: true,
  relay_light_time: 10,
  relay_ph_plus_enabled: true,
  relay_ph_plus_time: 5,
  relay_ph_minus_enabled: true,
  relay_ph_minus_time: 5,
  relay_nutri_1_enabled: true,
  relay_nutri_1_time: 5,
  relay_nutri_2_enabled: true,
  relay_nutri_2_time: 5,
  relay_nutri_3_enabled: true,
  relay_nutri_3_time: 5,
  relay_nutri_4_enabled: true,
  relay_nutri_4_time: 5,
  seconds_to_report: 5,
  enabled: true
});

// Crear la colección de Sensores de consumos y agregar algunos sensores
db.createCollection('ConsumptionSensor');
db.ConsumptionSensor.insertOne({
  _id: ObjectId("67deb39b573afde3736f6d27"),
  environment: {
    $ref: "Environment",
    $id: ObjectId("67deb155573afde3736f6d20")
  },
  description: "Sensor de consumo en invernadero hidropónico piloto",
  sensor_code: "SC001",
  min_voltage_alert: 170,
  max_voltage_alert: 240,
  nutrient_1_enabled: true,
  nutrient_1_type: {
    $ref: "NutrientType",
    $id: ObjectId("67deafc0573afde3736f6d18")
  },
  nutrient_1_alert: 25,
  nutrient_2_enabled: true,
  nutrient_2_type: {
    $ref: "NutrientType",
    $id: ObjectId("67deafcc573afde3736f6d19")
  },
  nutrient_2_alert: 25,
  nutrient_3_enabled: true,
  nutrient_3_type: {
    $ref: "NutrientType",
    $id: ObjectId("67deafeb573afde3736f6d1a")
  },
  nutrient_3_alert: 25,
  nutrient_4_enabled: true,
  nutrient_4_type: {
    $ref: "NutrientType",
    $id: ObjectId("67deb00e573afde3736f6d1b")
  },
  nutrient_4_alert: 25,
  nutrient_5_enabled: false,
  nutrient_5_type: {
    $ref: "NutrientType",
    $id: ObjectId("67deafb7573afde3736f6d17")
  },
  nutrient_5_alert: 0,
  nutrient_6_enabled: false,
  nutrient_6_type: {
    $ref: "NutrientType",
    $id: ObjectId("67deafb7573afde3736f6d17")
  },
  nutrient_6_alert: 0,
  seconds_to_report: 5,
  enabled: true
});

// Crear la colección de Sensores de ambiente y agregar algunos sensores
db.createCollection('EnvironmentalSensor');
db.EnvironmentalSensor.insertOne({
  _id: ObjectId("67deb280573afde3736f6d22"),
  environment: {
    $ref: "Environment",  // Ref a la colección "Environment"
    $id: ObjectId("67deb155573afde3736f6d20")  // ID del entorno al que hace referencia
  },
  description: "Sensor de ambiente en invernadero hidropónico piloto",
  sensor_code: "SE001",
  temperature_alert_min: 10,
  temperature_alert_max: 40,
  humidity_alert_min: 45,
  humidity_alert_max: 80,
  atmospheric_pressure_alert_min: 950,
  atmospheric_pressure_alert_max: 1050,
  co2_alert_min: 400,
  co2_alert_max: 1000,
  seconds_to_report: 5,
  enabled: true
});
db.EnvironmentalSensor.insertOne({
  _id: ObjectId("6806b72f8e2f6c9c174f392d"),
  environment: {
    $ref: "Environment",  // Ref a la colección "Environment"
    $id: ObjectId("67deb19e573afde3736f6d21")  // ID del entorno al que hace referencia
  },
  description: "Sensor de ambiente en invernadero hidropónico de producción",
  sensor_code: "SE002",
  temperature_alert_min: 10,
  temperature_alert_max: 40,
  humidity_alert_min: 45,
  humidity_alert_max: 80,
  atmospheric_pressure_alert_min: 950,
  atmospheric_pressure_alert_max: 1050,
  co2_alert_min: 400,
  co2_alert_max: 1000,
  seconds_to_report: 15,
  enabled: true
});

// Crear la colección de Sensores de solucion de nutrientes y agregar algunos sensores
db.createCollection('NutrientSolutionSensor');
db.NutrientSolutionSensor.insertOne({
  _id: ObjectId("67deb327573afde3736f6d25"),
  environment: {
    $ref: "Environment",  // Ref a la colección "Environment"
    $id: ObjectId("67deb155573afde3736f6d20")  // ID del entorno al que hace referencia
  },
  description: "Sensor de nutrientes en invernadero hidropónico piloto",
  sensor_code: "SSN001",
  temperature_alert_min: 20,
  temperature_alert_max: 35,
  tds_alert_min: 100,
  tds_alert_max: 2000,
  ph_alert_min: 5,
  ph_alert_max: 9,
  ce_alert_min: 0.5,
  ce_alert_max: 2.0,
  seconds_to_report: 60,
  enabled: true
});

// Imprimir un mensaje de éxito
print("Base de datos y colecciones inicializadas correctamente.");
print("Usuario admin creado con éxito.");
print("Paises, provincias, ciudades, empresas, tipos de ambiente, ambientes, tipos de nutrientes, actuadores, sensores de consumos, sensores de ambiente y sensores de solucion de nutrientes creados con éxito.");
print("Base de datos 'envirosense' inicializada correctamente.");
print("Recuerda cambiar la contraseña del usuario admin por una más segura.");








