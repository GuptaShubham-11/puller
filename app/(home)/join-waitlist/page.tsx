'use client';

import { Container } from '@/components/core/container';
import { WaitlistForm } from '@/components/core/join-waitlist/waitlist-form';

export default function JoinWaitlist() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Container className="py-8 md:py-16 flex flex-col justify-center gap-12 max-w-5xl px-8">
        <div className="flex flex-col justify-center gap-4 max-w-md">
          <h1 className="font-space-grotesk-heading text-3xl font-bold tracking-tight text-foreground">
            Join The Waitlist
          </h1>

          <p className="text-balance text-muted-foreground">
            Be among the first to experience the product. We&#39;ll only send important updates—no
            spam, ever.
          </p>
        </div>

        <WaitlistForm />
      </Container>
    </main>
  );
}
