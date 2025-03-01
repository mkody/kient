import { env } from 'bun'
import { Kient } from 'kient'

const kient = new Kient()
kient.setAuthToken(env.KICK_TOKEN as string)
const res = await kient.api.category.query('final')

console.log(res.map((cat) => cat.toJSON()))
