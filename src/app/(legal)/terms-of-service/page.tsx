import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl py-16">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Welcome to Bharat Communication Center. By using our website and
              services, you are agreeing to these terms. Please read them
              carefully.
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Using our Services
            </h2>
            <p>
              You must follow any policies made available to you within the
              Services. Don’t misuse our Services. For example, don’t interfere
              with our Services or try to access them using a method other than
              the interface and the instructions that we provide.
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Your Account
            </h2>
            <p>
              You may need an account to use some of our Services. You are
              responsible for the activity that happens on or through your
              account.
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Our Content
            </h2>
            <p>
              All content included on the site, such as text, graphics, logos,
              images, as well as the compilation thereof, and any software used
              on the site, is the property of Bharat Communication Center or its
              suppliers and protected by copyright and other laws.
            </p>
            <p>This is a placeholder terms of service. Please replace with your own.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
