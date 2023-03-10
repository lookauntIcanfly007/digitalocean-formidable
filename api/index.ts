import e, { Request, Response } from "express";
import express from "express";
import formidable from "formidable";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import fs from "fs";
const app = express();
dotenv.config();

app.use(express.static("public"));

const apiUrl = process.env.API_URL;

const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
   <script>
   localStorage.setItem("apiUrl", "${apiUrl}")
   </script>
  </body>
</html>
`;

const s3 = new aws.S3({
  endpoint: "sgp1.digitaloceanspaces.com",
});

app.get("/api", (req: Request, res: Response) => {
  res.send(html);
});

app.post("/api/uploadFile", (req: Request, res: Response) => {
  const form = formidable({ multiples: true });

  form.parse(req, (error, fields, files) => {
    const myfile = JSON.parse(JSON.stringify(files.images));

    console.log(myfile);

    if (Array.isArray(myfile)) {
      myfile.forEach((file) => {
        const filePath = file.filepath;
        const fileName = uuidv4() + file.originalFilename;
        const fileStream = fs.createReadStream(filePath);

        s3.upload(
          {
            Bucket: "msquarefdc",
            Key: `pyaephyohan/${fileName}`,
            ACL: "public-read",
            Body: fileStream,
          },
          (err, data) => {
            if (err) {
              console.log(err);
              return;
            } else if (data) {
              return console.log(data);
            }
          }
        );
      });
      return res.send({ success: "multiple files successfully uploaded" });
    } else {
      const filePath = myfile.filepath;
      const fileName = uuidv4() + myfile.originalFilename;
      const fileStream = fs.createReadStream(filePath);

      s3.upload(
        {
          Bucket: "msquarefdc",
          Key: `pyaephyohan/${fileName}`,
          ACL: "public-read",
          Body: fileStream,
        },
        (err, data) => {
          if (err) {
            console.log(err);
            return;
          } else if (data) {
            console.log(data);
          }
        }
      );
      return res.send({ success: "one file successfully uploaded" });
    }
  });
});

app.listen(3001, () => {
  console.log("express is listening on port 3001");
});
