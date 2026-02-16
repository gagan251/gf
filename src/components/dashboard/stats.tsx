import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { name: 'Typing Speed (WPM)', value: '42', period: 'Today' },
  { name: 'Accuracy (%)', value: '94%', period: 'Weekly' },
  { name: 'Total Practice Sessions', value: '18', period: 'All' },
  { name: 'Tests Attempted', value: '6', period: 'All' },
];

export function Stats() {
  return (
    <section className="rounded-lg border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground">
        Quick Performance Stats
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">{stat.name}</CardTitle>
              <span className="text-xs text-muted-foreground">
                {stat.period}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Last recorded</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
