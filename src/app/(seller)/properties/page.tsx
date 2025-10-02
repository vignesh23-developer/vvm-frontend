'use client'

import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Table from '@/components/ui/CustomComponent/Table/Table'

const properties = [
  {
    id: 'P002011',
    title: 'Luxury Villa in Mumbai',
    location: 'Mumbai',
    type: 'Villa',
    price: '$3,000',
    status: 'Available',
    agent: 'Auborn',
    date: 'Jan 14, 2022',
  },
  {
    id: 'P002126',
    title: 'Cancivilla',
    location: 'Coriitoci',
    type: 'Type',
    price: '$4,841',
    status: 'Sold',
    agent: 'Bangar',
    date: 'Mar 19, 2022',
  },
  {
    id: 'P002130',
    title: 'Pensmerie',
    location: 'Referral',
    type: 'Perarh',
    price: '$3,400',
    status: 'Rented',
    agent: 'Joardan',
    date: 'Jun 30, 2022',
  },
  {
    id: 'P000240',
    title: 'Livo Temka',
    location: 'Aucher',
    type: 'Car',
    price: '$3,000',
    status: 'Rented',
    agent: 'Augett',
    date: 'Apr 22, 2022',
  },
  {
    id: 'P000379',
    title: 'Smartoven',
    location: 'Baceroi',
    type: 'Land',
    price: '$2,002',
    status: 'Available',
    agent: 'Agrmos',
    date: 'Jun 26, 2022',
  },
  {
    id: 'P003136',
    title: 'Laiiana',
    location: 'Barnero',
    type: 'Port',
    price: '$3,000',
    status: 'Sold',
    agent: 'Balanca',
    date: 'Mar 21, 2022',
  },
]

// Chart data
const statusData = [
  { name: 'Available', value: 2 },
  { name: 'Sold', value: 2 },
  { name: 'Rented', value: 2 },
]

const COLORS = ['#4ade80', '#f87171', '#fbbf24']

const monthlyData = [
  { name: 'Jan', count: 2 },
  { name: 'Feb', count: 3 },
  { name: 'Mar', count: 4 },
  { name: 'Apr', count: 5 },
  { name: 'May', count: 3 },
]

export default function PropertiesPage() {
  const [search, setSearch] = useState('')

  const filtered = properties.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()),
  )

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Title', key: 'title' },
    { header: 'Location', key: 'location' },
    { header: 'Type', key: 'type' },
    { header: 'Price', key: 'price' },
    { header: 'Status', key: 'status' },
    { header: 'Agent', key: 'agent' },
    { header: 'Date', key: 'date' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
        <p className="text-gray-500">
          Manage and oversee all listed properties.
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
          <Table columns={columns} data={filtered} enableSorting={true} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">
              Properties by Status
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={70}
                  innerRadius={40}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">
              Properties Added Over Time
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Agents */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4 text-gray-700">
              Top Performing Agents
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>🏆 Emnia Taylor</li>
              <li>🏆 Olivia Williams</li>
              <li>🏆 Noah Smith</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
