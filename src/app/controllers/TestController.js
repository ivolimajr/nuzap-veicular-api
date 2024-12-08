class TestController {
  async test(req, res) {
    return res.status(200).json({ message: "Olá!" });
  }
}

export default new TestController();
