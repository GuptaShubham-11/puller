'use client';

import { Button } from "@/components/ui/button";
import { Container } from "../container";
import { Signature } from "../signature";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { JoinBevelIcon } from '@hugeicons/core-free-icons';
import Link from "next/link";

export const Hero = () => {
    const router = useRouter();

    return (
        <section id="hero" className="relative overflow-hidden py-24">
            <Signature />

            <Container className="relative z-10 pt-28 flex max-w-5xl flex-col items-center text-center">
                <h1 className="font-space-grotesk-heading text-5xl font-bold tracking-tight md:text-6xl text-balance">
                    Commits into {' '}
                    <span className="text-brand">
                        changelog & release in seconds.
                    </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm text-balance md:text-base leading-6 text-muted-foreground">
                    Dyit analyzes your commits, pull requests, and changes to
                    automatically generate beautiful changelogs and release notes—ready
                    to publish in seconds.
                </p>

                <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                    <Button onClick={() => router.push('/join-waitlist')} className={'font-space-grotesk-heading cursor-crosshair'}>
                        Join The Waitlist
                        <HugeiconsIcon
                            icon={JoinBevelIcon}
                            size={24}
                            strokeWidth={1.5}
                            className="fill-brand text-brand"
                        />
                    </Button>
                </div>

                <p className="max-w-sm text-sm text-muted-foreground mt-16  leading-relaxed">
                    By continuing, you acknowledge and agree to our{' '}
                    <Link
                        href="/legal/terms"
                        className="inline-block text-foreground font-medium hover:border-b border-b-0.5 border-b border-border transition-all duration-200 hover:text-primary hover:border-primary hover:-translate-y-px"
                    >
                        Terms of Use
                    </Link>{' '}
                    and{' '}
                    <Link
                        href="/legal/privacy"
                        className="inline-block text-foreground font-medium hover:border-b border-b-0.5 border-b border-border transition-all duration-200 hover:text-primary hover:border-primary hover:-translate-y-px"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>

            </Container>
        </section>
    );
};