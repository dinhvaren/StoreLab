class AdminController {
  dashboard(req, res, next) {
    res.render("home/admin", { title: "Admin" });
  }

  editUsers(req, res, next){

  }
  deleteUsers(req, res, next){
    
  }
}

module.exports = new AdminController();
