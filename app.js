const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const generateInvoice = require("./html-pdf");
const port = process.env.PORT || 8500;
const bodyParser = require("body-parser");

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// render routes

function makeid(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.get("/", async function (req, res) {
  try {
    res.render("index");
  } catch (error) {
    console.log(error);
  }
});

app.post("/post_data", function (req, res) {
  try {
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}`;

    const { name, price, quantity, product_name } = req.body;
    const subtotal = (parseFloat(price) * parseInt(quantity)).toFixed(2);

    let order_id = "GID" + makeid(4) + "S";

    const pdfFileName = `invoice_${order_id}.pdf`;

    const baseUrl = process.env.url;

    const invoiceData = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      subtotal,
      product_name,
      date: formattedDate,
      invoice_no: randomNumber,
      url: `${baseUrl}/invoice/${pdfFileName}`,
      pdfFileName,
    };

    console.log(pdfFileName);

    res.render("invoice", invoiceData);

    generateInvoice(invoiceData);
  } catch (error) {
    console.log(error);
  }
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(port, function () {
  console.log(`listening on ${port}`);
});
