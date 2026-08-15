import { apiFetch } from '../utils/api';

export const postActivities = async (activities) => {
  if (!activities || activities.length === 0) return;

  const events = activities.map(item => ({
    event_type: item.eventType,
    target_type: "POST",
    target_id: item.postId,
    occurred_at: new Date().toISOString(),
  }));

  try {
    return await apiFetch('/activity/impressions', {
      method: 'POST',
      body: JSON.stringify({ events }),
    });
  } catch (error) {
    console.error('Error posting activities:', error);
  }
};
