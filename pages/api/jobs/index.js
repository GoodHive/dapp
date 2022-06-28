import { ethers } from 'ethers'

import { getJobs } from '../../../lib/db/queries'

export default async function handler(req, res) {
  const { method, query } = req

  if (method !== 'GET') {
    return res.status(400).json({ message: "Method not allowed" })
  }

  return res.status(200).json(await getJobs())
}

