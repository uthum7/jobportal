"use client"

import { useRef } from "react"
import { useParams } from "react-router-dom"
import { FaPrint } from "react-icons/fa"
import "./invoice.css"

export default function Invoice() {
  const { counselorId } = useParams()
  const invoiceRef = useRef(null)

  // This would normally come from an API call using the counselorId
  const invoiceData = {
    invoiceNumber: "INV-2025-1234",
    date: "May 15, 2025",
    dueDate: "May 15, 2025",
    counselor: {
      name: "Tyrone Roberts",
      title: "Career Development Specialist",
    },
    customer: {
      name: "Sanduni Dilhara",
      email: "sanduni@example.com",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    company: {
      name: "Job Portal Counseling Services",
      address: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      phone: "+1 (555) 987-6543",
      email: "billing@jobportal.com",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "4242",
    },
    items: [
      {
        description: "Career Counseling Session (1 hour)",
        quantity: 1,
        rate: 75,
        amount: 75,
      },
    ],
    subtotal: 75,
    platformFee: 5,
    tax: 8,
    total: 88,
  }

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML
    const originalContent = document.body.innerHTML

    document.body.innerHTML = printContent
    window.print()
    document.body.innerHTML = originalContent
    window.location.reload()
  }

  return (
    <div className="main-content">
      <div className="invoice-container">
        <div className="invoice-actions">
          <button className="print-btn" onClick={handlePrint}>
            <FaPrint /> Print Invoice
          </button>
        </div>

        <div className="invoice" ref={invoiceRef}>
          <div className="invoice-header">
            <div className="company-info">
              <img src="/placeholder.svg?height=40&width=40" alt="Company Logo" className="company-logo" />
              <h1>{invoiceData.company.name}</h1>
            </div>
            <div className="invoice-info">
              <div className="info-row">
                <span>Invoice:</span>
                <span>{invoiceData.invoiceNumber}</span>
              </div>
              <div className="info-row">
                <span>Date:</span>
                <span>{invoiceData.date}</span>
              </div>
              <div className="info-row">
                <span>Due Date:</span>
                <span>{invoiceData.dueDate}</span>
              </div>
            </div>
          </div>

          <div className="invoice-addresses">
            <div className="address">
              <h3>Bill From:</h3>
              <p>{invoiceData.company.name}</p>
              <p>{invoiceData.company.address}</p>
              <p>
                {invoiceData.company.city}, {invoiceData.company.state} {invoiceData.company.zipCode}
              </p>
              <p>Phone: {invoiceData.company.phone}</p>
              <p>Email: {invoiceData.company.email}</p>
            </div>
            <div className="address">
              <h3>Bill To:</h3>
              <p>{invoiceData.customer.name}</p>
              <p>{invoiceData.customer.address}</p>
              <p>
                {invoiceData.customer.city}, {invoiceData.customer.state} {invoiceData.customer.zipCode}
              </p>
              <p>Email: {invoiceData.customer.email}</p>
            </div>
          </div>

          <div className="payment-method">
            <h3>Payment Method:</h3>
            <p>
              {invoiceData.payment.method} ending in {invoiceData.payment.cardLast4}
            </p>
          </div>

          <table className="invoice-items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${item.rate}.00</td>
                  <td>${item.amount}.00</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${invoiceData.subtotal}.00</span>
            </div>
            <div className="summary-row">
              <span>Platform Fee:</span>
              <span>${invoiceData.platformFee}.00</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${invoiceData.tax}.00</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${invoiceData.total}.00</span>
            </div>
          </div>

          <div className="invoice-footer">
            <p>Thank you for your business!</p>
            <p>Payment is due upon receipt. Please make payment within 30 days.</p>
            <p>
              If you have any questions concerning this invoice, please contact our customer service department at{" "}
              {invoiceData.company.email}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

