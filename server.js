import { fastify } from 'fastify';
// import { DatabaseMemory } from './database-memory.js';
import { DatabasePostgres } from './database-postgres.js';

const server = fastify()

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

server.get('/', () => {
    return 'Hello World'
})

server.post('/videos', async (request, reply) => {
    const {title, description, duration} = request.body
    
    await database.create({
        title: title,
        description: description,
        duration: duration,
    })


    return reply.status(201).send()
})

server.get('/videos', async (request) => {
    const search = request.query.search
    console.log(search)

    const videos = await database.list(search)

    return videos
})

server.put('/videos/:id', async (request, reply) => {
    const videosId = request.params.id
    const {title, description, duration} = request.body

    await database.update(videosId, {
        title: title,
        description: description,
        duration, duration
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
    const videosId = request.params.id

    await database.delete(videosId)

    return reply.status(204).send()
})

try {
    server.listen({
        port: process.env.PORT ?? 3333, 
    })
} catch(e) {
    console.log(e)
}
