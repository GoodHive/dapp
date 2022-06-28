import { ethers } from 'ethers'

import { insertJob } from '../../../lib/db/queries'

export default async function handler(req, res) {
  const { method, body } = req

  if (method !== 'POST') return res.status(405).json({ message: "Method not valid" })

  const { 
    title,
    description,
    skills,
    rate,
    walletAddress,
    signature
  } = body

  if (!walletAddress) return res.status(400).json({ message: 'Wallet address must be defined' })

  if (typeof signature !== 'string') {
    return res.status(400).json({ message: 'Signature must be a string' })
  }

  if (typeof walletAddress !== 'string') {
    return res
      .status(400)
      .json({ message: 'Wallet Address must be a string' })
  }

  const verifiedAddress = ethers.utils.verifyMessage(
    'Proof of ownership of the profile',
    signature
  )

  if (verifiedAddress.toLowerCase() !== walletAddress.toLowerCase())
    return res
      .status(401)
      .json({ message: 'Signature does not match the claimed address' })

  await insertJob({
    title: title || '',
    description: description || '',
    rate: rate || 0,
    walletAddress
  })

  res.status(200).json({ msg: 'success' })
}

