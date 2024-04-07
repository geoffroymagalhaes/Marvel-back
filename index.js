require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const app = express();

const axios = require("axios");

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

// -----Import--Routes---

const userRoutes = require("./routes/user");
app.use(userRoutes);

// ----------characters-route----------Get all characters
app.get("/", async (req, res) => {
  try {
    // let skip = 0;
    // let limit = 100;

    const name = req.query.name || "";
    let skip;
    const limit = req.query.limit || "100";
    if (req.query.page) {
      // limit = 100;
      skip = limit * (req.query.page - 1);
    }

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&name=${name}&limit=${limit}&skip=${skip}`
    );
    res.status(200).json(response.data);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
});
// -------------------------------------------

// ------------character-by-id-route----------Get a the infos of a specific character
app.get("/character/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${req.params.id}?apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
});
// -------------------------------------------

// ------------comics-route-------------------Get all comics

app.get("/comics", async (req, res) => {
  try {
    const title = req.query.title || "";
    let skip;
    const limit = req.query.limit || "100";
    if (req.query.page) {
      // limit = 100;
      skip = limit * (req.query.page - 1);
    }
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}&title=${title}&limit=${limit}&skip=${skip}`
    );
    res.status(200).json(response.data);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
});
// -------------------------------------------

// ------------comics-by-charater------------------Get a list of comics containing a specific character

app.get("/comics/character/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.id}?apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
});

// --------------------------------------

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("server started 😁");
});
