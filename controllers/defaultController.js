
const nodemailer =require('nodemailer')

module.exports = {
  index: (req, res) => {
    res.render("default/index");
  },
  aboutGet: (req, res) => {
    res.render("default/about");
  },
  contactGet: (req, res) => {
    res.render("default/contact");
  },
  loginGet: (req, res) => {
    res.render("default/login");
  },
  departmentGet: (req, res) => {
    res.render("default/department");
  },
  loginPost: (req, res) => {
    console.log(req.body);
  },
  profileGet: async (req, res) => {
    console.log(req.user.usertype);
    if (req.user.usertype === "Patient") {
      return res.redirect("/patient/profile");
    } else if (req.user.usertype === "Hospital") {
      return res.redirect("/hospital/profile");
    } else if (req.user.usertype === "Admin") {
      return res.redirect("/admin/profile");
    } else {
      return req.flash("error", "no user found");
    }
  },
  logoutGet: (req, res) => {
    req.logout();
    req.flash("success", " see you later");
    res.redirect("/");
  },
  contactGet: (req, res) => {
    res.render("default/contact");
  },
  contactPost: (req, res) => {

    var mailOptions, smtpTrans

    smtpTrans = nodemailer.createTransport({
      service:'Gmail',
      auth:{
        user: process.env.Gmail,
        pass:process.env.password
      },
      tls:{
        rejectUnauthorized:false
      }
    })

    // =====mail options=======
    mailOptions = {
      from:req.body.email,
      to:process.env.Gmail,
      subject:req.body.subject,
      text:req.body.text
    };

    smtpTrans.sendMail(mailOptions, function(error, response){
      if(error){
        req.flash('error','mail not sent')
        console.log('failingifbd+==============================')
        return res.redirect('/contact')
      }else{
        console.log('success_--------------------------------------------')
        req.flash('success','mail sent successfully')
        res.redirect('/contact')
      }
      smtpTrans.close()
    })
  }
}

