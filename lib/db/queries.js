import db from './conf'

export const getTalent = async ({ walletAddress }) => {
  let conn

  try {
    // TODO: move connection to lib/db/conf.js
    conn = await db.getConnection()

    const talent = await conn.query({
        namedPlaceholders: true,
        sql: `
          SELECT id, firstname, lastname, email, telegram, country, city, is_remote_only, professional_xps, profile_headline, linkedin_url, github_url, stackoverflow_url, portfolio_url, rate, wallet_address, (SELECT GROUP_CONCAT(skill_id SEPARATOR ', ') FROM talents_skills WHERE talent_id = talents.id) AS skills
          FROM talents
          WHERE wallet_address = :walletAddress
        `
      }, {
        walletAddress
      }
    )

    console.log({talent})

    return talent[0]
  } catch (error) {
    console.error(error)

    return { error }
  }
}

export const insertTalent = async ({ firstname, lastname, email, telegram, country, city, isRemoteOnly, professionalXps, profileHeadline, linkedinUrl, githubUrl, stackoverflowUrl, portfolioUrl, rate, walletAddress }) => {
  let conn

  try {
    // TODO: move connection to lib/db/conf.js
    conn = await db.getConnection()

    await conn.query({
        namedPlaceholders: true,
        sql:`
          INSERT INTO talents (firstname, lastname, email, telegram, country, city, is_remote_only, professional_xps, profile_headline, linkedin_url, github_url, stackoverflow_url, portfolio_url, rate, wallet_address)
          VALUES (:firstname, :lastname, :email, :telegram, :country, :city, :isRemoteOnly, :professionalXps, :profileHeadline, :linkedinUrl, :githubUrl, :stackoverflowUrl, :portfolioUrl, :rate, :walletAddress)
        `
      }, {
        firstname,
        lastname,
        email,
        telegram,
        country,
        city,
        isRemoteOnly,
        professionalXps,
        profileHeadline,
        linkedinUrl,
        githubUrl,
        stackoverflowUrl,
        portfolioUrl,
        rate,
        walletAddress
      }
    )

    return 'success'
  } catch (error) {
    return { error }
  }
}

export const updateTalent = async ({ firstname, lastname, email, telegram, country, city, isRemoteOnly, professionalXps, profileHeadline, linkedinUrl, githubUrl, stackoverflowUrl, portfolioUrl, rate, walletAddress }) => {
  let conn

  try {
    // TODO: move connection to lib/db/conf.js
    conn = await db.getConnection()

    await conn.query({
      namedPlaceholders: true,
      sql: 'UPDATE talents SET firstname = :firstname, lastname = :lastname, email = :email, telegram = :telegram, country = :country, city = :city, is_remote_only = :isRemoteOnly, professional_xps = :professionalXps, profile_headline = :profileHeadline, linkedin_url = :linkedinUrl, github_url = :githubUrl, stackoverflow_url = :stackoverflowUrl, portfolio_url = :portfolioUrl, rate = :rate WHERE wallet_address = :walletAddress',
    }, {
      firstname,
      lastname,
      email,
      telegram,
      country,
      city,
      isRemoteOnly,
      professionalXps,
      profileHeadline,
      linkedinUrl,
      githubUrl,
      stackoverflowUrl,
      portfolioUrl,
      rate,
      walletAddress
    })
  } catch (error) {
    return { error }
  }
}

export const isExistsTalentByAddress = async ({ walletAddress }) => {
  let conn

  try {
    // TODO: move connection to lib/db/conf.js
    conn = await db.getConnection()

    const talentsCount = await conn.query({
      namedPlaceholders: true,
      sql: "SELECT COUNT(*) AS 'isExists' FROM talents WHERE wallet_address = :walletAddress",
    }, {
      walletAddress
    })

    return talentsCount[0]['isExists'] > 0
  } catch (error) {
    return { error }
  }
}

export const getSkills = async () => {
  let conn

  try {
    // TODO: move connection to lib/db/conf.js
    conn = await db.getConnection()

    return await conn.query("SELECT * from skills")
  } catch (error) {
    return { error }
  }
}

export const getTalentIdByWalletAddress = async ({ walletAddress }) => {
  let conn

  try {
    // TODO: move connection to lib/db/conf.js
    conn = await db.getConnection()

    const talentIdResQuery = await conn.query(
      {
        namedPlaceholders: true,
        sql: "SELECT id FROM talents WHERE wallet_address = :walletAddress",
      }, {
        walletAddress
      }
    )

    return talentIdResQuery[0]['id']
  } catch (error) {
    return { error }
  }
}

export const updateSkillsOfTalent = async ({ talentId, skillIds }) => {
  let conn

  try {
    // TODO: move connection to lib/db/conf.js
    conn = await db.getConnection()

    await conn.query(
      {
        namedPlaceholders: true,
        sql: "DELETE FROM talents_skills WHERE talent_id = :talentId",
      }, {
        talentId
      }
    )

    skillIds.forEach(async (skillId) => {
      await conn.query(
        {
          namedPlaceholders: true,
          sql: "INSERT INTO talents_skills (talent_id, skill_id) VALUES (:talentId, :skillId)",
        }, {
          talentId,
          skillId
        }
      )
    })

    return 'success'
  } catch (error) {
    return { error }
  }
}