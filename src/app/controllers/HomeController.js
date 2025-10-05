class HomeController{
dashboard(req,res,next){
     res.render("home/dashboard", { page: { title: "Trang chủ" } });
}
}

module.exports = new HomeController();