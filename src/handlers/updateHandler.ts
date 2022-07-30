import { execSync } from "child_process";
import dotenv from "dotenv";
import { logger } from "..";
dotenv.config();

function checkForUpdate() {
    execSync("git remote update");
    const res = execSync("git status");
    if (!res.toString().includes("Your branch is up to date")) {
        logger.log("Update available!");
        logger.log("Updating...");
        execSync("git pull");
        setTimeout(() => {
            logger.log("Restarting...");
            process.exit(0);
        }, 5000);
    }
}

export default async function () {
    setInterval(checkForUpdate, (1000 * parseInt(process.env.CHECK_UPDATE_INTERVAL || "600")) | 600);
}
