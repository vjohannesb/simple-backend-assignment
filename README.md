## 🧱 Build/deploy status

![Build Status TEST](todo-add-build-badge-for-test-here)
![Build Status PROD](todo-add-build-badge-for-prod-here)

# 🏞 Simple Backend Assignment

This repository provides backend API functionality for vehicle brand counter service, using [Serverless Framework](https://www.serverless.com/framework/docs).

## 📝 Assignment

- ☑️ Use any mechanism to place a text document in a S3 bucket. The text file will contain one or many vehicle brands, one on each row in the document.
- ☑️ Placing the document on S3 will trigger a Lambda function, that will:
  - ☑️ read the document
  - ☑️ parse each line
  - ☑️ post the content (a brand name) on a SQS queue.
  - ☑️ If the operation is successful, delete the input file.
  - ☑️ If the operation is unsuccessful produce a meaningful error output to the log.
  - ☑️ Empty file and unreadable/corrupt file will produce error logs.
- ☑️ Another Lambda function will consume the SQS queue.
  - ☑️ The content of the message (a brand) will be stored in a database.
  - ☑️ The data should be structured according to DynamoDB best practices and stored in a way that allows for keeping track of how many times a certain type of brand have been registered.
  - ☑️ An info log entry will be outputted to CloudWatch for each new message, if the operation is successful.
  - ☑️ Identify potential errors that can occur and output these errors to the log.
  - ☑️ _For extra credit expose rest endpoints for the 2 queries exemplified above
    using serverless technologies._

## 🏛 Architecture

![Architecture](/service-architecture.drawio.svg)

## ⛔️🛠️ Before getting started

- Before deploying this service, you should fill out the appropriate environment variables in [`/config/env.yml`](/config/env.yml) such as `AWS_ACCOUNT` and `VEHICLE_BRANDS_BUCKET`. Given that S3 buckets require globally unique names, this (most likely) won't deploy as-is.
- Add your repository name in [/serverless.ts](/serverless.ts) - this is what your CloudFormation stack will be named
- Create a bucket in your AWS Account named `{aws_account_id}.serverless.deploys` e.g. `123456789.serverless.deploys`
- Serverless Framework will automatically create a bucket since a lambda function is listening on a DynamoDb event (`/config/functions.ts:'vehicle-brands-file-handler'`) - however **this bucket will be public** so if this is not desirable, configure your S3 using the structure detailed below. E.g. `/config/s3.ts` containing a CloudFormation definition of your S3 bucket.
- After deployment: add a folder called `uploads` in your bucket (not ...serverless.deploys) - this is where your text files will go.

## 📃 Getting started

- ⚙️ Install dependencies: `npm i`
- ▶️ Run lambas locally: `npm start`
- 🧪 Run tests: `npm t`
- 🐛 Debugging: Using VSCode you can `Run and Debug` both lambdas and unit tests (config: [/.vscode/launch.json](/.vscode/launch.json))

## 🗂 Project structure

- [/serverless.ts](/serverless.ts): entry point for any settings in the project
- [/jest.config.js](/jest.config.js): Configure tests.

- [/config/env.yml](/config/env.yml): Configure environment params that can be accessed in the code with `process.env.NAME_OF_PARAM`
- [/config/functions.ts](/config/functions.ts): Configure lambda functions.
- [/config/iam.ts](/config/iam.ts): Configure permissions of the role that the Lambda functions will have when running. If a lambda function needs to access dynamoDB the right access for that needs to be added here.
- `/config/{service}.ts`: Separate services by their own file, and import them into `/config/resources.ts`, e.g. [/config/dynamodb.ts](/config/dynamodb.ts)
- [/config/resources.ts](/config/resources.ts): AWS resources such as DynamoDB tables.
- [/buildspec](/buildspec): Build and deployment specification for test and production environment.

## 🔨Manual deployment

- authorize locally (e.g. using aws-cli)
- run `npm run deploy:test` or `npm run deploy:prod`

## 👷🏻‍♀️ CI/CD deployment with CodeBuild

- Go to CodeBuild on the account where you want to deploy this service and click `Create project`
- Project configuration:
  - Fill out `Project name` and `description`
  - Check `Enable build badge`
- Source:
  - Choose GitHub and `Repository in my GitHub account`
  - Select this repo by searching for it
- Primary source webhook events (for CI/CD):
  - Webhook: `Rebuild every time a code change is pushed to this repository`
  - Check `Single build`
  - Event type: `PUSH`
  - Start a build under these conditions:
    - HEAD_REF: `^refs/heads/main$`
- Environment:
  - Choose `Managed image`:
    - Operating system: `Ubuntu`
    - Runtime(s): `Standard`
    - Image Version: `latest` (`aws/codebuild/standard:6.0` at the time)
  - Service role:
    - Existing service role: `codebuild-service-role`<sup>[1]</sup>
    - Uncheck `Allow AWS CodeBuild to modify this service role so it can be used with this build project`
- Buildspec
  - Use a buildspec file
  - Buildspec name: `buildspec/test.yml` or `buildspec/prod.yml` (depending on environment)
- Click `Create build project`

<sup>[1]</sup> If you have not already set up a `codebuild-service-role`, you can read more on how to do that in the [AWS Documentation](https://docs.aws.amazon.com/codebuild/latest/userguide/setting-up.html)

## ✨ Deployment

- On every commit CI/CD pipeline for the test environment will build and deploy to Test.
- Production environment can be deployed manually, either by:
  1. Running `npm run deploy:prod`
  2. Locating the CodeBuild project and manually starting a build
- Build spec files for test/prod are located in the `/buildspec` directory.
