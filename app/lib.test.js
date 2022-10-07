import { strict as assert } from "node:assert";
import { getPostTitle } from "./lib.js";

// TODO: mock fetchPosts from service.js

getPostTitle(2).then((title) => assert.equal(title, "Qui est esse"));
