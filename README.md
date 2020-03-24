An app to accompany the [Climate Museum](https://climatemuseum.org/)'s 2020 exhibit, allowing
people to make specific commitments to combat climate inaction and visualize their collective
impact.

# Developing

Uses the [Gatsby Starter Default](https://github.com/gatsbyjs/gatsby-starter-default) as the
starting point.

## Resources

[Deploying to Firebase](https://www.gatsbyjs.org/docs/deploying-to-firebase/)


## Develop locally: Installation

1. Install gatsby: `npm install -g gatsby-cli`
1. Install Firebase tools: `npm install -g firebase-tools`
1. Clone this repo and cd inside.
1. Install the frontend packages
    ```
    cd frontend/
    yarn install
    ```
1. Install the cloud functions packages
    ```
    cd functions/
    yarn install
    ```

## Deploying

To staging:
```sh
cd frontend/
npm run deploy-staging
```

To production
```sh
cd frontend/
npm run deploy-production
```

## Develop Locally
```sh
# Start the firebase emulators in one shell
firebase emulators:start

# Run the local frontend server in another
cd frontend/
npm run develop
```

