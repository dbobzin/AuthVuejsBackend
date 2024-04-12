const upload = require("../middleware/upload");
const dbConfig = require("../config/db");

const { MongoClient } = require("mongodb");
const { GridFSBucket } = require("mongodb");
const url = dbConfig.url;

const mongoClient = new MongoClient(url);
const baseUrl = "http://localhost:8080/files/";

const uploadFiles = async (req, res) => {
    try {
        await upload(req, res);

        if (!req.file) {
            return res.status(400).send({
                message: "You must select a file.",
            });
        }

        return res.status(200).send({
            message: "File has been uploaded.",
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).send({
            message: `Error when trying to upload image: ${error.message}`,
        });
    }
};

const getListFiles = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const images = database.collection(dbConfig.imgBucket + ".files");

        const cursor = images.find({});

        if ((await cursor.count()) === 0) {
            return res.status(404).send({
                message: "No files found!",
            });
        }

        let fileInfos = [];
        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename,
            });
        });

        return res.status(200).send(fileInfos);
    } catch (error) {
        console.error("Error fetching file list:", error);
        return res.status(500).send({
            message: `Error fetching file list: ${error.message}`,
        });
    }
};

const download = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        const downloadStream = bucket.openDownloadStreamByName(req.params.name);
        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error downloading file:", error);
        return res.status(500).send({
            message: `Error downloading file: ${error.message}`,
        });
    }
};

module.exports = {
    uploadFiles,
    getListFiles,
    download,
};
