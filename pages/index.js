import logo from "../public/chat.png"
import Image from 'next/image'
import { Button, Col, Container, Row } from 'react-bootstrap';
import styles from '../styles/Home.module.css'
import { signIn,signUp, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home({props}) {
  const router = useRouter();
  const session = useSession();
  if (session.status === "loading") {
    return <p>Loading...</p>
  }
  if (session.status === "authenticated") {
    router.replace('/chatroom')
    return 
  }
  return (
    <div className="App">
      <header className={styles.appHeader}>
        <Container>
          <Row>
            <Col>
              <Image src={logo} className={styles.appLogo} alt="logo" width={100} height={100} />
            </Col>
            <Col>
              <h3>Welcome to Awesome Chat!</h3>
              <Row >
                <Col>
                <Button onClick={signIn}>Sign In</Button> <Button onClick={() => {
                  router.push('/register')
                }}>Register</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </header>

    </div>
  )
}
