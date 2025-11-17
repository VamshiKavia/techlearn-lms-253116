import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSession, onAuthChange } from "../auth/session";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      const s = await getSession();
      setAuthed(!!s);
      setLoading(false);
      unsub = onAuthChange(async () => {
        const ns = await getSession();
        setAuthed(!!ns);
      });
    })();
    return () => unsub();
  }, []);

  if (loading) return null;
  if (!authed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
