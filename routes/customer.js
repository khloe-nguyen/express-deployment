var express = require("express");
var router = express.Router();
const customerModel = require("../model/customerModel");
const multer = require("multer");

//multer setting (day la template upload file)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`); //fieldname la ten cua field chua cot image khi upload hinh len, khs no hong lay duoc ten cu cua file nen phai xafi fieldname thay vif filename
  },
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get("/", async function (req, res, next) {
  let customers = await customerModel.find();
  res.render("customer/index", { customers }); //cach viet gon cua customers:customers (key-value giong nhau)
});

router.get("/create", (req, res) => {
  res.render("customer/create");
});

router.post("/create", upload.single("image"), async (req, res) => {
  //image nay la name cua the input cua file hinh

  const body = req.body;
  let file = req.file;
  let cust = new customerModel({
    fullname: body.fullname,
    password: body.password,
    email: body.email,
    image: file.filename, //filename nay la cai filename trong template line 11
  });
  await cust.save();
  res.redirect("/customer");
});

router.get("/update/:id", async (req, res) => {
  const customer = await customerModel.findById(req.params.id);
  if (!customer) return res.status(404).send("Khong tim thay");
  res.render("customer/update", { customer }); //co dang key-value nhung viet tat
});

router.post("/update/:id", upload.single("image"), async (req, res) => {
  //validate req.params.id vs req.body.id
  const body = req.body;
  let file = req.file;

  if (!file) {
    await customerModel.findByIdAndUpdate(req.params.id, body);
    res.redirect("/customer");
  } else {
    let cust = new customerModel({
      _id: body.id,
      fullname: body.fullname,
      password: body.password,
      email: body.email,
      image: file.filename, //filename nay la cai filename trong template line 11
    });
    await customerModel.findByIdAndUpdate(req.body.id, cust);
    res.redirect("/customer");
  }
});

router.get("/delete/:id", async function (req, res, next) {
  const customer = await customerModel.findById(req.params.id);

  if (!customer) {
    // Handle customer not found
    // For example, redirect to an error page
    return res.redirect("/error");
  }

  res.send(`
    <script>
      if (confirm("Are you sure you want to delete this customer?")) {
        window.location.href = "/customer/delete-confirm/${req.params.id}";
      } else {
        window.location.href = "/customer";
      }
    </script>
  `);
});
router.get("/delete-confirm/:id", async function (req, res, next) {
  await customerModel.deleteOne({ _id: req.params.id });
  res.redirect("/customer");
});

module.exports = router;
