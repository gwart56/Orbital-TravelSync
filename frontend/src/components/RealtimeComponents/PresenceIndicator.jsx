// components/PresenceIndicator.js
import { supabase } from '../../lib/supabaseClient';
import './PresenceIndicator.css';
import { useEffect, useState } from 'react';

export default function PresenceIndicator({ itinDbId , sessionUser}) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTimeOut, setIsTimeOut] = useState(false);

    useEffect(() => {
      if (!sessionUser || !itinDbId) return;

      // Create a presence channel specific to this itinerary
      const presenceChannel = supabase.channel(`itin-presence-${itinDbId}`, {
        config: {
          presence: {
            key: sessionUser.id // Use user ID as the presence key
          }
        }
      });

      // Track presence when joining
      presenceChannel
        .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            const users = Object.values(state).flat();
            setOnlineUsers(users);
            console.log('Online users:', state);
          // Here you would update your state to show who's online
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('New users joined:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          console.log('Users left:', leftPresences);
        })
        .subscribe(async (status) => {
          console.log(`[Realtime] presence channel status:`, status);
          if (status === 'SUBSCRIBED') {
            setIsTimeOut(false);
            // Track the current user's presence
            await presenceChannel.track({
              user_id: sessionUser.id,
              email: sessionUser.email,
              name: sessionUser.user_metadata?.full_name || sessionUser.email,
              avatar: sessionUser.user_metadata?.avatar_url,
              online_at: new Date().toISOString()
            });
          } 
          if (status === 'TIMED_OUT') {
            setIsTimeOut(true);
          }
        });

      return () => {
        presenceChannel.unsubscribe();
      };
    }, [sessionUser, itinDbId]);

  return (
    <div className="presence-indicator">
      <div className="online-users">
        {onlineUsers.map((user, index) => (
            <div 
                key={user.user_id || index}
                className="user-badge"
                style={{ '--user-index': `${index}` }}
                data-email={user.email}
                title={user.name}
            >
            {(user.name?.charAt(0) || '?').toUpperCase()}
            </div>
        ))}
        </div>
      {isTimeOut?<><p className='text-danger'>
        Realtime Collaboration
      </p><p className='text-danger'>
        Currently Unavailable
      </p></>
      :onlineUsers.length==0?<small>
        Loading...
      </small>
      :<small className="text-muted">
        {onlineUsers.length} {onlineUsers.length === 1 ? 'person' : 'people'} viewing
      </small>}
    </div>
  );
}