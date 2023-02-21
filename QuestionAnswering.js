// 질문답변 백
const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const cors = require("cors");
// 서비스 URL로 변경되어야 함
const port = 3005;

// multer: body 객체와 한 개의 file 혹은 여러개의 files 객체를 request 객체에 추가
const multer = require("multer");
// 업로드 위치 지정, 만약 'uploads' 경로가 없다면 폴더 생성
// ★ 중요) .singlie('image') 는 req.file에 parsing 할 때, 필수. image 필드이름으로 전송한 파일을 parsing 함
const upload = multer({ dest: "uploads/questionAswering/" }).single("image");
// const upload = multer({ dest: "uploads/CFRcelebrity/" }).array("image");

// cors 허용
app.use(cors());

// req.body를 생성하고, json 파싱
app.use(express.json());
// req.body를 생성하고, formdata 파싱
app.use(express.urlencoded({ extended: true }));

app.post("/questioningAnswering", (req, res) => {
    // upload 필수
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
        } else if (err) {
        console.log("An unknown error occurred when uploading.");
        }
    });

    const file = req.body;

    console.log(req);

    // 네이버 접속정보
    const api_key = "NTA0MjU2MWZlZTcxNDJiYxjpO+XPT1MlseoSSnY6w4KFvDskA8fmaLkHwT1BgLegcbpf9sGYysfBHFhtpD10UYyUDdfV4rDNVA9NiaS4erYz/QtnjE4d7oCWKAZViZ6gARgLC+JL5VrdZZI/r3bLDwLx8c4Nq9sxL0JzDyDQzCdaKiRSEskPHBTGdPqaAj0lUZPfylfVmQ+cjUsYvftezhFpiUOKnbL2eEL7nix12oc=";
    const client_secret = "xG2hgTB5ypuvujm4ubKlYM5pXXDbY7lDeu8fSLTc";
    // 유명인 얼굴인식 API 주소
    const api_url =
        // "https://clovastudio.apigw.ntruss.com/testapp/v1/completions/LK-B";
        file?.engine;

    if (file !== null) {
        axios.post(api_url, file, {
            headers: {
                // axios는 content-type을 자동으로 잡지 못하기 때문에 아래와 같이 contenty-type을 보냄
                //   ...form.getHeaders(),
                // "Content-Type": 'application/json',
              "X-NCP-CLOVASTUDIO-API-KEY": api_key,
              "X-NCP-APIGW-API-KEY": client_secret,
            },
        })
        .then((response) => {
            res.send(response.data);
        })
        .catch((error) => {
            console.log(error)
        })
    }
})


app.get("*", (req, res) => {
    res.send("잘못된 경로입니다.");
  });

  app.listen(port, () => {
    console.log("Listening...");
  });