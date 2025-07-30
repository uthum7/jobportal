"use client"

import { useState } from "react"
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
  FaClock,
  FaSearch,
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
  FaImage,
  FaFileAlt,
  FaEllipsisH,
  FaCircle,
} from "react-icons/fa"
import "./messages.css"

// Sample contacts data
const contactsData = [
  {
    id: 1,
    name: "Alexander Mitchell",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg",
    lastMessage: "Thank you for the last session. It was very helpful.",
    timestamp: "09:45 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=50&width=50",
    lastMessage: "Can we reschedule our next session?",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=50&width=50",
    lastMessage: "I've updated my resume as you suggested.",
    timestamp: "Jan 3",
    unread: 1,
    online: true,
  },
  {
    id: 4,
    name: "Sarah Thompson",
    avatar: "/placeholder.svg?height=50&width=50",
    lastMessage: "Looking forward to our next session!",
    timestamp: "Dec 28",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=50&width=50",
    lastMessage: "Thanks for the resources you shared.",
    timestamp: "Dec 22",
    unread: 0,
    online: false,
  },
]

// Sample messages data
const messagesData = {
  1: [
    {
      id: 1,
      sender: "Alexander Mitchell",
      text: "Hello! I wanted to check in about our upcoming session.",
      timestamp: "09:30 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      text: "Hi Alexander! Yes, we're still on for tomorrow at 10am.",
      timestamp: "09:35 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "Alexander Mitchell",
      text: "Great! I've been working on those exercises you recommended.",
      timestamp: "09:38 AM",
      isMe: false,
    },
    {
      id: 4,
      sender: "Me",
      text: "That's excellent! Looking forward to hearing about your progress.",
      timestamp: "09:40 AM",
      isMe: true,
    },
    {
      id: 5,
      sender: "Alexander Mitchell",
      text: "Thank you for the last session. It was very helpful.",
      timestamp: "09:45 AM",
      isMe: false,
    },
  ],
  3: [
    {
      id: 1,
      sender: "Michael Brown",
      text: "Hi, I've updated my resume as you suggested.",
      timestamp: "Jan 3, 08:15 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "Me",
      text: "Great! Please send it over and I'll review it before our next session.",
      timestamp: "Jan 3, 09:20 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "Michael Brown",
      text: "I've attached it to this message. Let me know what you think!",
      timestamp: "Jan 3, 10:05 AM",
      isMe: false,
      attachment: {
        type: "document",
        name: "Michael_Brown_Resume_2025.pdf",
      },
    },
  ],
}

export default function CounselorMessages() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts] = useState(contactsData)
  const [selectedContact, setSelectedContact] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)

  // Load initial messages
  useState(() => {
    setMessages(messagesData)
  }, [])

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleContactSelect = (contact) => {
    setSelectedContact(contact)
    // Mark messages as read when contact is selected
    if (contact.unread > 0) {
      const updatedContacts = contacts.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c))
      // In a real app, you would update the state here
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const newMsg = {
      id: Date.now(),
      sender: "Me",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    }

    // Update messages state
    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedContact.id]: [...(prevMessages[selectedContact.id] || []), newMsg],
    }))

    // Clear input
    setNewMessage("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg"
            alt="James Anderson"
            className="profile-image"
          />
          <h3 className="profile-name">James Anderson</h3>
          <p className="profile-title">Career Development Specialist</p>
        </div>

        <nav className="sidebar-menu">
          <Link to="/counselor/dashboard" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaHome />
              </span>
              <span className="menu-text">Dashboard</span>
            </div>
          </Link>
          <Link to="/counselor/profile" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUser />
              </span>
              <span className="menu-text">My Profile</span>
            </div>
          </Link>
          <Link to="/counselor/bookings" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaCalendarAlt />
              </span>
              <span className="menu-text">Bookings</span>
            </div>
          </Link>
          <Link to="/counselor/schedule" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaClock />
              </span>
              <span className="menu-text">Schedule Timings</span>
            </div>
          </Link>
          <Link to="/counselor/counselees" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUsers />
              </span>
              <span className="menu-text">My Counselees</span>
            </div>
          </Link>
          <Link to="/counselor/messages" className="menu-item active">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaEnvelope />
              </span>
              <span className="menu-text">Messages</span>
            </div>
            <span className="menu-badge">3</span>
          </Link>
          <Link to="/counselor/change-password" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaKey />
              </span>
              <span className="menu-text">Change Password</span>
            </div>
          </Link>
          <Link to="/counselor/delete-account" className="menu-item">
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

      {/* Main Content */}
      <main className="main-content">
        <div className="messages-container">
          {/* Contacts List */}
          <div className="contacts-panel">
            <div className="contacts-header">
              <h2>Messages</h2>
              <div className="contacts-search">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
            </div>

            <div className="contacts-list">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`contact-item ${selectedContact?.id === contact.id ? "active" : ""}`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="contact-avatar-container">
                    <img src={contact.avatar || "/placeholder.svg"} alt={contact.name} className="contact-avatar" />
                    {contact.online && (
                      <span className="online-indicator">
                        <FaCircle />
                      </span>
                    )}
                  </div>
                  <div className="contact-info">
                    <div className="contact-header">
                      <h3 className="contact-name">{contact.name}</h3>
                      <span className="contact-time">{contact.timestamp}</span>
                    </div>
                    <p className="contact-message">{contact.lastMessage}</p>
                  </div>
                  {contact.unread > 0 && <span className="unread-badge">{contact.unread}</span>}
                </div>
              ))}

              {filteredContacts.length === 0 && (
                <div className="no-contacts">
                  <p>No contacts found</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages Panel */}
          <div className="messages-panel">
            {selectedContact ? (
              <>
                <div className="messages-header">
                  <div className="contact-info">
                    <img
                      src={selectedContact.avatar || "/placeholder.svg"}
                      alt={selectedContact.name}
                      className="contact-avatar"
                    />
                    <div>
                      <h3>{selectedContact.name}</h3>
                      <p className="contact-status">
                        {selectedContact.online ? (
                          <span className="status-online">
                            <FaCircle className="status-icon" /> Online
                          </span>
                        ) : (
                          <span className="status-offline">Offline</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="messages-actions">
                    <button className="action-button">
                      <FaEllipsisH />
                    </button>
                  </div>
                </div>

                <div className="messages-content">
                  {messages[selectedContact.id]?.map((message) => (
                    <div
                      key={message.id}
                      className={`message-bubble ${message.isMe ? "message-sent" : "message-received"}`}
                    >
                      {message.attachment && (
                        <div className="message-attachment">
                          <FaFileAlt className="attachment-icon" />
                          <span className="attachment-name">{message.attachment.name}</span>
                        </div>
                      )}
                      <p className="message-text">{message.text}</p>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                  ))}
                </div>

                <div className="messages-input">
                  <div className="input-attachments">
                    <button
                      className="attachment-button"
                      onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                    >
                      <FaPaperclip />
                    </button>
                    {showAttachmentOptions && (
                      <div className="attachment-options">
                        <button className="attachment-option">
                          <FaImage /> Image
                        </button>
                        <button className="attachment-option">
                          <FaFileAlt /> Document
                        </button>
                      </div>
                    )}
                  </div>
                  <textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  ></textarea>
                  <div className="input-actions">
                    <button className="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                      <FaSmile />
                    </button>
                    <button className="send-button" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <FaPaperPlane />
                    </button>
                  </div>
                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      {/* Emoji picker would go here */}
                      <div className="emoji-grid">
                        {["😊", "😀", "😂", "🙂", "😍", "👍", "🙏", "💪", "⭐", "❤️", "👋", "😎"].map((emoji, index) => (
                          <button
                            key={index}
                            className="emoji"
                            onClick={() => {
                              setNewMessage(newMessage + emoji)
                              setShowEmojiPicker(false)
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-conversation-selected">
                <div className="no-conversation-content">
                  <FaEnvelope className="no-conversation-icon" />
                  <h3>Select a conversation</h3>
                  <p>Choose a contact from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

