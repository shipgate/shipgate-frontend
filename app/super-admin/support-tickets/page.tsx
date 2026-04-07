'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface SupportTicket {
  id: string
  ticketNumber: string
  customerName: string
  email: string
  subject: string
  message: string
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-001',
    customerName: 'John Doe',
    email: 'john@example.com',
    subject: 'Shipment Tracking Issue',
    message: 'Unable to track my shipment. Tracking number not showing updates.',
    status: 'open',
    createdAt: '2024-03-20',
    priority: 'high',
  },
  {
    id: '2',
    ticketNumber: 'TKT-002',
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Payment Refund Request',
    message: 'Requesting refund for cancelled shipment.',
    status: 'in-progress',
    createdAt: '2024-03-19',
    priority: 'medium',
  },
  {
    id: '3',
    ticketNumber: 'TKT-003',
    customerName: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    subject: 'Account Access Problem',
    message: 'Cannot login to my account.',
    status: 'resolved',
    createdAt: '2024-03-18',
    priority: 'high',
  },
  {
    id: '4',
    ticketNumber: 'TKT-004',
    customerName: 'Maria Garcia',
    email: 'maria@example.com',
    subject: 'General Inquiry',
    message: 'What is your best shipping option for fragile items?',
    status: 'open',
    createdAt: '2024-03-17',
    priority: 'low',
  },
]

const AdminSupportTicketsPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all')
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleMarkResolved = (ticketId: string) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' } : t)))
    setSelectedTicket(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'open':
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'open':
        return 'bg-red-100 text-red-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">Manage and resolve customer support requests</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Search Tickets</label>
            <Input
              placeholder="Search by ticket number, customer name, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <div className="flex gap-2 mt-2">
              {['all', 'open', 'in-progress', 'resolved'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className="capitalize"
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Grid */}
      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No support tickets found.
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{ticket.ticketNumber}</CardTitle>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(ticket.status)}
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                        {ticket.priority}
                      </Badge>
                    </div>
                    <CardDescription>{ticket.subject}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">{ticket.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium break-all">{ticket.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{ticket.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Tickets</p>
                    <p className="font-medium">15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedTicket.ticketNumber}</CardTitle>
                  <CardDescription>{selectedTicket.subject}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTicket(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{selectedTicket.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedTicket.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge className={getPriorityColor(selectedTicket.priority)} variant="outline">
                    {selectedTicket.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="mt-2 p-4 bg-muted rounded-lg">{selectedTicket.message}</p>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedTicket.status !== 'resolved' && (
                  <Button
                    onClick={() => handleMarkResolved(selectedTicket.id)}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Mark as Resolved
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminSupportTicketsPage
