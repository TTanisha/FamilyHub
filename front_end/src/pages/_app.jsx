/*
NOTE: THIS IS A REQUIRED FILE FOR NEXTUI 
See https://nextui.org/docs/guide/getting-started for more details. 
*/

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";

function MyApp({ Component, pageProps }) {
  return (
    // 2. Use at the root of your app
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
