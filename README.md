## 🧱 Build/deploy status

![Build Status TEST](todo-add-build-badge-for-test-here)
![Build Status PROD](todo-add-build-badge-for-prod-here)

# 🏞 Simple Backend Assignment

This repository provides backend API functionality for vehicle brand counter service, using [Serverless Framework](https://www.serverless.com/framework/docs).

## 🛠️ Before getting started

- Before deploying this service, you should fill out the appropriate environment variables in [`/config/env.yml`](/config/env.yml) such as `AWS_ACCOUNT`, `AWS_REGION`, and `VEHICLE_BRANDS_BUCKET`. Given that S3 buckets require globally unique names, this (most likely) won't deploy as-is.

## 📃 Getting started

- ⚙️ Install dependencies: `npm i`
- ▶️ Run lambas locally: `npm start`
- 🧪 Run tests: `npm t`

## 🗂 Project structure

- [/serverless.ts](/serverless.ts): entry point for any settings in the project
- [/jest.config.js](/jest.config.js): Configure tests.

- [/config/env.yml](/config/env.yml): Configure environment params that can be accessed in the code with `process.env.NAME_OF_PARAM`
- [/config/functions.ts](/config/functions.ts): Configure lambda functions.
- [/config/iam.ts](/config/iam.ts): Configure permissions of the role that the Lambda functions will have when running. If a lambda function needs to access dynamoDB the right access for that needs to be added here.
- `/config/{service}.ts`: Separate services by their own file, and import them into `/config/resources.ts`, e.g. [/config/dynamodb.ts](/config/dynamodb.ts)
- [/config/resources.ts](/config/resources.ts): AWS resources such as DynamoDB tables.
- [/buildspec](/buildspec): Build and deployment specification for test and production environment.

## 🐛 Debugging

- In VSCode you can click run and debug and choose between debugging lambdas or unit tests.

## 👷🏻‍♀️ Setup deployment

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
- Production environment should be deployed manually, either by:
  1. Running `npm run deploy:prod`
  2. Locating the CodeBuild project and manually starting a build
- Build spec files for test/prod are located in the `/buildspec` directory.
