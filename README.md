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

Feel free to explore and contribute to the various front-end use-cases and BAPs within this monorepo. If you have any questions or need further assistance, please refer to the individual project documentation or reach out to the repository maintainers. Happy coding!
