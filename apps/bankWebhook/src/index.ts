import express from "express";

const app = express();

app.post("/hdfcWebhook", (req, res) => {
  //TODO: Add zod validation here?
  // TODO: cross-check secret from bank server
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };
  // Update balance in db, add txn
});

app.listen(4000, () => {
  console.info("> Server started on port 4000");
});
