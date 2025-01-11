# Cryptocurrency Data Fetcher - Tasks Overview

This repository contains a solution for fetching and processing real-time cryptocurrency data from CoinGecko. The tasks include background jobs for data fetching, APIs for retrieving stats, and calculating price deviations.

## Table of Contents

1. [Task 1 - Background Job to Fetch Cryptocurrency Data](#task-1-background-job-to-fetch-cryptocurrency-data)
2. [Task 2 - /stats API](#task-2-stats-api)
3. [Task 3 - /deviation API](#task-3-deviation-api)

---

## Task 1 - Background Job to Fetch Cryptocurrency Data

### Overview

In this task, we implement a background job that fetches real-time cryptocurrency data (price, market cap, and 24-hour change) for Bitcoin, Matic, and Ethereum from the CoinGecko API. The fetched data is stored in a MongoDB database. The background job runs every 2 hours to keep the data up to date.

### Features

- Fetches data from the CoinGecko API for the following cryptocurrencies:
  - Bitcoin (`bitcoin`)
  - Matic (`matic-network`)
  - Ethereum (`ethereum`)
- Data includes:
  - **Price in USD**
  - **Market Cap in USD**
  - **24-hour Change**
- Data is stored in a MongoDB database.
- A background job that runs every 2 hours to fetch and store the latest data.

---

### Setup Instructions

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/cryptocurrency-data-fetcher.git
    cd cryptocurrency-data-fetcher
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up MongoDB:
    - Ensure MongoDB is installed locally or use MongoDB Atlas for a cloud-based solution.
    - The default MongoDB URI is `mongodb://localhost:27017/cryptoDB`. Update it if necessary in the code.

4. Start the background job:

    ```bash
    npm start
    ```

---

### How It Works

1. **Background Job**:
   - The job fetches data every 2 hours using the CoinGecko API. It uses the following API endpoint to fetch the required data:
   
     ```bash
     https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,matic-network,ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_change=true
     ```

2. **Data Storage**:
   - The fetched data is stored in a MongoDB collection called `Cryptocurrency`. The schema for this collection includes:
     - **name**: The name of the cryptocurrency (Bitcoin, Matic, Ethereum).
     - **price_usd**: The current price of the cryptocurrency in USD.
     - **market_cap_usd**: The market cap of the cryptocurrency in USD.
     - **change_24h**: The percentage change in price over the last 24 hours.

---

## Task 2 - /stats API

### Overview

This task implements an API endpoint `/stats` to return the latest cryptocurrency data for a given coin. The coin is specified through a query parameter, and the response includes the latest price, market cap, and 24-hour change of the cryptocurrency.

### API Details

- **Endpoint**: `/stats`
- **Query Parameters**: 
  - `coin`: Name of the cryptocurrency (`bitcoin`, `matic-network`, or `ethereum`).
  
- **Sample Request**:

  ```bash
  GET /stats?coin=bitcoin
  ```
- **Sample Response**:
  ```json
  {
    "price": 40000,
    "marketCap": 800000000,
    "24hChange": 3.4
  }
  ```

### Setup Instructions

Follow the same setup instructions as **Task 1** to run this task along with the background job.

---

### How It Works

The API receives the `coin` query parameter (`bitcoin`, `matic-network`, or `ethereum`). It fetches the latest data from the MongoDB collection `Cryptocurrency` for the requested coin. The response is sent in JSON format with the latest data for the requested cryptocurrency.

---

## Task 3 - /deviation API

### Overview

This task implements an API endpoint `/deviation` to calculate the standard deviation of the price for a given cryptocurrency over the last 100 records stored by the background job in the database.

### API Details

- **Endpoint**: `/deviation`
- **Query Parameters**:
  - `coin`: Name of the cryptocurrency (`bitcoin`, `matic-network`, or `ethereum`).
  
- **Sample Request**:

  ```bash
  GET /deviation?coin=bitcoin
  ```
- **Sample Response**:
  ```json
  {
  "deviation": 4082.48
  }
  ```
### Setup Instructions

Follow the same setup instructions as **Task 1** to run this task along with the background job.

---

### How It Works

1. The API receives the `coin` query parameter (`bitcoin`, `matic-network`, or `ethereum`).
2. It retrieves the last 100 records for the requested cryptocurrency from the MongoDB collection `Cryptocurrency`.
3. It calculates the standard deviation of the prices for those records.
4. The response is sent in JSON format with the standard deviation value.

---
  
