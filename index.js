import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import "core-js/stable";
import { async } from "regenerator-runtime";

const app = express();
const port = 3000;
let workarr = [];
let todayarr = [];

const todayarrContents = fs.readFileSync("todayarr.txt", "utf-8");
todayarrContents.split(/\r?\n/).forEach((line) => {
  const getlen = `${line}`.length;
  if (getlen != 0) {
    todayarr.push(`${line}`);
  }
});

const workarrContents = fs.readFileSync("workarr.txt", "utf-8");
workarrContents.split(/\r?\n/).forEach((line) => {
  const getlen = `${line}`.length;
  if (getlen != 0) {
    workarr.push(`${line}`);
  }
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/submit", (req, res) => {
  let task = req.body.task;
  let listType = req.body.listType;

  console.log("Task " + task + "List Type " + listType);

  if (listType == "today") {
    console.log("Check 1");
    todayarr.push(task);
    task = task + "\n";
    fs.appendFile("todayarr.txt", task, (err) => {
      if (err) throw err;
    });
    const data = { items: todayarr };
    res.render("today.ejs", data);
  }

  if (listType == "work") {
    console.log("Check 2");
    workarr.push(task);
    task = task + "\n";
    fs.appendFile("workarr.txt", task, (err) => {
      if (err) throw err;
    });
    const data = { items: workarr };
    res.render("work.ejs", data);
  }
});

app.post("/deleteTask", (req, res) => {
  let idin = req.body.id;
  let listTypein = req.body.listType;

  if (listTypein == "today") {
    todayarr.splice(idin, 1);
    const data = { items: todayarr };
    res.render("today.ejs", data);
  } else {
    workarr.splice(idin, 1);
    const data = { items: workarr };
    res.render("work.ejs", data);
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs", {});
});

app.get("/today", (req, res) => {
  const data = { items: todayarr };
  res.render("today.ejs", data);
});

app.get("/work", (req, res) => {
  const data = { items: workarr };
  res.render("work.ejs", data);
});

app.get("/save", (req, res) => {
  let getlentoday = todayarr.length;
  let getlenwork = workarr.length;
  fs.writeFile("todayarr.txt", "", function () {});
  fs.writeFile("workarr.txt", "", function () {});

  for (let i = 0; i < getlentoday; i++) {
    let content = todayarr[i];
    if (todayarr[i].length != 0) {
      content += "\n";
      fs.appendFile("todayarr.txt", content, (err) => {});
    }
  }

  for (let j = 0; j < getlenwork; j++) {
    let content2 = workarr[j];
    if (workarr[j].length != 0) {
      content2 += "\n";
      fs.appendFile("workarr.txt", content2, (err) => {});
    }
  }

  const data = { saved: "Saved" };
  res.render("index.ejs", data);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
