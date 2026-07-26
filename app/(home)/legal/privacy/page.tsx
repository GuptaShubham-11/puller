import Link from "next/link";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";

interface PrivacySection {
    title: string;
    subtitle?: string;
    content?: string[];
    list?: string[];
}

export const PRIVACY_POLICY: readonly PrivacySection[] = [
    {
        title: "Introduction",
        subtitle: "Commitment to Privacy",
        content: [
            "At Dyit ('we', 'our', or 'us'), privacy is a foundational pillar of how we build software. This Privacy Policy details how we collect, process, secure, and share your personal data when you interact with our platform, website, and developer automation tools.",
            "By creating an account or utilizing our Service, you acknowledge the data collection practices described herein. We process your information strictly in compliance with global standards, including GDPR and CCPA regulations."
        ]
    },
    {
        title: "Information We Collect",
        subtitle: "Data Scope",
        content: [
            "To provide our automation and workflow services seamlessly, we collect specific information depending on how you interact with our infrastructure:"
        ],
        list: [
            "Account Data: Your name, email address, GitHub/GitLab OAuth tokens, and profile metadata provided during authorization.",
            "Operational Logs: IP addresses, browser fingerprints, system logs, hardware configurations, and execution timelines of automated tasks.",
            "Repository Metadata: Repository IDs, branch pathways, file paths, webhook payloads, and structural commit metrics required to process code operations.",
            "Billing Records: For premium subscriptions, transaction records and invoicing details (Note: payment details are safely stored via third-party processors like Stripe)."
        ]
    },
    {
        title: "How We Use Your Data",
        subtitle: "Processing Purposes",
        content: [
            "We process your data strictly to fulfill our contract with you, protect our platform security, and improve performance. Specifically, data is used to:"
        ],
        list: [
            "Authenticate your profile and maintain cross-session platform stability.",
            "Execute automated webhooks, pull requests, and continuous developer integrations.",
            "Monitor underlying infrastructure loads to optimize API delivery times and mitigate security incidents.",
            "Distribute critical platform announcements, downtime alerts, security disclosures, and direct support resolutions."
        ]
    },
    {
        title: "Code and Repository Privacy",
        subtitle: "Your Source Code Safety",
        content: [
            "We treat your code repositories as highly sensitive intellectual assets. Dyit requests the absolute minimum necessary API permissions from your Git provider to perform automated operations.",
            "We do not download, persistent-store, or index your private source code on our permanent storage drives. Code files processed during workflows are cached in isolated runtime sandboxes and completely wiped immediately upon task completion."
        ]
    },
    {
        title: "Data Retention and Deletion",
        subtitle: "Lifecycle Management",
        content: [
            "We retain your personal data only as long as your account remains active or as required to fulfill core platform operations. System operational logs are automatically overwritten or anonymized within thirty (30) days.",
            "You retain full control over your data. You can trigger complete account deletion at any time via your user dashboard settings. Upon deletion, all OAuth tokens, account records, and custom configurations are permanently purged from our primary database nodes within 48 hours."
        ]
    },
    {
        title: "Third-Party Service Providers",
        subtitle: "Data Processors",
        content: [
            "We do not sell, trade, or rent your personal data to advertisers. We share information only with a select list of trusted, compliant sub-processors vital to running our infrastructure (e.g., AWS for secure server hosting, Postmark for email pipelines, and Stripe for payments).",
            "All sub-processors are legally bound by strict Data Processing Agreements (DPAs) to ensure your data receives identical protection standards as outlined in this policy."
        ]
    },
    {
        title: "Security Infrastructure",
        subtitle: "Advanced Safeguards",
        content: [
            "We implement robust, enterprise-grade safety protocols to defend your data against unauthorized access, alteration, disclosure, or destruction.",
            "All inbound and outbound platform traffic is encrypted using Transport Layer Security (TLS 1.3). Static databases utilize Advanced Encryption Standard (AES-256) at rest, and third-party integration keys are compartmentalized using isolated hardware security modules (HSM)."
        ]
    },
    {
        title: "Global Compliance and Privacy Rights",
        subtitle: "GDPR and CCPA Frameworks",
        content: [
            "Depending on your geographical location, you hold explicit legal rights over your information under regulations like the EU General Data Protection Regulation (GDPR) or California Consumer Privacy Act (CCPA):"
        ],
        list: [
            "The Right to Access: You can request a digital copy of all personal data we hold about your profile.",
            "The Right to Rectification: You can update incorrect or incomplete structural profile attributes.",
            "The Right to Erasure: You can request total deletion of your active system traces ('The Right to be Forgotten').",
            "The Right to Data Portability: You can export your data in a structured, standard machine-readable JSON format."
        ]
    },
    {
        title: "Policy Revisions",
        subtitle: "Updates",
        content: [
            "We modify this Privacy Policy as our service infrastructure scales or legal frameworks change. Any changes will be posted on this URL with an updated revision date.",
            "Substantial alterations impacting your data handling parameters will be communicated via direct email broadcast or prominent system notifications prior to taking effect."
        ]
    },
    {
        title: "Privacy Contact Office",
        subtitle: "Inquiries",
        content: [
            "If you have any questions about these privacy practices, data handling, or wish to assert your global privacy rights, please reach out directly to our team."
        ]
    }
] as const;

const LAST_UPDATED = "July 25, 2026";

export default function Terms() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <Button variant="secondary">
                <Link href="/" className="flex items-center gap-1">
                    <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
                    Back
                </Link>
            </Button>

            <header className="mb-8 mt-4 space-y-3 border-b border-border pb-4">
                <h1 className="font-space-grotesk-heading text-4xl font-bold tracking-tight">
                    Privacy Policy
                </h1>

            </header>

            <div className="space-y-12">
                {PRIVACY_POLICY.map((section, index) => (
                    <section key={section.title} className="space-y-2">
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-sm font-semibold text-muted-foreground">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <h2 className="font-space-grotesk-heading text-2xl font-semibold tracking-tight">
                            {section.title}
                        </h2>

                        {section.content?.map((paragraph) => (
                            <p
                                key={paragraph}
                                className="leading-6 text-muted-foreground"
                            >
                                {paragraph}
                            </p>
                        ))}

                        {section.list && (
                            <ul className="space-y-3 text-muted-foreground">
                                {section.list.map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}

                <p className="text-sm text-muted-foreground">
                    Last updated: {LAST_UPDATED}
                </p>
            </div>
        </main>
    );
}