export interface IWavInfo {
    audioFormat: number,
    numChannels: number,
    sampleRate: number,
    byteRate: number,
    blockAlign: number,
    bitsPerSample: number,
    channelData: number[][],
}