import CommunityTimeline from '@/components/timelines/community-timeline';
import { createFileRoute } from '@tanstack/react-router';
import { useParams } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_protected/dashboard/communities/community/$communityName',
)({
  component: RouteComponent,
});

function RouteComponent() {
  // Extract the communityName parameter from the route
  const { communityName } = useParams({
    from: '/_protected/dashboard/communities/community/$communityName',
  });

  return (
    <div>
      <CommunityTimeline communityName={communityName} />
    </div>
  );
}
