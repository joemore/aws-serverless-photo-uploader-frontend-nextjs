# Photo Uploader Project (Frontend)

<img
  src="https://cdn.3dnames.co/uploads/joemore.com/blogs/photo-uploader/photo-uploader-with-screenshot-3-md.webp"
  alt="AWS Overview"
  title="AWS Overview"
  style="display: block; margin: 0 auto 10px; max-width: 500px; border-radius:20px">

Please note - this is part of an open source project written by me, Joe Gilmore - you can read the full details of this project here
[joemore.com/photo-uploader-with-aws-serverless-nextjs-and-tailwind/](https://www.joemore.com/photo-uploader-with-aws-serverless-nextjs-and-tailwind/)

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

## Version 1.0.1 Update

1. Backend now uses AWS SDK Version 3
2. Frontend now paginates through the results using the new NextToken passed from the backend.

## Version 1.0.2 Update

- Added heic2any to convert HEIC files to JPG, also added in PNG, and GIF upload support.
