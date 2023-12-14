const Airtable = require("airtable");

const base = new Airtable({
  apiKey:
    "patH1IFTpy2OFhIu5.2fd199d1ab89a0ddab54b23c849ec574b7d636b2a1df5c17c0d295425df3fa30",
}).base("appEGb1DeilXjCqMU");
const table = base("Synetica Working numbers");

const formatDescriptionText = (text) => {
  const keywords = ["Temperature", "Humidity", "Barometric", "VOC"];
  const formattedText = text.replace(
    new RegExp(`(${keywords.join("|")})`, "g"),
    "\n$1"
  );
  return formattedText;
};

const minifyRecord = (record) => {
  let measuringRange = record?.fields["Measuring Range"];
  measuringRange = measuringRange
    ? formatDescriptionText(measuringRange)
    : null;

  // Add °C to operatingTemperature
  let operatingTemperature = record?.fields["Operating temperature"];
  operatingTemperature = operatingTemperature
    ? (operatingTemperature += " °C")
    : null;

  // Add %HR to operatingHumidity
  let operatingHumidity = record?.fields["Operating humidity"];
  operatingHumidity = operatingHumidity ? operatingHumidity + " %HR" : null;

  // Convert string values to numbers
  let minOperatingHumidity = parseFloat(record?.fields["Min oper HR"]);
  let maxOperatingHumidity = parseFloat(record?.fields["Max oper HR"]);
  let minOperatingTemperature = parseFloat(record?.fields["Min oper Temp"]);
  let maxOperatingTemperature = parseFloat(record?.fields["Max oper Temp"]);

  let maxMeasureTemperature = parseFloat(record?.fields["Max Temp"]);
  let minMeasureTemperature = parseFloat(record?.fields["Min Temp"]);
  let maxMeasurehumidity = parseFloat(record?.fields["Max humidity"]);

  let tempAccuracy = parseFloat(record?.fields["Temp Accuracy"]);
  let humidityAccuracy = parseFloat(record?.fields["Humidity Accuracy"]);
  let tempResolution = parseFloat(record?.fields["Temp Resolution"]);
  let humidityResolution = parseFloat(record?.fields["Humidity Resolution"]);

  return {
    id: record?.id,
    sku: record?.fields.SKU,
    brand: record?.fields.Brand,
    productName: record?.fields["Product Name"],
    description: record?.fields.Description,
    clasification: record?.fields.Clasification,
    useCase: record?.fields["Use Case"],
    outdoorIndoor: record?.fields["Outdoor/indoor"],

    tempAccuracy,
    humidityAccuracy,
    tempResolution,
    humidityResolution,

    measuringRange,
    operatingTemperature,
    operatingHumidity,
    powerSupply: record?.fields["Power Supply"],
    connectivity: record?.fields.Connectivity,
    resolution: record?.fields.Resolution,
    accuracy: record?.fields.Accuracy,
    priceWesco: record?.fields["Price Wesco"],
    costUSDMiami: record?.fields["Cost USD Miami"],
    price5to10: record?.fields["Price Partner 5 - 10 sensors"],
    price11to25: record?.fields["Price Partner 11 - 25 sensors"],
    price26to50: record?.fields["Price Partner 26 - 50 sensors"],
    minOperatingHumidity,
    maxOperatingHumidity,
    minOperatingTemperature,
    maxOperatingTemperature,
    maxMeasureTemperature,
    minMeasureTemperature,
    maxMeasurehumidity,
  };
};

let allRecords = [];
const fetchSensors = async (req, res) => {
  try {
    const getRecords = async () => {
      if (allRecords.length > 1) {
        return allRecords;
      }

      table
        .select({
          view: "Grid view",
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function (record) {
              allRecords.push(minifyRecord(record));
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      return allRecords;
    };

    const result = await getRecords();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { fetchSensors };