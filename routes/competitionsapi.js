import express from "express";
import Competitions from "../models/competitions.js";
import CompetitionEnroll from "../models/competitionenroll.js";
const router = express.Router();
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'rohitpotnuru2003@gmail.com', // Your Gmail email address
        pass: 'acsqcrequanwmgso' // Your Gmail password
    }
  });
  
router.get("/fetchAllCompetitions", async (req, res) => {
    try {
        const competition = await Competitions.find({});
        res.json(competition);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/addCompetition", async (req, res) => {
    try {
        const competition = new Competitions(req.body);
        const newCompetition = await competition.save();
        res.json(newCompetition);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/competitionEnroll",async (req,res)=>{
    let ok = false;

    try{
        const existingCompetition = await CompetitionEnroll.findOne({
            rollNo: req.body.rollNo,
            competitionId: req.body.competitionId
        });
        if (existingCompetition) {
            // Event with the same rollNo and eventId already exists
            // You can handle this case based on your requirements
            // For example, you might want to update the existing entry or return an error
            res.status(400).json({ ok,error: "Competition already enrolled for this student" });
           // console.log(ok);
            return;
        }
        const mailOptions = {
            from: 'rohitpotnuru2003@gmail.com', // Sender address
            to: req.body.email, // User's email address
            subject: 'Competition Enrollment Confirmation', // Subject line
            text: `Dear ${req.body.username},\n\nThank you for enrolling for the competition "${req.body.competitionName}".\n\nYour enrollment details:\nRoll Number: ${req.body.rollNo}\nCompetition ID: ${req.body.competitionId}\n\nWe look forward to seeing you at the competition!\n\nBest regards,\nNIT ANDHRA PRADESH`, // Plain text body
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error('Error occurred:', error.message);
                res.status(500).send('Failed to send email');
            } else {
                console.log('Email sent successfully!');
                console.log('Message ID:', info.messageId);
                res.send('Email sent successfully!');
            }
        });
      



        const competitionEnroll=new CompetitionEnroll(req.body);
        const newCompetition=await competitionEnroll.save();
        ok = true;
        // const {eventId} = savedEvent;
        res.json({ok,newCompetition});
    }
    catch(error){
        ok=false;
        console.error(error.message);
        res.status(500).send({ok,message:"Internal Server Error"})
    }
})

router.put("/updateCompetition/:id", async (req, res) => {
    try {
        const { competitionId,competitionImage, competitionName, competitionDescription, competitionPrice, competitionDate,clubName,competitionVenue } = req.body;
        const newCompetition = {};
        if(competitionId){newCompetition.competitionId=competitionId}
        if(competitionImage){newCompetition.competitionImage = competitionImage};
        if(competitionName){newCompetition.competitionName= competitionName};
        if(competitionDescription){newCompetition.competitionDescription = competitionDescription};
        if(competitionDate){newCompetition.competitionDate = competitionDate};
        if(competitionPrice){newCompetition.competitionPrice = competitionPrice};
        if(clubName){newCompetition.clubName=clubName}
        if(competitionVenue){newCompetition.competitionVenue=competitionVenue}

        let competition = await Competitions.findById(req.params.id);
        if(!competition) { res.status(404).send("Not Found") }

        competition = await Competitions.findByIdAndUpdate(req.params.id, {$set: newCompetition}, {new:true})
        res.json({competition});
        const registeredMembers = await CompetitionEnroll.find({ competitionId: competition.competitionId });
        registeredMembers.forEach(async (member) => {
            const mailOptions = {
                from: 'rohitpotnuru2003@gmail.com',
                to: member.email,
                subject: 'Competition  Details Updated',
                text: `Dear ${member.username},\n\nThe details for the event "${competition.competitionName}" have been updated.\n\nNew Event Details:\nCompetition ID: ${competition._id}\nDescription: ${competition.competitionDescription}\nDate: ${competition.competitionDate}\nVenue: ${competition.competitionVenue}\n\nRegards,\nYour Organization`
            };

            // Send email
            await transporter.sendMail(mailOptions);
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.delete("/deleteCompetition/:id", async (req, res) => {
    try {
        let competition = await Competitions.findById(req.params.id);
        if(!competition) { return res.status(404).send("Not Found") }
        competition = await Competitions.findByIdAndDelete(req.params.id);
        res.json({competition: competition});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

export default router;