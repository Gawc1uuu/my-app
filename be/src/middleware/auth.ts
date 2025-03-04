import { FastifyRequest, FastifyReply } from 'fastify'
import { supabaseAdmin } from '../lib/supabaseAdminClient'

declare module 'fastify' {
    interface FastifyRequest {
        user?: any
    }
}

export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) {
        return reply.code(401).send({ error: 'Unauthorized' })
    }

    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

        if (error || !user) {
            return reply.code(401).send({ error: 'Invalid token' })
        }

        // Attach user to request
        request.user = user
    } catch (error) {
        return reply.code(500).send({ error: 'Authentication failed' })
    }
}