import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Calendar, AlertCircle, Check, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import axios from 'axios';

const BillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('invoices');
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [filter, setFilter] = useState('all'); // all, paid, unpaid

  useEffect(() => {
    // Get user from session storage
    const userInfo = sessionStorage.getItem('user');
    if (!userInfo) {
      window.location.href = '/login';
      return;
    }

    // Fetch invoices
    const fetchData = async () => {
      try {
        const userObj = JSON.parse(userInfo);

        // Fetch invoices
        const invoicesResponse = await axios.get(`/api/invoices/${userObj.id}/`, {
          headers: {'X-Requested': import.meta.env.VITE_API_KEY}
        });

        setInvoices(invoicesResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching billing data:', err);
        // Set mock data in case of error for development purposes
        const mockInvoices = [
          {
            id: 1,
            user_id: 1,
            service_id: null,
            amount: 99.99,
            description: 'Web Hosting - Premium (Monthly)',
            status: 'paid',
            due_date: '2025-03-20',
            paid_at: null,
            created_at: '2025-03-30 22:57:20',
            updated_at: '2025-03-30 22:57:20'
          },
          {
            id: 2,
            user_id: 1,
            service_id: null,
            amount: 199.99,
            description: 'VPS Server - Business (Monthly)',
            status: 'unpaid',
            due_date: '2025-04-04',
            paid_at: null,
            created_at: '2025-03-30 22:57:20',
            updated_at: '2025-03-30 22:57:20'
          }
        ];

        setInvoices(mockInvoices);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePayInvoice = (invoiceId) => {
    // In a real app, this would send a request to process payment
    const payInvoice = async () => {
      try {
        await axios.post(`/api/invoices/${invoiceId}/pay`, {
          headers: {'X-Requested': import.meta.env.VITE_API_KEY}
        });

        // Update the invoice status locally
        setInvoices(invoices.map(invoice =>
          invoice.id === invoiceId ? {...invoice, status: 'paid', paid_at: new Date().toISOString()} : invoice
        ));

        alert(`Payment successful for invoice #${invoiceId}`);
      } catch (err) {
        console.error('Error processing payment:', err);
        alert('Payment processing failed. Please try again later.');
      }
    };

    payInvoice();
  };

  const handleDownloadInvoice = (invoiceId) => {
    // In a real app, this would download the invoice PDF
    window.open(`/api/invoices/${invoiceId}/pdf`, '_blank');
  };

  const toggleInvoiceDetails = (invoiceId) => {
    if (expandedInvoice === invoiceId) {
      setExpandedInvoice(null);
    } else {
      setExpandedInvoice(invoiceId);
    }
  };

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter(invoice => invoice.status === filter);

  const renderInvoiceStatus = (status) => {
    const statusClasses = {
      paid: "bg-green-500/20 text-green-400 border-green-500/30",
      unpaid: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      overdue: "bg-red-500/20 text-red-400 border-red-500/30"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status] || statusClasses.unpaid}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getUpcomingTotal = () => {
    return invoices
      .filter(invoice => invoice.status === 'unpaid')
      .reduce((total, invoice) => total + parseFloat(invoice.amount), 0);
  };

  // Get nearest upcoming due date
  const getNextDueDate = () => {
    const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid');
    if (unpaidInvoices.length === 0) return 'No upcoming';

    const sortedDates = unpaidInvoices
      .map(invoice => invoice.due_date)
      .sort();

    return sortedDates[0];
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    if (dateString === "No upcoming") return 'No upcoming';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <CreditCard className="text-blue-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Payment Due</p>
              <h3 className="text-2xl font-bold text-white">Rp{getUpcomingTotal()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Calendar className="text-purple-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Next Due Date</p>
              <h3 className="text-2xl font-bold text-white">
                {formatDate(getNextDueDate())}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-6 border border-gray-800/80 shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-500/20">
              <AlertCircle className="text-indigo-400" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm">Payment Status</p>
              <h3 className="text-2xl font-bold text-white">
                {invoices.some(inv => inv.status === 'unpaid') ? 'Action Needed' : 'All Paid'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl border border-gray-800/80 shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-800">
          <button
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'invoices' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
          <button
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'billing-history' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('billing-history')}
          >
            Billing History
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'invoices' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-white">Invoices</h2>
                  <div className="ml-4 flex items-center bg-gray-800/60 rounded-lg p-1">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('unpaid')}
                      className={`px-3 py-1 rounded-md text-sm ${filter === 'unpaid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                      Unpaid
                    </button>
                    <button
                      onClick={() => setFilter('paid')}
                      className={`px-3 py-1 rounded-md text-sm ${filter === 'paid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                      Paid
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <p className="text-gray-400 text-center py-8">Loading invoices...</p>
              ) : filteredInvoices.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No invoices found.</p>
              ) : (
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="bg-gray-800/40 rounded-xl border border-gray-700/50">
                      <div
                        className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                        onClick={() => toggleInvoiceDetails(invoice.id)}
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded bg-gray-700/50 mr-4">
                            <CreditCard size={20} className="text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Invoice #{invoice.id}</h3>
                            <p className="text-gray-400 text-sm">{invoice.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center mt-4 md:mt-0">
                          <div className="mr-6 text-right md:text-left">
                            <p className="text-white font-medium">Rp{parseFloat(invoice.amount)}</p>
                            <p className="text-gray-400 text-sm">Due: {formatDate(invoice.due_date)}</p>
                          </div>
                          <div className="flex items-center">
                            {renderInvoiceStatus(invoice.status)}
                            {expandedInvoice === invoice.id ? (
                              <ChevronUp size={20} className="ml-3 text-gray-400" />
                            ) : (
                              <ChevronDown size={20} className="ml-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedInvoice === invoice.id && (
                        <div className="p-4 border-t border-gray-700/50 bg-gray-800/20">
                          <div className="mb-4">
                            <h4 className="text-gray-300 text-sm font-medium mb-2">Invoice Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <p className="text-gray-400">{invoice.description}</p>
                                <p className="text-white">Rp{parseFloat(invoice.amount)}</p>
                              </div>
                              <div className="pt-2 border-t border-gray-700/50 flex justify-between">
                                <p className="font-medium text-gray-300">Total</p>
                                <p className="font-medium text-white">${parseFloat(invoice.amount)}</p>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between">
                                <p className="text-gray-400">Invoice Date:</p>
                                <p className="text-white">{formatDate(invoice.created_at)}</p>
                              </div>
                              <div className="flex justify-between">
                                <p className="text-gray-400">Due Date:</p>
                                <p className="text-white">{formatDate(invoice.due_date)}</p>
                              </div>
                              {invoice.paid_at && (
                                <div className="flex justify-between">
                                  <p className="text-gray-400">Paid Date:</p>
                                  <p className="text-white">{formatDate(invoice.paid_at)}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition"
                            >
                              <Download size={16} className="mr-2" />
                              Download PDF
                            </button>

                            {invoice.status === 'unpaid' && (
                              <button
                                onClick={() => handlePayInvoice(invoice.id)}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                              >
                                <CreditCard size={16} className="mr-2" />
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing-history' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Billing History</h2>

              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-4">2025</h3>
                    <div className="space-y-4">
                      {invoices
                        .filter(inv => inv.created_at && inv.created_at.startsWith('2025'))
                        .map(invoice => (
                          <div key={invoice.id} className="flex justify-between items-center pb-3 border-b border-gray-700/30">
                            <div>
                              <p className="text-white">Invoice #{invoice.id} - {invoice.description}</p>
                              <p className="text-gray-400 text-sm">{formatDate(invoice.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">${parseFloat(invoice.amount)}</p>
                              <div className="flex items-center justify-end mt-1">
                                {renderInvoiceStatus(invoice.status)}
                                <button
                                  onClick={() => handleDownloadInvoice(invoice.id)}
                                  className="ml-3 text-blue-400 hover:text-blue-300"
                                >
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-4">2024</h3>
                    <p className="text-gray-400">No billing history found for 2024.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;