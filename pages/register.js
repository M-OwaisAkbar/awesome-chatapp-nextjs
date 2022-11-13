import { Col, Form, Button, Container, Row, Nav } from "react-bootstrap";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import logo from "../public/chat.png"
import styles from '../styles/Register.module.css'
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Register = () => {
  const session = useSession();
  const router = useRouter();
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    fullName: ""
  });
  const [loading, setLoading] = useState(false);

  const signUp = async (e) => {
    try {
      e.preventDefault();
      //yup or any other validation tech can be used 
      //this for simplicity
      if (!signUpData.fullName.trim() || !signUpData.email.trim() || !signUpData.fullName.trim()) {
        toast.error("Invalid email,fullname or password")
        return
      }
      setLoading(true);
      await axios.post('/api/register', signUpData);
      setLoading(false);
      toast.success(`👋 Hurray you are registered!`);
      setTimeout(()=>{
        router.push('/')
      },1200)
    } catch (error) {
      setLoading(false);
      error.message = error.response ? error.response.data.message : error.message;
      toast.error(error.message);
    }
  };
  if (session.status === "loading") {
    return <p>Loading...</p>
  }
  if (session.status === "authenticated") {
    router.replace('/chatroom')
    return 
  }
  return (
    <div className="App">
      <div className={styles.appHeader}>
        <Container>
          <Row>
            <Col>
              <Image src={logo} className="App-logo" alt="logo" width={100} height={100} />
            </Col>
            <Col>
              <Form>
                <Form.Label>Create Account</Form.Label>
                <Form.Group controlId="email">
                  <Form.Control
                    onChange={(e) => {
                      setSignUpData((prev) => {
                        return { ...prev, email: e.target.value }
                      })
                    }}
                    type="email"
                    placeholder="Enter email"
                  />
                </Form.Group>
                <br />
                <Form.Group controlId="fullName">
                  <Form.Control
                    onChange={(e) => {
                      setSignUpData((prev) => {
                        return { ...prev, fullName: e.target.value }
                      })
                    }}
                    type="text"
                    placeholder="Enter your fullname"
                  />
                </Form.Group>
                <br />
                <Form.Group controlId="password">
                  <Form.Control
                    onChange={(e) => {
                      setSignUpData((prev) => {
                        return { ...prev, password: e.target.value }
                      })
                    }}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <br />
                <Button
                  variant="primary"
                  disabled={loading}
                  onClick={(e) => {
                    signUp(e);
                  }}
                >
                  Register
                </Button>
                <br />
                <a href="/">back to home</a>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;