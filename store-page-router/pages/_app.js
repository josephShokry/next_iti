import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const hideNavbar = Component.hideNavbar === true;

  return (
    <SessionProvider session={session}>
      {!hideNavbar && <Navbar />}
      <Component {...pageProps} />
    </SessionProvider>
  );
}