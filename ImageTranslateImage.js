const express = require("express")
const app = express();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
// 서비스 URL로 변경되어야 함
const port = 3009;

// multer: body 객체와 한 개의 file 혹은 여러개의 files 객체를 request 객체에 추가
const multer = require("multer");
const upload = multer({ dest: "uploads/imageTranslateImage/" }).single("image");

// req.body를 생성하고, json 파싱
app.use(express.json());
// req.body를 생성하고, formdata 파싱
app.use(express.urlencoded({ extended: true }));

app.post("/imageTranslateImage", (req, res) => {
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
        console.log(file);

      // 네이버 접속정보
      client_id = "nuhgb1z5i4";
      client_secret = "ZCVxJQM1gdVriGyIKTo5ULkI4akam5wjscIamPCg";
      // 사물감지 API 주소
      const api_url =
        "https://naveropenapi.apigw.ntruss.com/image-to-image/v1/translate";

      if (file != null) {
        const form = new FormData();
        form.append("source", "en");
        form.append("target", "ko");
        form.append("image", fs.createReadStream("uploads/imageTranslateImage/" + file.filename));
    
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