
class TestController {
  async test(req, res) {
    return res.status(200).json({
      status: "success",
      data:{
        body: req.body,
        request: req.headers,
      }
    });
  }
}
export default new TestController();
