const categorySelect = document.getElementById("category");
const amountInput = document.getElementById("amount");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const resultText = document.getElementById("result");
const swapBtn = document.getElementById("swapBtn");

const units = {
  length: {
    meter: {
      name: "Meter",
      factor: 1
    },
    kilometer: {
      name: "Kilometer",
      factor: 1000
    },
    centimeter: {
      name: "Centimeter",
      factor: 0.01
    },
    millimeter: {
      name: "Millimeter",
      factor: 0.001
    },
    mile: {
      name: "Mile",
      factor: 1609.344
    },
    yard: {
      name: "Yard",
      factor: 0.9144
    },
    foot: {
      name: "Foot",
      factor: 0.3048
    },
    inch: {
      name: "Inch",
      factor: 0.0254
    }
  },

  weight: {
    kilogram: {
      name: "Kilogram",
      factor: 1
    },
    gram: {
      name: "Gram",
      factor: 0.001
    },
    milligram: {
      name: "Milligram",
      factor: 0.000001
    },
    pound: {
      name: "Pound",
      factor: 0.45359237
    },
    ounce: {
      name: "Ounce",
      factor: 0.0283495
    },
    ton: {
      name: "Metric Ton",
      factor: 1000
    }
  },

  temperature: {
    celsius: {
      name: "Celsius"
    },
    fahrenheit: {
      name: "Fahrenheit"
    },
    kelvin: {
      name: "Kelvin"
    }
  },

  time: {
    second: {
      name: "Second",
      factor: 1
    },
    minute: {
      name: "Minute",
      factor: 60
    },
    hour: {
      name: "Hour",
      factor: 3600
    },
    day: {
      name: "Day",
      factor: 86400
    },
    week: {
      name: "Week",
      factor: 604800
    }
  },

  area: {
    squareMeter: {
      name: "Square Meter",
      factor: 1
    },
    squareKilometer: {
      name: "Square Kilometer",
      factor: 1000000
    },
    squareFoot: {
      name: "Square Foot",
      factor: 0.092903
    },
    squareInch: {
      name: "Square Inch",
      factor: 0.00064516
    },
    acre: {
      name: "Acre",
      factor: 4046.8564224
    },
    hectare: {
      name: "Hectare",
      factor: 10000
    }
  },

  volume: {
    liter: {
      name: "Liter",
      factor: 1
    },
    milliliter: {
      name: "Milliliter",
      factor: 0.001
    },
    cubicMeter: {
      name: "Cubic Meter",
      factor: 1000
    },
    gallon: {
      name: "US Gallon",
      factor: 3.78541
    },
    cup: {
      name: "Cup",
      factor: 0.236588
    }
  },

  speed: {
    meterPerSecond: {
      name: "Meter/Second",
      factor: 1
    },
    kilometerPerHour: {
      name: "Kilometer/Hour",
      factor: 0.277778
    },
    milePerHour: {
      name: "Mile/Hour",
      factor: 0.44704
    },
    knot: {
      name: "Knot",
      factor: 0.514444
    }
  },

  data: {
    byte: {
      name: "Byte",
      factor: 1
    },
    kilobyte: {
      name: "Kilobyte",
      factor: 1024
    },
    megabyte: {
      name: "Megabyte",
      factor: 1024 ** 2
    },
    gigabyte: {
      name: "Gigabyte",
      factor: 1024 ** 3
    },
    terabyte: {
      name: "Terabyte",
      factor: 1024 ** 4
    }
  }
};

function formatNumber(number) {
  if (!Number.isFinite(number)) {
    return "Invalid value";
  }

  return Number(number.toFixed(10)).toLocaleString("en-IN");
}

function loadUnits() {
  const selectedCategory = categorySelect.value;
  const currentUnits = units[selectedCategory];

  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  Object.keys(currentUnits).forEach((unitKey) => {
    const unitName = currentUnits[unitKey].name;

    const fromOption = document.createElement("option");
    fromOption.value = unitKey;
    fromOption.textContent = unitName;

    const toOption = document.createElement("option");
    toOption.value = unitKey;
    toOption.textContent = unitName;

    fromUnit.appendChild(fromOption);
    toUnit.appendChild(toOption);
  });

  if (toUnit.options.length > 1) {
    toUnit.selectedIndex = 1;
  }

  convertUnit();
}

function convertTemperature(value, from, to) {
  let celsius;

  if (from === "celsius") {
    celsius = value;
  } else if (from === "fahrenheit") {
    celsius = (value - 32) * 5 / 9;
  } else if (from === "kelvin") {
    celsius = value - 273.15;
  }

  if (to === "celsius") {
    return celsius;
  }

  if (to === "fahrenheit") {
    return (celsius * 9 / 5) + 32;
  }

  if (to === "kelvin") {
    return celsius + 273.15;
  }
}

function convertUnit() {
  const value = parseFloat(amountInput.value);

  if (amountInput.value.trim() === "" || !Number.isFinite(value)) {
    resultText.textContent = "Enter a valid number";
    return;
  }

  const category = categorySelect.value;
  const from = fromUnit.value;
  const to = toUnit.value;

  let convertedValue;

  if (category === "temperature") {
    convertedValue = convertTemperature(value, from, to);
  } else {
    const fromFactor = units[category][from].factor;
    const toFactor = units[category][to].factor;

    convertedValue = (value * fromFactor) / toFactor;
  }

  const targetName = units[category][to].name;

  resultText.textContent =
    `${formatNumber(convertedValue)} ${targetName}`;
}

function swapUnits() {
  const oldFrom = fromUnit.value;

  fromUnit.value = toUnit.value;
  toUnit.value = oldFrom;

  convertUnit();
}

categorySelect.addEventListener("change", loadUnits);
amountInput.addEventListener("input", convertUnit);
fromUnit.addEventListener("change", convertUnit);
toUnit.addEventListener("change", convertUnit);
swapBtn.addEventListener("click", swapUnits);

loadUnits();