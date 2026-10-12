import { getCurrentUser } from '@/lib/auth/authorization';
import { getMeetingsFromDb, getDashboardStats } from '@/lib/db-service';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();


  const [meetings, stats] = await Promise.all([
    getMeetingsFromDb(),
    getDashboardStats(),
  ]);

  return (
    <DashboardClient
      initialMeetings={meetings}
      metrics={stats?.metrics}
      workload={stats?.bureauWorkload}
      followUpMetrics={stats?.followUpMetrics}
      monthlyActivity={stats?.monthlyActivity}
      totalResolutions={stats?.actionItemStats?.total}
      teamWorkload={stats?.teamWorkload}
      userRole={currentUser?.role}
      userTeamCode={currentUser?.teamCode}
      userTeamName={currentUser?.teamName}
    />
  );
}

