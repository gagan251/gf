import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-16">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Welcome to Bharat Communication Center. This Privacy Policy is
              meant to help you understand what information we collect, why we
              collect it, and how you can update, manage, export, and delete
              your information.
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Information We Collect
            </h2>
            <p>
              We collect information to provide better services to all our
              users. The types of information we collect include personal
              information like your name, email address, and payment
              information when you sign up for our courses. We also collect
              data on your performance in tests and exercises to help you track
              your progress.
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              How We Use Information
            </h2>
            <p>
              We use the information we collect to operate, maintain, and
              provide to you the features and functionality of the service, to
              communicate with you, to monitor and improve our service, and to
              help you track your learning progress.
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Sharing Your Information
            </h2>
            <p>
              We do not share your personal information with companies,
              organizations, or individuals outside of Bharat Communication
              Center except in the following cases: with your consent, for
              legal reasons.
            </p>
            <p>This is a placeholder privacy policy. Please replace with your own.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
