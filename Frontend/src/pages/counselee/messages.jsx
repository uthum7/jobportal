"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaKey,
  FaTrashAlt,
  FaSignOutAlt,
  FaPaperPlane,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa"
import "./messages.css"

// Sample data for contacts
const contactsData = [
  {
    id: 1,
    name: "Tyrone Roberts",
    role: "Career Counselor",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Let me know if you have any questions about your resume.",
    unread: 2,
    lastActive: "Just now",
  },
  {
    id: 2,
    name: "Julie Pennington",
    role: "Interview Coach",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Your mock interview is scheduled for tomorrow at 10 AM.",
    unread: 0,
    lastActive: "5 min ago",
  },
  {
    id: 3,
    name: "Allen Davis",
    role: "Job Placement Officer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "I've forwarded your application to the hiring manager.",
    unread: 0,
    lastActive: "2 hours ago",
  },
  {
    id: 4,
    name: "Patricia Manzi",
    role: "HR Specialist",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Your profile has been approved for our job matching service.",
    unread: 0,
    lastActive: "Yesterday",
  },
  {
    id: 5,
    name: "Olive Lawrence",
    role: "Career Advisor",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "I've reviewed your career goals and have some suggestions.",
    unread: 0,
    lastActive: "2 days ago",
  },
]

// Sample conversation data
const conversationData = {
  1: [
    {
      id: 1,
      sender: "them",
      message: "Hello Sanduni, I've reviewed your resume and have some suggestions for improvement.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      message: "Thank you! I'd appreciate any feedback you can provide.",
      time: "10:32 AM",
    },
    {
      id: 3,
      sender: "them",
      message:
        "Your experience section is strong, but I think we could improve the skills section to better match the jobs you're applying for.",
      time: "10:35 AM",
    },
    {
      id: 4,
      sender: "them",
      message: "Also, have you considered adding a brief professional summary at the top?",
      time: "10:36 AM",
    },
    {
      id: 5,
      sender: "me",
      message: "That's a good idea. I haven't included a summary because I wasn't sure what to write.",
      time: "10:40 AM",
    },
    {
      id: 6,
      sender: "them",
      message: "Let me know if you have any questions about your resume.",
      time: "10:45 AM",
    },
  ],
  2: [
    {
      id: 1,
      sender: "them",
      message: "Hi Sanduni, I'm looking forward to our mock interview session tomorrow.",
      time: "Yesterday",
    },
    {
      id: 2,
      sender: "me",
      message: "Hi Julie, I'm looking forward to it too. Is there anything I should prepare?",
      time: "Yesterday",
    },
    {
      id: 3,
      sender: "them",
      message:
        "Yes, please review the job description I sent you and prepare answers for common questions. We'll focus on behavioral questions.",
      time: "Yesterday",
    },
    {
      id: 4,
      sender: "me",
      message: "Great, I'll do that. Thank you!",
      time: "Yesterday",
    },
    {
      id: 5,
      sender: "them",
      message: "Your mock interview is scheduled for tomorrow at 10 AM.",
      time: "Today",
    },
  ],
}
 const userstring = localStorage.getItem("user")
  const user = userstring ? JSON.parse(userstring) : null

export default function Messages() {
  const [contacts, setContacts] = useState(contactsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeContact, setActiveContact] = useState(1)
  const [conversations, setConversations] = useState(conversationData)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeContact, conversations])

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault()

    if (newMessage.trim() === "") return

    const newMessageObj = {
      id: conversations[activeContact].length + 1,
      sender: "me",
      message: newMessage,
      time: "Just now",
    }

    setConversations((prev) => ({
      ...prev,
      [activeContact]: [...prev[activeContact], newMessageObj],
    }))

    setNewMessage("")
  }

  // Mark messages as read when clicking on a contact
  const handleContactClick = (contactId) => {
    setActiveContact(contactId)

    // Mark messages as read
    setContacts((prev) => prev.map((contact) => (contact.id === contactId ? { ...contact, unread: 0 } : contact)))
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-16%20132226-dgHAwgPAd5U9t5uD3aiDzazUMdPqCu.png"
            alt="Sanduni Dilhara"
            className="profile-image"
          />
         <h3 className="profile-name">{user.name}</h3>
          
        </div>

        <nav className="sidebar-menu">
          <Link to="/counselee/dashboard" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaHome />
              </span>
              <span className="menu-text">Dashboard</span>
            </div>
          </Link>
          <Link to="/counselee/profile" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUser />
              </span>
              <span className="menu-text">My Profile</span>
            </div>
          </Link>
          <Link to="/counselee/bookings" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaCalendarAlt />
              </span>
              <span className="menu-text">Bookings</span>
            </div>
          </Link>
          <Link to="/counselee/find-counselor" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUsers />
              </span>
              <span className="menu-text">Find a Counselor</span>
            </div>
          </Link>
          <Link to="/counselee/messages" className="menu-item active">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaEnvelope />
              </span>
              <span className="menu-text">Messages</span>
            </div>
            <span className="menu-badge">2</span>
          </Link>
          <Link to="/counselee/change-password" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaKey />
              </span>
              <span className="menu-text">Change Password</span>
            </div>
          </Link>
          <Link to="/counselee/delete-account" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaTrashAlt />
              </span>
              <span className="menu-text">Delete Account</span>
            </div>
          </Link>
          <Link to="/logout" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaSignOutAlt />
              </span>
              <span className="menu-text">Log Out</span>
            </div>
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="messages-container">
          {/* Contacts List */}
          <div className="contacts-panel">
            <div className="contacts-header">
              <h2>Messages</h2>
              <button className="new-chat-btn">+ New Chat</button>
            </div>

            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="contacts-list">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`contact-item ${activeContact === contact.id ? "active" : ""}`}
                  onClick={() => handleContactClick(contact.id)}
                >
                  <div className="contact-avatar-container">
                    <img src={contact.avatar || "/placeholder.svg"} alt={contact.name} className="contact-avatar" />
                    <span className={`status-indicator ${contact.status}`}></span>
                  </div>

                  <div className="contact-info">
                    <div className="contact-name-container">
                      <h3 className="contact-name">{contact.name}</h3>
                      <span className="contact-time">{contact.lastActive}</span>
                    </div>
                    <p className="contact-role">{contact.role}</p>
                    <p className="contact-last-message">{contact.lastMessage}</p>
                  </div>

                  {contact.unread > 0 && <span className="unread-badge">{contact.unread}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="chat-panel">
            {activeContact && conversations[activeContact] ? (
              <>
                <div className="chat-header">
                  <div className="chat-contact-info">
                    <img
                      src={contacts.find((c) => c.id === activeContact)?.avatar || "/placeholder.svg"}
                      alt={contacts.find((c) => c.id === activeContact)?.name}
                      className="chat-contact-avatar"
                    />
                    <div>
                      <h3 className="chat-contact-name">{contacts.find((c) => c.id === activeContact)?.name}</h3>
                      <p className="chat-contact-status">
                        {contacts.find((c) => c.id === activeContact)?.status === "online" ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="chat-actions">
                    <button className="chat-action-btn">
                      <FaEllipsisV />
                    </button>
                  </div>
                </div>

                <div className="chat-messages">
                  {conversations[activeContact].map((message) => (
                    <div key={message.id} className={`message ${message.sender === "me" ? "sent" : "received"}`}>
                      <div className="message-content">
                        <p>{message.message}</p>
                        <span className="message-time">{message.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-input" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="send-btn">
                    <FaPaperPlane />
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="no-chat-content">
                  <FaEnvelope className="no-chat-icon" />
                  <h3>Select a conversation</h3>
                  <p>Choose a contact from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

