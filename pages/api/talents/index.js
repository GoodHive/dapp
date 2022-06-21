import { ethers } from 'ethers'

import { getTalents, getTalentsBySkillsAndLocation } from '../../../lib/db/queries'

export default async function handler(req, res) {
  const { method, query } = req

  if (method !== 'GET') {
    return res.status(400).json({ message: "Method not allowed" })
  }

  let talents

  if (query.skills || query.location) {
    talents = await getTalentsBySkillsAndLocation({
      skills: query.skills,
      location: query.location
    })
  } else {
    talents = await getTalents()
  }


  return res.status(200).json(talents)
}

