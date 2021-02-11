# WALLET API

An e-wallet system with Flutterwave payment gateway integrated for wallet funding.

## Technologies Used

- [NodeJS](https://nodejs.org/en/download/) - A cross-platform JavaScript runtime
- [ExpressJS](https://expressjs.com/) - NodeJS application framework
- [MySQL](https://www.mysql.com/downloads/) - A relational database management system
- [Sequelize ORM](https://sequelize.org/) - A promise-based Node.js ORM for relational databases

## Installing/Running locally

- Clone or fork repo

  ```bash
    - git clone https://github.com/supercede/wallet-app-flw.git
    - cd wallet-app-flw
  ```
- Create/configure `.env` environment with your credentials. A sample `.env.example` file has been provided. Make a duplicate of `.env.example` and rename to `.env`, then configure your credentials (ensure to provide the correct details). After configuring your database in accordance with the Sequelize config file (`src/config/config.js`):

  ```
      - npm install
      - npm run db:seed
  ```
- Run `npm run dev` to start the server and watch for changes

## Documentation

- Check [Postman](https://documenter.getpostman.com/view/8630438/TW77i4cQ) for documentation
