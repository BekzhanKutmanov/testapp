export interface ProctorType {
    gallery: Array<{ url: string; timestamp: number; type: string }>
    stats: {
        lookingAwayCount: number
        noFaceCount: number
        multipleFacesCount: number
        totalViolations: number
        honestyIndex: number
    }
}
