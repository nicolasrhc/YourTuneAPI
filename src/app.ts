import express from "express";
import path from "path";
var cors = require('cors');
import * as bodyParser from "body-parser";
import { loadApiEndpoints } from "./controllers/api";
import { loadLastFMEndpoints } from "./controllers/lastfm";
import { connect } from "../src/config/db";
import { loadUserEndpoints } from "./controllers/user";
import { loadCommunitiesEndpoints } from "./controllers/communities";
import { loadPostsEndpoints } from "./controllers/post";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 8888);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({
  limit: "20mb",
}));
app.use(bodyParser.urlencoded({
  limit: "20mb",
  extended: true,
}));
app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));

loadApiEndpoints(app);
loadLastFMEndpoints(app);
loadUserEndpoints(app);
loadCommunitiesEndpoints(app);
loadPostsEndpoints(app);
connect();

export default app;
