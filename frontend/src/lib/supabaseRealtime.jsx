import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import {v4 as genId} from "uuid";

export function useRealtimeActivities(dayId, refetchFn) {
  useEffect(() => {
    if (!dayId) return;

    const channelName = `activities_day_${dayId}_${genId()}`;
    const existing = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);

    if (existing) {
      console.log(`[Realtime] Channel already exists for ${channelName}, skipping.`);
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activities',
        filter: `"travelDayId"=eq.${dayId}`,
      }, payload => {
        console.log('[Realtime] Activity change detected', payload);
        refetchFn();
      })
      .subscribe(status => console.log(`[Realtime] [${channelName}] Status:`, status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dayId, refetchFn]);
}


export function useRealtimeTravelDays(itineraryId, refetchFn) {
  useEffect(() => {
    if (!itineraryId) return;

    let channel;

    
    const setupRealtime = () => {
      channel = supabase
        .channel(`travel_days_itin_${itineraryId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'travelDays',
          filter: `"itineraryId"=eq.${itineraryId}`,
        }, payload => {
          console.log('[Realtime] Travel day change detected', payload);
          refetchFn();
        })
        .subscribe(status => console.log("[realtime] status:", status));
    };

    setupRealtime();

    setTimeout(() => {
        console.log('[Realtime] Channel state after delay:', channel.state);
        }, 1000);

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [itineraryId, refetchFn]);
}


export function useRealtimeAllActivities(refetchFn) {
  useEffect(() => {
    
    const channel = supabase
      .channel('all_activities')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activities',
      }, payload => {
        console.log('Realtime activity event:', payload);
        refetchFn();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchFn]);
}


export function useRealtimeSync(itinDbId, onTravelDaysChange, onActivitiesChange) {
  useEffect(() => {
    if (!itinDbId) return;

    const travelDaysChannel = supabase
      .channel(`travel_days:itinerary_${itinDbId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'travelDays',
        filter: `itineraryId=eq.${itinDbId}`
      }, payload => onTravelDaysChange(payload))
      .subscribe(status => console.log("STATUS", status));

    const activitiesChannel = supabase
      .channel(`activities:itinerary_${itinDbId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'activities',
        // filter: `travelDayId=eq.*` // you may narrow later
      }, payload => onActivitiesChange(payload))
      .subscribe(status => console.log("STATUS", status));

    // const testChannel = supabase
    // .channel('test_realtime_subscription')
    // .on('postgres_changes', {
    //   event: '*',
    //   schema: 'public',
    //   table: 'activities', // or 'travelDays'
    // }, payload => {
    //   console.log('[Realtime Test] Event received:', payload);
    // })
    // .subscribe((status) => {
    //   console.log('[Realtime Test] Channel status:', status);
    // });

    return () => {
      supabase.removeChannel(travelDaysChannel);
      supabase.removeChannel(activitiesChannel);
    //   supabase.removeChannel(testChannel);
    };
  }, [itinDbId, onTravelDaysChange, onActivitiesChange]);
}