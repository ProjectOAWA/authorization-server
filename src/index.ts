import express from "express";
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import rateLimit from "express-rate-limit";
import * as routes from "./routes";

const PORT = process.env.PORT || 3000;

// Set up express and middleware
const app = express();

// Trust proxies inside docker network (nginx)
app.set('trust proxy', '172.16.0.0/12');

app.use(bodyparser.json());
app.use(cookieParser());
app.use(rateLimit({ // 50 requests per 15 minutes
	windowMs: 15 * 60 * 1000,
	limit: 50, // TODO: Fine-tune params
	ipv6Subnet: 64,
	// store: rate-limit-redis,
}));

// Keep routes defined in routes.ts for readability
routes.register(app);

// Start listening
app.listen(PORT, () => {
	console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
