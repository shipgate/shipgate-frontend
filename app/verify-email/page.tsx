"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { verifyEmail, isLoading, error } = useAuthStore();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await verifyEmail({ token });
        setSuccess(true);

        // Redirect after success
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      } catch {
        // error handled by store
      }
    };

    verify();
  }, [token, verifyEmail, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>

          {!isLoading && !success && !error && (
            <>
              <p>
                We have sent a verification email to your inbox. Click the link
                in the email to verify your account.
              </p>

              <a
                href="https://mail.google.com/mail/u/0/#inbox"
                target="_blank"
                className="mt-5"
              >
                <Button>Open GMAIL</Button>
              </a>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {isLoading && <p>Verifying your email...</p>}

          {success && (
            <>
              <p className="text-green-600 font-medium">
                ✅ Email verified successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to login...
              </p>
            </>
          )}

          {error && (
            <>
              <p className="text-red-600">{error}</p>
              <Button onClick={() => router.push("/login")}>Go to Login</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
