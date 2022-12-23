export interface AdsbData {
  message: string,
  decoded?: string,
  parsed?: Position
}

export interface Position {
  callsign: string,
  lon: number,
  lat: number,
  altitude: number,
  speed: number,
  heading: number,
  timestamp: number
}

export type PositionTuple = [string, number, number, number, number, number, number]
