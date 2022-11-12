import { Col, Form, Button, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import logo from "../../public/chat.png"
import styles from '../../styles/SignIn.module.css'
import Link from "next/link";
import {  useRouter } from 'next/router';
import { signIn } from "next-auth/react";

const SignIn = (props) => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState();
  const router = useRouter();
  const login = async () => {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });
      console.log(res)
      setLoading(false);
      if (res.status != 200) {
        toast.error(res.error);        
        return
      }
      router.push('/chatroom')      
    } catch (error) {
      setLoading(false);
      error.message = error.response ? error.response.data.message : error.message;
      toast.error(error.message);
    }
  };
  return (
    <div className="App">
      <ToastContainer />
      <header className={styles.appHeader}>
        <Container>
          <Row>
            <Col>
              <Image src={logo} className="App-logo" alt="logo" width={100} height={100} />
            </Col>
            <Col>
              <Form>
                <Form.Label>Log in to your account</Form.Label>
                <Form.Group controlId="email">
                  <Form.Control
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="email"
                    placeholder="Enter email"
                  />
                </Form.Group>
                <br />
                <Form.Group controlId="password">
                  <Form.Control
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <br />
                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={() => {
                    login();
                  }}
                >Login
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </header>

    </div>
  );
};

export default SignIn;