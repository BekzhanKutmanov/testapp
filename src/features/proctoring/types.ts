export type ProctorSnapshotReason = 'no-face' | 'looking-away' | 'multiple-faces' | 'periodic'

export interface ProctorSnapshot {
  id: string
  image: string
  reason: ProctorSnapshotReason
  reasonLabel: string
  capturedAt: string
  facesDetected: number
}

export interface ProctorStats {
  noFaceViolations: number
  lookingAwayViolations: number
  multipleFacesViolations: number
  periodicSnapshots: number
}

export interface ProctorReport {
  finishedAt: string
  startedAt: string
  durationSeconds: number
  honestyIndex: number
  totalViolations: number
  stats: ProctorStats
  snapshots: ProctorSnapshot[]
}
