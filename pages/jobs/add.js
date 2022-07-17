import Head from 'next/head' // TODO: add Head
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import Multiselect from 'multiselect-react-dropdown'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import toast, { Toaster } from 'react-hot-toast'

import useWeb3 from '../../lib/wallet/use-web3'
import FeatureAbi from '../../constants/feature.json'

const XDAI_ARBITRATOR_ADDRESS = "0x35d1f0cdae1d4c8e0ab88a5db4b0a8a3d1bafc7a"
const XDAI_ARBITRATOR_EXTRADATA = "0x85"
const XDAI_FEATURE_ADDRESS = "0x341Dac2C174b4f0c495be120dA6D27771dA18a36"

const navigation = [
  { name: 'Talents', href: '/', current: true },
  { name: 'Jobs', href: '/jobs', current: false },
  { name: 'About', href: '#', current: false }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Add() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('0')
  const [skills, setSkills] = useState([])
  const [skillsFromDB, setSkillsFromDB] = useState([])
  const [delayOffer, setDelayOffer] = useState('0')
  const [challengeReward, setChallengeReward] = useState('0')
  const [delayChallenge, setDelayChallenge] = useState(0)
  const [arbitrator, setArbitrator] = useState('')
  const [arbitratorExtraData, setArbitratorExtraData] = useState('')

  const {
    signer,
    connectedAddress,
    connectWallet
  } = useWeb3()

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/talents/skills')

      setSkillsFromDB(data)
    })()
  }, [])

  // useEffect(() => {
  //   if(!connectedAddress) return

  //   const getJob = async (walletAddress) => {
  //     return await axios.get(`/api/talents/${walletAddress}`)
  //   }

  //   getJob(connectedAddress).then(({ data: talent }) => {
  //     setTitle(talent.title)
  //     setDescription(talent.lastname)
  //     setRate(talent.amount)
  //     const skillIds = talent.skills?.split(',')

  //     setSkills(
  //       skillIds?.length > 0 
  //         ? skillIds.map(skillId => skillsFromDB.find(skill => skill.id === parseInt(skillId)))
  //         : []
  //     )
  //   })
  // }, [connectedAddress])

  const handleSubmit = async (rawSignature) => {
    // add job
    const { data } = await axios.post(`/api/jobs/add`, {
      title,
      description,
      amount,
      walletAddress: connectedAddress,
      signature: rawSignature,
      skills
    })

    if (data.msg === 'success') {
      toast.success('Job added')
    }
  }

  const handleCreateTransaction = useCallback(
    async () => {
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

      const amountWEI = ethers.utils.parseEther(amount).toString()
      const depositWEI = ethers.utils.parseEther(challengeReward).toString()

      const hours = new Date().getHours()
      const mins = new Date().getMinutes()
      const seconds = new Date().getSeconds()

      const timeoutPaymentNow = delayOffer.concat(` ${hours}:${mins}:${seconds}`)
      const timeoutPaymentSeconds = Math.floor((new Date(timeoutPaymentNow).getTime() - Date.now()) / 1000)

      try {
        // add to DB then create transaction
        const smartContractFeatureInstance = new ethers.Contract(
          XDAI_FEATURE_ADDRESS,
          FeatureAbi,
          signer
        )

        const createTransactionTx = await smartContractFeatureInstance.createTransaction(
          XDAI_ARBITRATOR_ADDRESS,
          XDAI_ARBITRATOR_EXTRADATA,
          delayOffer, 
          challengeReward,
          delayChallenge,
          'newMetaEvidence',
          {
            value: amountWEI,
          }
        )

        toast('Transaction broadcasting')

        await createTransactionTx.wait()

        toast.success('Transaction mined')

        handleSubmit(rawSignature)
      } catch (error) {
        toast.error('Transaction rejected')

        console.error(error)
      }
    }, [
      signer,
      delayOffer,
      challengeReward,
      delayChallenge,
      amount,
      arbitrator,
      arbitratorExtraData
    ]
  )


  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
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
          <h1 className="text-3xl font-bold text-gray-900">Job</h1>
        </div>
      </header>

      
      <main>
        <div className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div>
                <input
                  id="title"
                  name="title"
                  placeholder="Title"
                  className="w-[61vw] ml-[1vw] p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
            </div>
          </div>
          <div className="pt-5">
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              className="w-[61vw] h-[10vw] ml-[1vw] mr-3 p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={description}
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
          <h2 className="text-2xl font-bold text-gray-900">Amount</h2>
        </div>

        <div className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="relative flex">
              <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">XDAI</span>
              </div>
              <input
                id="amount"
                placeholder="Add your amount"
                type="number"
                className="w-[30vw] ml-[1vw] p-2 pl-12 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Parameters</h2>
        </div>

        <div className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <label className="pl-4 pb-1">Delay Offer</label>
            <div className="relative flex">
              <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">Days</span>
              </div>
              <input
                id="delayOffer"
                placeholder="Delay Offer"
                type="number"
                className="w-[30vw] ml-[1vw] p-2 pl-12 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                onChange={(e) => setDelayOffer(e.target.value)}
                value={delayOffer}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="pl-4 pb-1 pt-4">Challenge Reward</label>
            <div className="relative flex">
              <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">XDAI</span>
              </div>
              <input
                id="challengeReward"
                placeholder="Challenge Reward"
                type="number"
                className="w-[30vw] ml-[1vw] p-2 pl-12 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                onChange={(e) => setChallengeReward(e.target.value)}
                value={challengeReward}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="pl-4 pb-1 pt-4">Delay Challenge</label>
            <div className="relative flex">
              <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">Days</span>
              </div>
              <input
                id="delayChallenge"
                placeholder="Delay Challenge"
                type="number"
                className="w-[30vw] ml-[1vw] p-2 pl-12 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                onChange={(e) => setDelayChallenge(e.target.value)}
                value={delayChallenge}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="pl-4 pb-1 pt-4">Arbitrator</label>
            <div className="relative flex">
              <input
                id="arbitrator"
                placeholder="Arbitrator"
                type="text"
                className="w-[30vw] ml-[1vw] p-2 pl-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                onChange={(e) => setArbitrator(e.target.value)}
                value={arbitrator || XDAI_ARBITRATOR_ADDRESS}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="pl-4 pb-1 pt-4">Arbitrator ExtraData</label>
            <div className="relative flex">
              <input
                id="arbitratorExtraData"
                placeholder="Arbitrator ExtraData"
                type="text"
                className="w-[30vw] ml-[1vw] p-2 pl-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                onChange={(e) => setArbitratorExtraData(e.target.value)}
                value={arbitratorExtraData || XDAI_ARBITRATOR_EXTRADATA}
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
              onClick={e => handleCreateTransaction(e)}
            >
              Save Job
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