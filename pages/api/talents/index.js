import { ethers } from 'ethers'

import { getTalents } from '../../../lib/db/queries'

export default async function handler(req, res) {
  const { method } = req

  if (method !== 'GET') {
    return res.status(400).json({ message: "Method not allowed" })
  }

  const talents = await getTalents()

  return res.status(200).json(talents)
}

