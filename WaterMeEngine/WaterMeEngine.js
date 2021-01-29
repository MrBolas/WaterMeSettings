const weather  = require('openweather-apis');
const package_settings = require('../package.json')
const openweather_api_key = process.env.OPENWEATHER_API;

class WaterMeEngine {

    valid_SMS_reading_threshold = 0.1;

    #engineVersion = undefined;
    #dependencies;
    #sensors;
    #location = undefined;
    #api_data;

    /**
     * WaterMeEngine contructor
     * @param {*} sensors sensors data
     * @param {*} location location data (latitude and longitude)
     */
    constructor(sensors, location)
    {
        this.#sensors = sensors;
      
        //setup weather API
        if(location != '-'){
            this.#location = location;

            weather.setLang('en');
            weather.setCity(this.#location);
            weather.setUnits('metric');
            weather.setAPPID(openweather_api_key);
            weather.getAllWeather(api_info => {
                let api_data = {
                    weather: api_info.weather,
                    wind: api_info.wind,
                    clouds: api_info.clouds
                };
    
                this.#api_data = api_data;
            })
            .catch(err => {
                console.log(err);
            })
        }else{
            this.#location = undefined;
        }
    }

    /**
     * externalWeatherAPIAvailable verifies the external weather API is available
     */
    externalWeatherAPIAvailable() {
        if (this.#api_data != undefined) {
            return true;
        }
        return false;
    }

    /**
     * soilMoistureSensorAvailable returns a boolean for the existence of soil moisture sensor data
     */
    soilMoistureSensorAvailable() {
        for (const sensor of this.#sensors) {
            if (sensor.type.includes('SMS') 
            && sensor.readings[sensor.readings.length-1] > this.valid_SMS_reading_threshold) {
                return true;
            }
        }
        return false;
    }

    /**
     * temperatureSensorAvailable returns a boolean for the existence of temperature sensor data
     */
    temperatureSensorAvailable() {
        for (const sensor of this.#sensors) {
            if (sensor.type.includes('temp')) {
                return true;
            }
        }
        return false;
    }

    /**
     * humiditySensorAvailable returns a boolean for the existence of humidity sensor data
     */
    humiditySensorAvailable() {
        for (const sensor of this.#sensors) {
            if (sensor.type.includes('hum')) {
                return true;
            }
        }
        return false;
    }

    /**
     * evaluateHumidity evaluates if humidity is according to tolerable parameters
     * @returns true for positive evaluation
     */
    evaluateHumidity() {
        for (const sensor of this.#sensors) {
            if (sensor.type.includes('hum')) {
                let latest_reading = sensor.readings[sensor.readings.length-1];
                let watering_thresholds = sensor.watering_threshold;
                if (latest_reading.value > watering_thresholds.min
                    && latest_reading.value < watering_thresholds.max) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * evaluateTemperature evaluates if temperature is according to tolerable parameters
     * @returns true for positive evaluation
     */
    evaluateTemperature() {
        for (const sensor of this.#sensors) {
            if (sensor.type.includes('temp')) {
                let latest_reading = sensor.readings[sensor.readings.length-1];
                let watering_thresholds = sensor.watering_threshold;
                if (latest_reading.value > watering_thresholds.min
                    && latest_reading.value < watering_thresholds.max) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * evaluateSoilMoisture evaluates if soil moisture is according to tolerable parameters
     * @returns true for positive evaluation
     */
    evaluateSoilMoisture() {
        for (const sensor of this.#sensors) {
            if (sensor.type.includes('SMS')) {
                let latest_reading = sensor.readings[sensor.readings.length-1];
                let watering_thresholds = sensor.watering_threshold;
                // not enough water
                if (latest_reading.value < watering_thresholds.min) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * evaluateWind evaluates wind velocity
     */
    evaluateWind(){
        // if wind speed is more than 25km/h
        if (this.#api_data.wind.speed > 25) {
            return true;
        }
        return false;
    }

    /**
     * evaluateRain evaluates if it is rainning
     */
    evaluateRain() {
        // evaluates if api weather is rain
        if (this.#api_data.weather.main == 'Rain') {
            return true;
        }
        return false;
    }

    /**
     * evaluateWaterMe method evaluates if now is the best time to water according to available data
     * @returns true for watering
     */
    evaluateWaterMe() {
        if (this.temperatureSensorAvailable()   ? this.evaluateTemperature()                    : true
        && this.humiditySensorAvailable()       ? this.evaluateHumidity()                       : true
        && this.soilMoistureSensorAvailable()   ? this.evaluateSoilMoisture()                   : true
        && this.externalWeatherAPIAvailable()   ? !this.evaluateRain && !this.evaluateWind()    : true
        ) 
        {
         return true;   
        }
        return false;
    }

    /**
     * getVersion method for version of the WaterMeEngine
     * @returns WaterMeEngine version
     */
    getVersion(){
        return package_settings.version;
    }
}

module.exports = {WaterMeEngine};