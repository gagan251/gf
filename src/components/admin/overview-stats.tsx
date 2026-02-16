'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, FileText } from "lucide-react";
import CountUp from "react-countup";

const stats = [
    { title: "Total Students", value: 125, icon: Users, color: "text-sky-400" },
    { title: "Reviews Count", value: 32, icon: Star, color: "text-amber-400" },
    { title: "Courses", value: 3, icon: FileText, color: "text-emerald-400" }
];

export function OverviewStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                    <div className="absolute top-0 left-0 h-full w-1 bg-primary"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">
                            <CountUp end={stat.value} duration={2.5} separator="," />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
