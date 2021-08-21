import "dotenv/config";
import Application from "./aplication";

const main = async () => {
    const application = new Application();
    await application.connect();
    await application.init();
};

main().catch((err) => {
    console.error(err);
});
