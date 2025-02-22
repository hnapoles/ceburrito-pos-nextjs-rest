import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children}: { children: React.ReactNode } ) => {
  return (
    <>
      <div className="z-[99999]">
      </div>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};

export default AuthProvider;