import Fastify from 'fastify'

async function startServer() {
    const fastify = Fastify({
        logger: true
    })
    fastify.get("/", async (request, reply) => {
        return { message: "Hello from Fastify!" };
    });

    try {
        const port = 8080;

        await fastify.listen({ port: Number(port), host: "0.0.0.0" });

        console.log("server listening on port " + port)

    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}


startServer()