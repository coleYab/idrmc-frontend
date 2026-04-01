import { useEffect, useState } from 'react';
import { incidentService } from '@/services/incidentServices';
import { Incident, IncidentStatus } from '@/lib/types/incident';

export const useIncidents = (status?: IncidentStatus) => {
  const [data, setData] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = status
        ? await incidentService.getByStatus(status)
        : await incidentService.getAll();

      setData(res);
      setLoading(false);
    };

    fetchData();
  }, [status]);

  return { data, loading };
};
