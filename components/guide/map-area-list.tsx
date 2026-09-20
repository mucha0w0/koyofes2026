import {
  CAMPUS_AREA_GROUPS,
  isMapLocationReady,
  MAP_PENDING_LABEL,
  mapLocationLabel,
} from '@/lib/config/venue-map';

export function MapAreaList() {
  return (
    <div className="space-y-10">
      {CAMPUS_AREA_GROUPS.map((group) => {
        const anyReady = group.areas.some((area) => isMapLocationReady(area.use));

        return (
          <section key={group.id} aria-labelledby={`area-group-${group.id}`}>
            <h3 className="mb-4 text-lg font-medium text-foreground" id={`area-group-${group.id}`}>
              {group.label}
            </h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.areas.map((area) => {
                const ready = isMapLocationReady(area.use);

                return (
                  <li key={area.id} className="ink-shell scroll-mt-24 bg-card p-4" id={`area-${area.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-medium text-foreground">{area.name}</h4>
                      {anyReady && !ready ? <span className="ink-tag shrink-0">{MAP_PENDING_LABEL}</span> : null}
                    </div>
                    {ready ? <p className="mt-2 text-sm text-muted-foreground">{mapLocationLabel(area.use)}</p> : null}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
