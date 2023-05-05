/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import bg from "../components/bg.jpg";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { auth } from "../firebase/firebase";
import styles from "../styles/landing.module.scss";
import { useAuth } from "../firebase/auth";
import { Close } from "@mui/icons-material";

const REDIRECT_PAGE = "/dashboard";

//Configure Firebase
const uiConfig = {
  signInFlow: "popup", // signin flow with popup rather than redirect flow
  signInSuccessUrl: REDIRECT_PAGE,
  // can be Google, Facebook, Twitter, emai/password etc..
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
};

export default function Home() {
  const [login, setLogin] = useState(false);
  const router = useRouter();
  const { authUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/dashboard");
    }
  }, [authUser, isLoading]);

  return (
    <div>
      <Head>
        <title>House Budget Tracker</title>
      </Head>

      <main>
        <Container className={styles.container} backgroundImage="url(${bg})">
          <Typography variant="h1" align="center" color="#ed6c02">
            Welcome to your everyday House Budget Tracker!
          </Typography>
          <br></br>
          <Typography variant="h2" fontSize={"0.4em"} align="center">
            Add, view, edit, and delete expenses for you and your family.
          </Typography>
          <br></br>

          <div className={styles.buttons}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => setLogin(true)}
            >
              Login / Register
            </Button>
            <dialog open={login} onClose={() => setLogin(false)}>
              <Close
                onClick={() => setLogin(false)}
                className="absolute right-4 top-4"
              />
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={auth}
              ></StyledFirebaseAuth>
            </dialog>
          </div>
        </Container>
      </main>
    </div>
  );
}
