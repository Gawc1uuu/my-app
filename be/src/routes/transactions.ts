import { FastifyInstance } from 'fastify'
import { eq, and } from 'drizzle-orm'
import { transactionsTable } from '../db/schema'
import { db } from '../db'
import { authMiddleware } from '../middleware/auth'

declare module 'fastify' {
    interface FastifyRequest {
        user?: any
    }
}

export async function transactionRoutes(fastify: FastifyInstance) {
    // fastify.addHook('preHandler', authMiddleware)

    fastify.post('/', async (request, reply) => {
        try {
            const { body, user } = request as any
            const transaction = await db.insert(transactionsTable).values({
                userId: user.id,
                ...body
            }).returning()

            return reply.code(201).send(transaction[0])
        } catch (error) {
            return reply.code(500).send({ error: 'Failed to create transaction' })
        }
    })

    fastify.get('/', async (request, reply) => {
        try {
            const { user } = request as any
            const transactions = await db.select()
                .from(transactionsTable)
                .where(eq(transactionsTable.userId, user.id))

            return reply.send(transactions)
        } catch (error) {
            return reply.code(500).send({ error: 'Failed to fetch transactions' })
        }
    })

    // Update transaction
    fastify.put('/:id', async (request, reply) => {
        try {
            const { params, body, user } = request as any
            const transaction = await db.update(transactionsTable)
                .set(body)
                .where(and(
                    eq(transactionsTable.transactionId, params.id),
                    eq(transactionsTable.userId, user.id)
                ))
                .returning()

            if (transaction.length === 0) {
                return reply.code(404).send({ error: 'Transaction not found' })
            }

            return reply.send(transaction[0])
        } catch (error) {
            return reply.code(500).send({ error: 'Failed to update transaction' })
        }
    })

    // Delete transaction
    fastify.delete('/:id', async (request, reply) => {
        try {
            const { params, user } = request as any
            const transaction = await db.delete(transactionsTable)
                .where(and(
                    eq(transactionsTable.transactionId, params.id),
                    eq(transactionsTable.userId, user.id)
                ))
                .returning()

            if (transaction.length === 0) {
                return reply.code(404).send({ error: 'Transaction not found' })
            }

            return reply.send({ success: true })
        } catch (error) {
            return reply.code(500).send({ error: 'Failed to delete transaction' })
        }
    })
}