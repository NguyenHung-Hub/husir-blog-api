const mongoose = require("mongoose");
const configs = require("../config");

const connectDB = () => {
    console.log(configs.NODE_ENV);
    // if (configs.NODE_ENV == "development") {
    //     console.log("dev");
    // }
    mongoose.connect(
        configs.NODE_ENV.includes("development")
            ? configs.DATABASE_URL
            : configs.DATABASE_URL_PROD,
        (error) => {
            if (error) {
                console.error("> Connect database fail: ", error);
            } else {
                console.log("> Connect database success!!! ");
            }
        },
        {}
    );
};

module.exports = connectDB;
