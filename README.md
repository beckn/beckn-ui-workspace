# Beckn-ui-workspace


## Description

Beckn-ui-workspace is a monorepo consisting of all Beckn possible frontend use-cases and BAPs.

## Installation and Usage


1. **Use specific node version**: First install nvm on your local machine and then run the below commad to ensure accurate node version. This will automatically switch the node version.

   ```bash
   nvm use
   ```

2. **Install Dependencies**: To get started, run the following command in the root of the repository to install all the required modules using Yarn:

   ```bash
   yarn
   ```

3. **Running Individual Projects**: Each sub-project can be run individually by executing their specific commands. You can find these commands in the `package.json` file located in the root directory.

## Configurations

This monorepo is globally configured with the following tools and libraries:

1. **Yarn Workspace**: Used for creating and managing sub-projects within the monorepo.

2. **Typescript**: Provides robust type checking and enhances code quality.

3. **Jest**: Utilized for unit testing, ensuring the reliability of the codebase.

4. **Prettier and ESLint**: These tools are used for code formatting and style consistency, ensuring a clean and readable codebase.

5. **Husky**: Sets up commit hooks to run on both commit and pre-commit actions, helping maintain code quality and enforcing best practices.

6. **Commit-lint**: Enforces a structured commit message format. Please refer to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) documentation for commit message conventions.

Feel free to explore and contribute to the various front-end use cases and BAPs within this monorepo. If you have any questions or need any more help, please refer to the individual project documentation or reach out to the repository maintainers. 

Happy coding!

## Release Notes

## v1.1.0 (Latest)
### 🚀 Features
- Added comprehensive E2E testing for Dragon Foods, HarmoniAid, Sky Analytics and Forest apps
- Implemented complete P2P energy trading functionality in Open Spark
- Enhanced policy admin portal with new features and fixes
- Added trade details page with file upload capabilities
- Integrated MyDERs page with CRUD operations

### 🛠 Improvements
- Enhanced API integrations across apps
- Improved error handling and validation
- Updated deployment configurations for AWS Amplify
- Enhanced package management

### 🐛 Bug Fixes
- Fixed header value issues for consumer and producer trade details
- Resolved invalid token and user profile API issues
- Fixed multiple UI cosmetic issues
- Resolved CORS errors in climate and forest apps

## v1.0.0
### 🚀 Features
- Launched Dragon Foods with complete ordering system
- Implemented comprehensive authentication flows
- Added order history tracking functionality
- Enhanced checkout and payment flows

### 🛠 Improvements
- Improved cart and checkout experiences
- Enhanced filter functionality
- Improved loading states and error messages

### 🐛 Bug Fixes
- Fixed responsive design issues

## CI/CD Workflows

This repository uses GitHub Actions to trigger AWS Amplify deployments instead of building Docker images.

Current workflows:

* `develop-1.1.0-aws-amplify-deploy.yml`
* `staging-1.1.0-aws-amplify-deploy.yml`
* `main-1.1.0-aws-amplify-deploy.yml`

## Overview

On each push to the matching release branch, the workflow:

* checks which app folders changed in the last commit
* maps those changed folders to the correct Amplify webhook secret
* triggers only the affected AWS Amplify deployments

This keeps deployments app-specific instead of rebuilding the whole monorepo.

## Branch Triggers

```yaml
develop-1.1.0
staging-1.1.0
main-1.1.0
```

Each workflow listens only to its corresponding branch.

## Deployment Flow

### 1. Checkout Code

The workflow checks out the last two commits using `fetch-depth: 2`.

### 2. Detect Changed Apps

Each workflow runs:

```bash
git diff --name-only HEAD~1 HEAD
```

and checks whether files changed under configured app directories such as:

* `apps/retail/`
* `apps/mobility-bap/`
* `apps/policy-admin/`
* `apps/tourismV1.1/`
* `apps/dsep/`
* `apps/industry_4.0/`
* `apps/odr-v2/`
* `apps/dsnp-v2/`
* `apps/OSC/`
* `apps/dragon-foods/`
* `apps/harmoni-aids/`
* `apps/sky-analytics/`
* `apps/state-forest-department/`
* `apps/envirogrowth/`
* `apps/earth-support-initiative/`

The develop workflow also includes additional app paths such as:

* `apps/open-spark/`
* `apps/deg-ec/`
* `apps/open-spark-admin/`
* `apps/open-spark-p2p/`
* `apps/deg-retail/`
* `apps/deg-rental/`
* `apps/deg-wallet/`
* `apps/deg-finance/`
* `apps/p2p-energy/`

### 3. Trigger Amplify Webhooks

If an app changed, the workflow calls the corresponding AWS Amplify webhook URL with `curl`.

## Required Secrets

Each app/environment pair requires its own webhook secret.

Examples:

* `RETAIL_DEVELOP_AMPLIFY_WEBHOOK_URL`
* `RETAIL_STAGING_AMPLIFY_WEBHOOK_URL`
* `RETAIL_MAIN_AMPLIFY_WEBHOOK_URL`
* `MOBILITY_BAP_DEVELOP_AMPLIFY_WEBHOOK_URL`
* `POLICY_ADMIN_MAIN_AMPLIFY_WEBHOOK_URL`

## Output

* Only changed apps are deployed
* Each deployment is environment-specific
* AWS Amplify handles the actual build and hosting after the webhook is triggered
- Resolved header and footer layout issues
- Fixed image loading problems

## v0.3.0
### 🚀 Features
- Added Tourism app functionality
- Implemented DSNP features
- Enhanced order tracking capabilities

### 🛠 Improvements
- Improved search functionality
- Enhanced product details pages
- Better error handling

## v0.2.0
### 🚀 Features
- Added Mobility BAP and BPP
- Enhanced responsive design
- Improved order management

### 🐛 Bug Fixes
- Fixed authentication issues
- Resolved API integration bugs
- Improved error handling

## v0.1.0
### 🚀 Initial Release
- Basic project setup
- Core functionality implementation
- Initial app structure
- Basic authentication



