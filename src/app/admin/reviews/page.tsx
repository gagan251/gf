
'use client';

import { ReviewsList } from '@/components/admin/reviews-list';
import { AdminShell } from '@/components/admin/admin-shell';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminReviewsPage() {
  return (
    <AdminShell
      pageTitle="User Reviews"
      pageDescription="View and manage user-submitted testimonials and feedback."
      headerIcon={<MessageSquare className="h-8 w-8 text-primary" />}
    >
      <Card>
          <CardHeader>
              <CardTitle>All Submitted Reviews</CardTitle>
              <CardDescription>
                  Here are the latest submissions from your users. Approve or hide them as needed.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <ReviewsList />
          </CardContent>
      </Card>
    </AdminShell>
  );
}
