const express = require("express");
const http = require("http");

const app = express();
const PORT = 3000;

const THIRD_PARTY_API_URL =
  "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

function fetch_data_from_api() {
  return new Promise((resolve, reject) => {
    http.get(THIRD_PARTY_API_URL, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(data));
      });

      res.on("error", (error) => {
        reject(error);
      });
    });
  });
}

app.get("/api/initialize-database", async (req, res) => {
  const month = req.query.month;
  try {
    const data = await fetch_data_from_api();
    if (data) {
      for (const item of data) {
        if (month && item.dateOfSale.slice(5, 7) === month) {
          const { productName, dateOfSale, quantitySold, price } = item;
          // Insert the data into the database collection
          // Replace the following line with your database query or MongoDB insert operation
          // Example MongoDB insert: db.sales_data.insertOne({ productName, dateOfSale, quantitySold, price })
        }
      }
      res.status(200).json({ message: "Database initialized successfully!" });
    } else {
      res
        .status(500)
        .json({ message: "Failed to fetch data from the third-party API" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ... Other API endpoints ...

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

//2. second question

function calculateTotalSaleAmount(data, selectedMonth) {
  let totalSaleAmount = 0;
  for (const item of data) {
    if (item.dateOfSale.slice(5, 7) === selectedMonth) {
      totalSaleAmount += item.quantitySold * item.price;
    }
  }
  return totalSaleAmount;
}

function calculateTotalSoldItems(data, selectedMonth) {
  let totalSoldItems = 0;
  for (const item of data) {
    if (item.dateOfSale.slice(5, 7) === selectedMonth) {
      totalSoldItems += item.quantitySold;
    }
  }
  return totalSoldItems;
}

function calculateTotalNotSoldItems(data, selectedMonth) {
  let totalNotSoldItems = 0;
  for (const item of data) {
    if (item.dateOfSale.slice(5, 7) === selectedMonth) {
      totalNotSoldItems += item.quantityAvailable;
    }
  }
  return totalNotSoldItems;
}

app.get("/api/statistics", async (req, res) => {
  const selectedMonth = req.query.month;
  try {
    const data = await fetch_data_from_api();
    if (!data) {
      return res
        .status(500)
        .json({ message: "Failed to fetch data from the third-party API" });
    }

    const totalSaleAmount = calculateTotalSaleAmount(data, selectedMonth);
    const totalSoldItems = calculateTotalSoldItems(data, selectedMonth);
    const totalNotSoldItems = calculateTotalNotSoldItems(data, selectedMonth);

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ... Other API endpoints ...

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

//3.third question

function getPriceRange(price) {
  if (price >= 0 && price <= 100) return "0 - 100";
  if (price >= 101 && price <= 200) return "101 - 200";
  if (price >= 201 && price <= 300) return "201 - 300";
  if (price >= 301 && price <= 400) return "301 - 400";
  if (price >= 401 && price <= 500) return "401 - 500";
  if (price >= 501 && price <= 600) return "501 - 600";
  if (price >= 601 && price <= 700) return "601 - 700";
  if (price >= 701 && price <= 800) return "701 - 800";
  if (price >= 801 && price <= 900) return "801 - 900";
  if (price >= 901) return "901-above";
}

app.get("/api/bar-chart", async (req, res) => {
  const selectedMonth = req.query.month;
  try {
    const data = await fetch_data_from_api();
    if (!data) {
      return res
        .status(500)
        .json({ message: "Failed to fetch data from the third-party API" });
    }

    const priceRanges = {
      "0 - 100": 0,
      "101 - 200": 0,
      "201 - 300": 0,
      "301 - 400": 0,
      "401 - 500": 0,
      "501 - 600": 0,
      "601 - 700": 0,
      "701 - 800": 0,
      "801 - 900": 0,
      "901-above": 0,
    };

    for (const item of data) {
      if (item.dateOfSale.slice(5, 7) === selectedMonth) {
        const priceRange = getPriceRange(item.price);
        priceRanges[priceRange]++;
      }
    }

    res.status(200).json(priceRanges);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ... Other API endpoints ...

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

//4.forth question

function calculateCategoryCount(data, selectedMonth) {
  const categoryCount = {};

  for (const item of data) {
    if (item.dateOfSale.slice(5, 7) === selectedMonth) {
      const category = item.category;
      if (category in categoryCount) {
        categoryCount[category]++;
      } else {
        categoryCount[category] = 1;
      }
    }
  }

  return categoryCount;
}

app.get("/api/pie-chart", async (req, res) => {
  const selectedMonth = req.query.month;
  try {
    const data = await fetch_data_from_api();
    if (!data) {
      return res
        .status(500)
        .json({ message: "Failed to fetch data from the third-party API" });
    }

    const categoryCount = calculateCategoryCount(data, selectedMonth);

    res.status(200).json(categoryCount);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// ... Other API endpoints ...

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

//last question

const API1_URL = "https://api.example.com/api1";
const API2_URL = "https://api.example.com/api2";
const API3_URL = "https://api.example.com/api3";

function fetchFromAPI(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(data));
      });

      res.on("error", (error) => {
        reject(error);
      });
    });
  });
}

app.get("/api/combined-data", async (req, res) => {
  try {
    const [dataFromAPI1, dataFromAPI2, dataFromAPI3] = await Promise.all([
      fetchFromAPI(API1_URL),
      fetchFromAPI(API2_URL),
      fetchFromAPI(API3_URL),
    ]);

    const combinedData = {
      dataFromAPI1,
      dataFromAPI2,
      dataFromAPI3,
    };

    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data from APIs" });
  }
});

// ... Other API endpoints ...

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
