import Head from 'next/head'
import { signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import io from 'socket.io-client'
import { useEffect, useRef, useState } from 'react';
import { Card, Col, Container, Form, InputGroup, Nav, Navbar, Row } from 'react-bootstrap';
import styles from '../styles/ChatRoom.module.css'
import { faCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
let socket;
export default function Home(props) {
  const router = useRouter();
  const session = useSession()
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [messages, setMessages] = useState();
  const messagesEndRef = useRef(null);

  async function getMsgs() {
    let { data } = await axios.get('/api/chat-msgs')
    setMessages(data);
  }
  async function getUsers() {
    let { data } = await axios.get('/api/users')
    setUsers(data);
  }
  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socketio");
    socket = io();
    if (session.data?.user) {
      socket.emit("connectToChat", { email: session.data?.user?.email })
    }
    socket.on("newMessage", (data) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        data.message,
      ]);
      scrollToBottom()
    });
    socket.on("currentOnlineUsers", async (onlineUsers) => {
      let { data } = await axios.get('/api/users')
      setUsers((prev) => {
        let temp = data.map(u => {
          u.online = onlineUsers.includes(u._id)
          return u
        })
        return [...temp]
      })
    });
    socket.on("exception", (err) => {
      toast.error(err.message)
    });

  };
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  useEffect(() => {
    setCurrentUser(session.data?.user)
    getMsgs();
    getUsers();
    socketInitializer()
  }, [session]);
  const sendMessage = (e) => {
    e?.preventDefault();
    socket.emit('sendMessage', {
      email: session.data?.user?.email, message
    })
    setMessage("")
  }
  if (session.status === "loading") {
    return <p>Loading...</p>
  }
  if (session.status === "unauthenticated") {
    router.push('/')
    return <p>Access Denied</p>
  }
  const formatDate = (date) => {
    return new Date(date).getHours() + ":" + new Date(date).getMinutes()
  }
  const logOut = (e) => {
    e.preventDefault();
    console.log("Logging out")
    signOut();
    router.push('/')
  }

  const isMine = (message) => message?.sender?.email === currentUser?.email ? true : false;
  return (
    <div className={styles.container}>
      <Nav
        activeKey="/home"
        className="justify-content-end" 
       
      >
        <Nav.Item>
          <Nav.Link>LoggedIn as {currentUser?.email.split('@')[0]}@</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link  onClick={(e)=>{logOut(e)}}>
            Logout
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Head>
        <title>Awesome Chat App</title>
        <meta name="description" content="Sample App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h4 className={`${styles['title']} text-center`}>
        Awesome Chat!
      </h4>
      <Row className={styles.chatroom}>
        <Col md={3} >
          <h5 className='text-center'>Users</h5>
          {users.map((u, i) => {
            return <Card className={styles.m10} key={`${i}sender`} >
              <Card.Header key={`${i}xxy`}><FontAwesomeIcon className={u.online ? styles.oicon : styles.ficon} icon={faCircle} />{" "}{u.fullName} </Card.Header>
            </Card>
          })}
        </Col>
        <Col>
          <h5 className='text-center'>Chat Room</h5>
          <Container className={styles.chatcontainer}>
            <div className={styles.innerContainer}>
              {messages?.map((m) => {
                return (
                  <div key={m._id} className={`${styles["chat"]} ${isMine(m) ? styles["chatYou"] : styles["chatElse"]}`}>
                    <span key={`${m._id}sender`} className={`${styles["sender"]}`}>{m.sender?.name}</span>
                    <p className={`${styles["textbody"]}`}>{m.body}</p>
                    <span className={`text-muted ${styles["tm"]}`}>{m.createdAt ? formatDate(m.createdAt) : ""}</span>
                  </div>)
              })}
              <div ref={messagesEndRef} />
            </div>
            <InputGroup className="mb-3 chatinput">
              <Form.Control
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage()
                  }
                }}
                placeholder="type message here.."
                aria-label="Recipient's username"
              />
              <InputGroup.Text onClick={(e) => sendMessage(e)} id="basic-addon2"><FontAwesomeIcon icon={faPaperPlane} /></InputGroup.Text>
            </InputGroup>
          </Container>
        </Col>
      </Row>
      <ToastContainer />
    </div >

  )
}
