import {
  FESTIVAL_FACILITIES,
  isMapLocationReady,
  MAP_PENDING_LABEL,
  mapLocationLabel,
} from '@/lib/config/venue-map';

export function MapFacilityList() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FESTIVAL_FACILITIES.map((facility) => {
        const ready = isMapLocationReady(facility.location);

        return (
          <li key={facility.id} className="ink-shell scroll-mt-24 bg-card p-4" id={`facility-${facility.id}`}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="font-medium text-foreground">{facility.label}</h3>
              {ready ? null : <span className="ink-tag shrink-0">{MAP_PENDING_LABEL}</span>}
            </div>
            <p className="text-sm text-muted-foreground">{ready ? mapLocationLabel(facility.location) : '場所は調整中です'}</p>
            {facility.hint ? <p className="mt-2 text-xs text-muted-foreground">{facility.hint}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}
