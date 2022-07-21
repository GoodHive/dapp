

import Head from 'next/head' // TODO: add Head
import Link from 'next/link'
import { Fragment, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import toast, { Toaster } from 'react-hot-toast'


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

export default function Jobs() {
  const [jobsByCompanyAddress, setJobsByCompanyAddress] = useState([])

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`/api/jobs`)

      setJobsByCompanyAddress(data)
    })()
  }, [])


  const locations = [
    {
      name: 'Edinburgh',
      people: [
        { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
        { name: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
      ],
    },
    // More people...
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

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
                    // onClick={connectWallet}
                  >
                    Connect to Web3
                    {/* { connectedAddress ? connectedAddress : 'Connect to Web3' } */}
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
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm text-gray-700">
                A list of all the jobs by company addresses or Ethereum Name Services.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                onClick={() => window.location.href = '/jobs/add'} // use router to redirect to the add job page
              >
                Add Job
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full">
                    <thead className="bg-white">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Title
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Description
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Claim
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {jobsByCompanyAddress.map((job, index) => ( // companies - alias address i.e ENS name
                        <Fragment key={index}>
                          <tr className="border-t border-gray-200">
                            <th
                              colSpan={4}
                              scope="colgroup"
                              className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                            >
                              {job[0]["company_wallet_address"]}
                            </th>
                          </tr>
                          {console.log(job)}
                          {job.map((job, index) => (
                            <tr
                              key={index}
                              className={classNames(index === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {job.created_at || 'n/a'}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.title}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.description}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                  Claim
                                </a>
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                      {/* {locations.map((location) => (
                        <Fragment key={location.name}>
                          <tr className="border-t border-gray-200">
                            <th
                              colSpan={5}
                              scope="colgroup"
                              className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                            >
                              {location.name}
                            </th>
                          </tr>
                          {location.people.map((person, personIdx) => (
                            <tr
                              key={person.email}
                              className={classNames(personIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {person.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                  Edit<span className="sr-only">, {person.name}</span>
                                </a>
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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