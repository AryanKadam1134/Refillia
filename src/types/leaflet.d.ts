
import 'leaflet';
import * as ReactLeaflet from 'react-leaflet';

declare module 'react-leaflet' {
  export interface MapContainerProps extends ReactLeaflet.MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    zoomControl?: boolean;
  }

  export interface TileLayerProps extends ReactLeaflet.TileLayerProps {
    attribution: string;
    url: string;
  }
}
