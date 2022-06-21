import Head from 'next/head' // TODO: add Head
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Blockies from 'react-blockies'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon, LocationMarkerIcon, CurrencyDollarIcon } from '@heroicons/react/outline'
import { useCombobox } from 'downshift'

import { menuStyles } from '../lib/utils'
import useWeb3 from '../lib/wallet/use-web3'

const navigation = [
  { name: 'Talents', href: '#', current: true },
  { name: 'Jobs', href: '#', current: false },
  { name: 'About', href: '#', current: false }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const countries = [
  'France',
  'France Paris',
  'Espagne',
  'Portugal',
  'États-Unis',
  'Finlande'
]

export default function Home() {
  const [inputItems, setInputItems] = useState(countries)
  const [workers, setWorkers] = useState([])
  const [skills, setSkills] = useState([])
  const [location, setLocation] = useState('')

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        countries.filter(item =>
          item.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      )
    },
  })

  const {
    connectedAddress,
    connectWallet
  } = useWeb3()

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/talents')

      if(data.length) setWorkers(data)
    })()
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    const { data } = await axios.get(`/api/talents${ (skills || location) ? `?${skills ? `skills=${skills}` : ''}${location ? `&location=${location}` : ''}` : '' }`)
console.log(`/api/talents${ (skills || location) ? `?${skills ? `skills=${skills}` : ''}${location ? `&location=${location}` : ''}` : '' }`)
    setWorkers(data)
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
          <h1 className="text-3xl font-bold text-gray-900">Looking for Talent</h1>
        </div>
      </header>

      <main className="flex flex-col flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 items-center">
        <div className="flex flex-col w-fit">
          <div className="flex flex-row">
            <div className="">
              <label htmlFor="skill" className="leading-10 inline-block w-20">
                Skill
              </label>
            </div>
            <div>
              <input
                id="skill"
                placeholder="Try Solidity, Rust, EthersJs..."
                className="w-[30vw] ml-3 p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row mt-5">
            <div { ...getComboboxProps() }>
              <label {...getLabelProps()} className="leading-10 inline-block w-20">
                Location
              </label>
            </div>
            <div className="relative">
              <div className="absolute">
                <input
                  {...getInputProps()} 
                  placeholder="France, London, New York..."
                  className="w-[30vw] ml-3 p-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-500 shadow rounded-md"
                />
                <ul {...getMenuProps()} style={menuStyles}>
                  {isOpen &&
                    inputItems.map((item, index) => (
                      <li
                        style={
                          highlightedIndex === index
                            ? { backgroundColor: '#bde4ff' }
                            : {}
                        }
                        key={`${item}${index}`}
                        {...getItemProps({ item, index })}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="mt-16">
                <button
                  type="button"
                  aria-label="toggle menu"
                  className='ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                  onClick={e => handleSubmit(e)}
                >
                  Find a Talent
                </button>
                <span>
                  {/* TODO: add href to the project new page */}
                  <Link href="/">or Add a Project</Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex">
            {
              workers.length
                ?
                  <ul role="list" className="flex-1 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {workers.map((worker) => (
                      <li
                        key={worker.email}
                        className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
                      >
                        <div className="flex-1 flex flex-col p-8">
                          {/* <img className="wn-32 h-32 flex-shrink-0 mx-auto rounded-full" src={worker.imageUrl} alt="" /> */}
                          <Blockies
                            className="w-32 h-32 flex-shrink-0 mx-auto rounded-full"
                            seed={worker.wallet_address}
                            size={12}
                            scale={8}
                          />
                          <h3 className="mt-6 text-gray-900 text-sm font-medium">{worker.firstname}</h3>
                          <dl className="mt-1 flex-grow flex flex-col justify-between">
                            <dt className="sr-only">Title</dt>
                            <dd className="text-gray-500 text-sm">{worker.profile_headline}</dd>
                            <dt className="sr-only">Skills</dt>
                            <dd className="mt-3">
                              {
                                worker.skills.map((skill, index) => (
                                  <span key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 bg-blue-100 text-blue-800 m-0.5">
                                    {skill}
                                  </span>
                                ))
                              }
                            </dd>
                          </dl>
                        </div>
                        <div>
                          <div className="-mt-px flex divide-x divide-gray-200">
                            <div className="w-0 flex-1 flex">
                              <span
                                className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                              >
                                <CurrencyDollarIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                <span className="ml-3">{worker.rate}</span>
                              </span>
                            </div>
                            <div className="-ml-px w-0 flex-1 flex">
                              <span
                                className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                              >
                                <LocationMarkerIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                <span className="ml-3">{worker.city}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
                : <div>We did not found any Talents with this research</div>
              }
          </div>
        </section>
      </main>

      <hr />
      <footer className="max-w-7xl mx-auto py-4 px-2 sm:px-6 lg:px-8 text-xs text-gray-500 text-center">
        GoodHive 2022
      </footer>
    </div>
  )
}