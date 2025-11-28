import { IWavInfo } from "./IwavInfo";


export class WavProcessor {

    // If wav does not contain at least 1024 samples pad with zeroes,
    // If it exceeds crop to 1024 samples
    pad(channel: number[]): number[] {
        if (channel.length >= 1024) {
            return channel.slice(0, 1024);
        } else {
            const zeroArray: number[] = Array(1024 - channel.length).fill(0);
            return [...channel, ...zeroArray];
        }
    }

    // If wav is not 24-bit scale to 24-bit
    rescale_sample(sample: number, inputMaxValue: number, outputMaxValue: number = (1 << (24 - 1)) - 1) {
        return Math.floor(sample / inputMaxValue * outputMaxValue);
    }

    convertWavFile(wav: IWavInfo): IWavInfo {
        // If multi-channel convert to mono and pad data to 1024 samples
        let sampleData = this.pad(wav.channelData[0]);

        // Convert to range of 24-bit
        if (wav.bitsPerSample !== 24) {
            const inputMaxValue = (1 << (wav.bitsPerSample - 1)) - 1;
            const ouputMaxValue = (1 << (24 - 1)) - 1;

            for(let i = 0; i < sampleData.length; i++) {
                sampleData[i] = this.rescale_sample(sampleData[i], inputMaxValue, ouputMaxValue);
            }
        }

        // Assign to new channel data
        let channelData: number[][] = [];
        channelData.push(sampleData);

        return {
            audioFormat: wav.audioFormat,
            numChannels: 1,
            sampleRate: wav.sampleRate,
            byteRate: wav.sampleRate * 1 * 24 / 8,
            blockAlign: 1 * 24 / 8,
            bitsPerSample: 24,
            channelData: channelData,
        };
    }
}