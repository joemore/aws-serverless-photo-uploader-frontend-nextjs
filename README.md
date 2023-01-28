# Photo Uploader Project

Please note - this is part of an open source project written by me, Joe Gilmore - you can read the full details of this project here
[https://joemore.com/photo-uploader-with-aws-serverless-nextjs-and-tailwind/](joemore.com/photo-uploader--with-aws-serverless-nextjs-and-tailwind/)

You will need the backend AWS service installed to run this project - you can find the backend code here
[Backend Repo](https://github.com/joemore/aws-serverless-photo-uploader)

## Photo Uploader Frontend

Repo: [github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs](https://github.com/joemore/aws-serverless-photo-uploader-frontend-nextjs)

First, run the development server (You might need to run `yarn` first to install dependencies):

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Linking up the Backend

This project requires you to create an AWS backend to handle the Cognito Auth pool, and the DynamoDB and S3 systems that handle the photo uploads.

You can find the backend code here [Backend Repo](https://github.com/joemore/aws-serverless-photo-uploader) - once you have deployed the backend to AWS, you will need to copy the .env.example file and rename it to .env.local and
update the following values:

```bash
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_AWSAPIENDPOINT=https://XXXXXXXX.execute-api.us-east-1.amazonaws.com/dev
```

Run `yarn dev` again and you should be able to login and start to upload photos.
