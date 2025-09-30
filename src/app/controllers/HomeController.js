class HomeController {
  dashboard(req, res, next) {
    res.send("test");
  }
}

module.exports = new HomeController();
