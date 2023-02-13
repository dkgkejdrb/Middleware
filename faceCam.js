// searcFace  /face  post  얼굴 감지
const express = require("express")
const app = express();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
// 서비스 URL로 변경되어야 함
const port = 3007;

// multer: body 객체와 한 개의 file 혹은 여러개의 files 객체를 request 객체에 추가
const multer = require("multer");
const upload = multer({ dest: "uploads/CFRfaceCam/" }).single("image");

// req.body를 생성하고, json 파싱
app.use(express.json());
// req.body를 생성하고, formdata 파싱
app.use(express.urlencoded({ extended: true }));

app.post("/faceCam", (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
          } else if (err) {
            console.log("An unknown error occurred when uploading.");
          }
      
          // cor 패스
          res.header("Access-Control-Allow-Origin", "*");

        // console.log(req)
    const file = req.file;

      // 네이버 접속정보
      client_id = "cp1p420rne";
      client_secret = "y3cYkPSMlGSgbp64aScunDXAgumof6JOrWaneUpZ";
      // 유명인 얼굴인식 API 주소
      const api_url =
        "https://naveropenapi.apigw.ntruss.com/vision/v1/face";

      if (file != null) {
        const form = new FormData();
        // 네이버 API 요청 시, image 필드명이 반드시 필요
        form.append("image", fs.createReadStream("uploads/CFRfaceCam/" + file.filename));
        
        // const form = new FormData();
        // // 네이버 API 요청 시, image 필드명이 반드시 필요
        // form.append("image", file);
    
        axios.post(api_url, form, {
          headers: {
            // axios는 content-type을 자동으로 잡지 못하기 때문에 아래와 같이 contenty-type을 보냄
            // ...form.getHeaders(),
            "Content-Type": "multipart/form-data",
            "X-NCP-APIGW-API-KEY-ID": client_id,
            "X-NCP-APIGW-API-KEY": client_secret,
          },
        })
        .then((response) => {
          res.send(response.data);
        })
        .catch((err) => {
          res.send(err.response.data.errorMessage);
        });
      }
    })
})

app.get("*", (req, res) => {
    res.send("잘못된 경로입니다.");
  });

  app.listen(port, () => {
    console.log("Listening...");
  });