import Head from 'next/head' // TODO: add Head
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Multiselect from 'multiselect-react-dropdown'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

import useWeb3 from '../../lib/wallet/use-web3'

const navigation = [
  { name: 'Talents', href: '/', current: true },
  { name: 'Jobs', href: '/jobs', current: false },
  { name: 'About', href: '#', current: false }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [telegram, setTelegram] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [isRemoteOnly, setIsRemoteOnly] = useState(false)
  const [professionalXps, setProfessionalXps] = useState('')
  const [profileHeadline, setProfileHeadline] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [stackoverflowUrl, setStackoverflowUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [rate, setRate] = useState('')
  const [skills, setSkills] = useState([])
  const [skillsFromDB, setSkillsFromDB] = useState([])

  const {
    signer,
    connectedAddress,
    connectWallet
  } = useWeb3()

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    if (!connectedAddress) {
      alert('Connect web3 wallet first to save your profile')

      return
    }

    let rawSignature = ''

    try {
      rawSignature = await signer.signMessage(
        "Proof of ownership of the profile"
      )
    } catch (error) {
      alert('Error while requesting signature:', error)

      return
    }

    const { data: isExists } = await axios.get(`/api/talents/${connectedAddress}?isExists`)

    if (!isExists) {
      // TODO: add skills
      const { data } = await axios.post('/api/talents/add', {
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
        walletAddress: connectedAddress,
        signature: rawSignature
      })

      if (data.msg === 'success') alert('Profile saved')

      return
    }

    // update profile
    const { data } = await axios.post(`/api/talents/${connectedAddress}`, {
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
      walletAddress: connectedAddress,
      signature: rawSignature,
      skills
    })

    if (data.msg === 'success') alert('Profile updated')
  },
  [
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
    connectedAddress,
    skills
  ])

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/talents/skills')

      setSkillsFromDB(data)
    })()
  }, [])

  useEffect(() => {
    if(!connectedAddress) return

    const getTalent = async (walletAddress) => {
      return await axios.get(`/api/talents/${walletAddress}`)
    }

    getTalent(connectedAddress).then(({ data: talent }) => {
      setFirstname(talent.firstname)
      setLastname(talent.lastname)
      setEmail(talent.email)
      setTelegram(talent.telegram)
      setCountry(talent.country)
      setCity(talent.city)
      setIsRemoteOnly(talent.is_remote_only)
      setProfessionalXps(talent.professional_xps)
      setProfileHeadline(talent.profile_headline)
      setLinkedinUrl(talent.linkedin_url)
      setGithubUrl(talent.github_url)
      setStackoverflowUrl(talent.stackoverflow_url)
      setPortfolioUrl(talent.portfolio_url)
      setRate(talent.rate)
      const skillIds = talent.skills?.split(',')

      setSkills(
        skillIds?.length > 0 
          ? skillIds.map(skillId => skillsFromDB.find(skill => skill.id === parseInt(skillId)))
          : []
      )
    })
  }, [connectedAddress])

  return (
    <div className="min-h-screen flex flex-col">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center text-white text-xl">
                      GoodHive
                  </div>
                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Metamask */}
                  <button
                    className={
                      'bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium'
                    }
                    onClick={connectWallet}
                  >
                    { connectedAddress ? connectedAddress : 'Connect to Web3' }
                  </button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>
      </header>

      
      <main>
        <div className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div>
                <input
                  id="firstname"
                  name="firstname"
                  placeholder="Firstname"
                  className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                  onChange={(e) => setFirstname(e.target.value)}
                  value={firstname}
                />
              </div>
              <div>
                <input
                  id="lastname"
                  name="lastname"
                  placeholder="Lastname"
                  className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                  onChange={(e) => setLastname(e.target.value)}
                  value={lastname}
                />
              </div>
            </div>
            <div className="flex flex-row pt-5">
              <div>
                <input
                  id="country"
                  name="country"
                  placeholder="Country"
                  className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                />
              </div>
              <div>
                <input
                  id="city"
                  name="city"
                  placeholder="City"
                  className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                />
              </div>
            </div>
            <div className="flex flex-row pt-5">
              <div>
                <input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div>
                <input
                  id="telegram"
                  name="telegram"
                  placeholder="Telegram"
                  className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                  onChange={(e) => setTelegram(e.target.value)}
                  value={telegram}
                />
              </div>
            </div>
          </div>
          <div className="pt-5">
            <textarea
              id="profileXps"
              name="profileXps"
              placeholder="Describe main experiences and used skills"
              className="w-[61vw] h-[10vw] ml-[1vw] mr-3 p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
              onChange={(e) => setProfessionalXps(e.target.value)}
              defaultValue={professionalXps}
            />
          </div>
          <div className="pt-5">
            <textarea
              id="profileHeadline"
              name="profileHeadline"
              placeholder="Who are you in a few words...."
              className="w-[61vw] h-[10vw] ml-[1vw] mr-3 p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
              onChange={(e) => setProfileHeadline(e.target.value)}
              defaultValue={profileHeadline}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        </div>

        <div className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div>
              <Multiselect
                placeholder={skills.length ? '' : 'Solidity, Javascript, React...'}
                isObject={true}
                options={skillsFromDB.length > 0 ? skillsFromDB : []} // Options to display in the dropdown
                displayValue="name" // Property to display in the dropdown options
                className="max-w-[61vw] ml-[1vw] mr-3 p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                selectedValues={skills}
                onSelect={setSkills} // Function will trigger on select event
                onRemove={setSkills} // Function will trigger on remove event
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Social</h2>
        </div>

        <div className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              placeholder="Linkedin Url"
              type="text"
              className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
              onChange={(e) => setLinkedinUrl(e.target.value)}
              value={linkedinUrl}
            />
          </div>
          <div className="pt-5">
            <input
              id="githubUrl"
              name="githubUrl"
              placeholder="Github Url"
              className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
              onChange={(e) => setGithubUrl(e.target.value)}
              value={githubUrl}
            />
          </div>
          <div className="pt-5">
            <input
              id="stackoverflowUrl"
              name="stackoverflowUrl"
              placeholder="Stackoverflow Url"
              className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
              onChange={(e) => setStackoverflowUrl(e.target.value)}
              value={stackoverflowUrl}
            />
          </div>
          <div className="pt-5">
            <input
              id="portfolioUrl"
              name="portfolioUrl"
              placeholder="Portfolio Url"
              className="w-[30vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
              onChange={(e) => setPortfolioUrl(e.target.value)}
              value={portfolioUrl}
            />
          </div>
        </div>
        </div>

        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Rate</h2>
        </div>

        <div className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="relative flex">
              <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">USD</span>
              </div>
              <input
                id="rate"
                placeholder="Add your rate"
                type="number"
                className="w-[30vw] ml-[1vw] p-2 pl-12 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                onChange={(e) => setRate(e.target.value)}
                value={rate}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-right">
          <div className="w-[61vw] ml-[1vw] mr-3 p-2">
            <button 
              className={
                'bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium'
              }
              onClick={e => handleSubmit(e)}
            >
              Save Profile
            </button>
          </div>
        </div>
      </main>


      <hr />
      <footer className="max-w-7xl mx-auto py-4 px-2 sm:px-6 lg:px-8 text-xs text-gray-500 text-center">
        GoodHive 2022
      </footer>
    </div>
  )
}