import { Sparkles, TrendingUp, FileText, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Daily Practice',
    description: 'Engaging daily exercises tailored to improve your skills efficiently.',
  },
  {
    icon: TrendingUp,
    title: 'Speed Improvement',
    description: 'Regularly test your speed and accuracy, and watch your skills grow over time.',
  },
  {
    icon: FileText,
    title: 'Exam-oriented Tests',
    description: 'Prepare for real-world exams with our specialized test modules and dictation practice.',
  },
  {
    icon: LayoutDashboard,
    title: 'Simple Dashboard',
    description: 'Track your progress and access all your courses and materials from one easy-to-use dashboard.',
  },
];

export function WhyChooseUs() {
  return (
    <section id="features" className="container mx-auto py-16 sm:py-24">
      <div className="grid grid-cols-1 items-center gap-12">
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center">
                <h2 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Why Choose Us
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Everything you need to excel in one place.
                </p>
            </div>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-1 text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
