const express = require("express");
const app = express();
const Web3 = require('web3');

const PORT = 3050;
const { contractABI, contractAddress } = require("./utils/constants");


const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/6984a40a1c61443dbf27e3534544f896');
const web3 = new Web3(provider);
const smartContract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

// The third party address
const address = '0xBcFC68e3470d348791a54874d1687D58ACd6f4E4'

app.get("/", (req, res) => {
  res.render("index", { address });
});



app.get("/callback", (req, res) => {
  if (req.query.status === '200')
  {
    let name, isOver18;

    smartContract.methods.showUserInfoByOrg(req.query.user).call({ from: address }).then(data => {
      name = data.name;
      console.log('name', name);
      smartContract.methods.showUserInfoBoolsByOrg(req.query.user).call({ from: address }).then(data => {
        isOver18 = data.isOver18;
        console.log('isOver18', isOver18);
        if (isOver18==1)
          res.render("home", { name });
        else
          res.render("not_allowed");
      });
    });
  }
  else
  {
    res.render("not_allowed");
  }
});

app.listen(PORT, () => {
  console.log(`[SERVER:EXT] STARTED`);
});
