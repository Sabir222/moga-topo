"use client"

import { useEffect, useRef, useState } from "react"
import * as turf from "@turf/turf"

type DrawMapProps = {
  initialGeoJson: GeoJSON.Feature<GeoJSON.Polygon> | null
  onChange: (payload: {
    geojson: GeoJSON.Feature<GeoJSON.Polygon> | null
    area: number | null
  }) => void
}

export function DrawMap({ initialGeoJson, onChange }: DrawMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any>(null)
  const featureGroupRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) {
        return
      }

      const L = await import("leaflet")
      await import("leaflet-draw")

      if (cancelled || !mapRef.current) {
        return
      }

      const map = L.map(mapRef.current, {
        center: [31.5085, -9.7595],
        zoom: 11,
        zoomControl: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const drawnItems = new L.FeatureGroup()
      map.addLayer(drawnItems)

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: false,
            shapeOptions: {
              color: "#0f766e",
              fillColor: "#14b8a6",
              fillOpacity: 0.2,
            },
          },
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: true,
        },
      })

      map.addControl(drawControl)

      const emitPolygon = () => {
        const layers = drawnItems.getLayers()
        if (layers.length === 0) {
          onChange({ geojson: null, area: null })
          return
        }

        const firstLayer = layers[0] as any
        const feature =
          firstLayer.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>
        const area = turf.area(feature)
        onChange({ geojson: feature, area })
      }

      map.on("draw:created", (event: any) => {
        drawnItems.clearLayers()
        drawnItems.addLayer(event.layer)
        emitPolygon()
      })

      map.on("draw:edited", () => {
        emitPolygon()
      })

      map.on("draw:deleted", () => {
        emitPolygon()
      })

      if (initialGeoJson) {
        const geoJsonLayer = L.geoJSON(initialGeoJson)
        geoJsonLayer.eachLayer((layer) => {
          drawnItems.addLayer(layer)
        })
        map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] })
      }

      mapInstanceRef.current = map
      featureGroupRef.current = drawnItems
      setReady(true)
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        featureGroupRef.current = null
      }
    }
  }, [initialGeoJson, onChange])

  return (
    <div className="space-y-3">
      <div
        ref={mapRef}
        className="h-[420px] w-full overflow-hidden rounded-xl border border-border"
      />
      <p className="text-xs text-muted-foreground">
        {ready
          ? "Draw one polygon for your land. You can edit or delete it any time."
          : "Loading map..."}
      </p>
    </div>
  )
}
