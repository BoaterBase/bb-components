const converters = {
    length: {
        m: {
            base: 1.0,
            name: 'Meters'
        },
        ft: {
            base: 1 / 3.28084,
            name: 'Feet'
        }
    },
    mass: {
        kg: {
            base: 1.0,
            name: 'Kilograms'
        },
        t: {
            base: 907.18474,
            name: 'Tons'
        },
        lb: {
            base: 0.45359237,
            name: 'Pounds'
        }
    },
    power: {
        kw: {
            base: 1.0,
            name: 'Kilowatts'
        },
        hp: {
            base: 0.7457,
            name: 'Horsepower'
        }
    },
    volume: {
        l: {
            base: 1.0,
            name: 'Litres'
        },
        gal: {
            base: 3.78541,
            name: 'Gallons'
        }
    }

};

export function converter(measurement, from, to, value) {
    return (value * converters[measurement][from].base / converters[measurement][to].base);
}

export function converterName(measurement, unit) {
    return converters[measurement][unit].name;
}

// Handle user input
export const convertMeasurement: any = (measurement: string, from: string, to: string, fixed = -1) => (value) => {
    let v = parseFloat(value);
    if (value === undefined || value === '' || value === null)
        return null;
    else if (v === NaN)
        return null;
    else if (fixed >= 0)
        return Math.round(converter(measurement, from, to, value) * Math.pow(10, fixed)) / Math.pow(10, fixed);
    else
        return converter(measurement, from, to, value);
}