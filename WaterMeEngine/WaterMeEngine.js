class WaterMeEngine {

    #sensors;
    #location;

    /**
     * WaterMeEngine contructor
     * @param {*} sensors sensors data
     * @param {*} location location data (latitude and longitude)
     */
    constructor(sensors, location)
    {
        this.#sensors = sensors;
        this.#location = location;
    }

    /**
     * soilMoistureSensorAvailable returns a boolean for the existence of soil moisture sensor data
     */
    soilMoistureSensorAvailable() {
        for (const sensor of this.#sensors) {
            if (sensor.type.includes('SMS')) {
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
                let latest_reading = sensor.readings[sensor.readings.length];
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
                let latest_reading = sensor.readings[sensor.readings.length];
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
                let latest_reading = sensor.readings[sensor.readings.length];
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
     * evaluateWaterMe method evaluates if now is the best time to water according to available data
     * @returns true for watering
     */
    evaluateWaterMe() {
        if (this.temperatureSensorAvailable() ? this.evaluateTemperature() : true
        && this.humiditySensorAvailable() ? this.evaluateHumidity() : true
        && this.soilMoistureSensorAvailable() ? this.evaluateSoilMoisture() : true) 
        {
         return true;   
        }
        return false;
    }
}

module.exports = {WaterMeEngine};