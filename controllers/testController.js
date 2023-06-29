 const testController = (req, res) => {
  res.status(200).send({
    message: "Hello World!",
    success: true,
  });
};

module.exports = {testController};