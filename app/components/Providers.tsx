"use client";

// import { ImageKitProvider } from "@imagekit/next";
import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ImageKitProvider
        urlEndpoint={urlEndpoint}
        publicKey={process.env.NEXT_PUBLIC_PUBLIC_KEY!}
        authenticator={async () => {
          const res = await fetch("/api/auth/imagekit-auth");
          if (!res.ok) throw new Error("Auth failed");
          const { authenticationParameters } = await res.json();
          return authenticationParameters; // the {signature,token,expire} object
        }}
      >
        {children}
      </ImageKitProvider>
    </SessionProvider>
  );
}
