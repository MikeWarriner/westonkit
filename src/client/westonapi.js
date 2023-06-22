var server = "https://api.westonpark.com";
const axios = require('axios');

exports.delete = async function (url, config) {
    return axios.delete(server + url, config);
}

// var counter = 0;
exports.put = async function (url, config) {
    // counter++;
    // var timeConfig = "put_" + counter + "_" + url;
    try {
        //    config.proxy = {host:'127.0.0.1', port:8888};
        // console.time(timeConfig);
        return await axios.put(server + url, config);
    }
    catch (error) {
        if (error.response) {
            throw error.response.data;
        } else if (error.request) {
            throw "REQUEST ERROR : "+error.request;
        } else {
            // Something happened in setting up the request that triggered an Error
            throw error.message;
        }
    }
    finally {
        console.timeEnd(timeConfig);
        counter--;
    }
    return { status: 500, body: 'error' };
}




exports.get = async function (url, config) {
    try {
        return await axios.get(server + url, config);
    }
    catch (error) {
        if (error.response) {
            throw error.response.data;
        } else if (error.request) {
            throw "REQUEST ERROR : "+error.request;
        } else {
            // Something happened in setting up the request that triggered an Error
            throw error.message;
        }
    }
    return { status: 500, body: 'error' };
}
