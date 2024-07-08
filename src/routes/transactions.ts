import { FastifyInstance } from "fastify"
import knex from "../database"
import { z } from 'zod'
import crypto from 'node:crypto'
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

export const transactionsRoutes = async (server: FastifyInstance) => {

    server.post('/', async (req, res) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body)

        let session_id = req.cookies.session_id

        if (!session_id) {
            session_id = crypto.randomUUID()

            res.cookie('session_id', session_id, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })
        }

        await knex('transactions').insert({
            id: crypto.randomUUID(),
            title: title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: session_id
        })

        return res.status(201).send()
    })

    server.get('/', { preHandler: [checkSessionIdExists] }, async (req, res) => {
        const sessionId = req.cookies.session_id

        const transactions = await knex('transactions').where('session_id', sessionId)
        return { transactions }
    })

    server.get('/:id', { preHandler: [checkSessionIdExists] }, async (req) => {
        const sessionId = req.cookies.session_id

        const getTransactionaParamSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionaParamSchema.parse(req.params)

        const transaction = await knex('transactions')
            .where({
                id: id,
                session_id: sessionId
            })
            .first()
        return { transaction }
    })

    server.get('/summary', { preHandler: [checkSessionIdExists] }, async (req) => {
        const sessionId = req.cookies.session_id

        const summary = await knex('transactions')
            .where('session_id', sessionId)
            .sum('amount', { as: 'amount_total' })
            .first()

        return { summary }
    })
}