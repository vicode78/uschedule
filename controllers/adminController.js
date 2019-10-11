const Patient = require("../models/patient");
const Hospital = require("../models/hospital");
const Admin = require("../models/admin");
const Appointment = require("../models/appointment");

module.exports = {
  profileGet: async (req, res) => {
    await Patient.countDocuments(async (err, totalPatients) => {
      await Hospital.countDocuments(async (err, totalHospitals) => {
        await Appointment.countDocuments(async (err, totalAppointments) => {
          await Admin.findOne({ fullName: "misheal" }, (err, admin) => {
            res.render("admin/dashboard", {
              layout: "admin",
              admin: admin,
              totalPatients,
              totalHospitals,
              totalAppointments
            });
          });
        });
      });
    });
  },
  logoutGet: (req, res) => {
    req.logout();
    req.flash("success", "see you later");
    res.redirect("/");
  },
  patientGet: async (req, res) => {
    await Appointment.find().then(patientAppointment => {
      res.render("admin/patientAppointment", {
        layout: "admin",
        patientAppointment
      });
    });
  },
  sendAppointmentGet:(req, res)=>{
      Appointment.findById(req.params.id).then(appointment=>{
          req.flash('success', 'one application found')
          console.log('found appointment', appointment)
          
      }).catch(err=>{
          console.log(err)
      })
  },
  allHospitalGet:async(req, res)=>{
    await Hospital.find().then(hospital=>{
      res.render('admin/allHospital', {layout:'admin', hospital})
    })
  }
};
