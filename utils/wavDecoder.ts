
export interface IWavInfo {
    audioFormat: number,
    numChannels: number,
    sampleRate: number,
    byteRate: number,
    blockAlign: number,
    bitsPerSample: number,
    channelData: number[][],
}

export class WavDecoder {

    decodeWavFile(buffer: Buffer): IWavInfo {
        let offset = 0;
        console.log(buffer.byteOffset);
        // RIFF Chunk descriptor
        // ChunkID -> RIFF
        const chunkId = buffer.readUInt32BE(offset);
        offset += 4;
        if (chunkId !== 0x52494646) {
            throw new Error(`ChunkId is not RIFF: ${chunkId}`);
        }
        const chunkSize = buffer.readUint32LE(offset);
        offset += 4; // offset should be 8
        if( chunkSize !== buffer.byteLength - offset) {
            console.log(`Incorrect file size: ${buffer.byteLength - 8} expected ${chunkSize}`);
        }

        const format = buffer.readUInt32BE(offset);
        offset += 4;
        if (format !== 0x57415645) {
            throw new Error(`Format is not WAVE: ${format}`);
        }

        // Wave format consists of two subchunks "fmt" and "data"

        // "fmt " chunk: describes the sound data's format
        const subChunk1Id = buffer.readUint32BE(offset);
        offset += 4;
        if (subChunk1Id !== 0x666d7420) {
            throw new Error(`SubChunk1D is not "fmt ": ${subChunk1Id}`);
        }

        const subChunk1Size = buffer.readUint32LE(offset);
        offset += 4;
        // if( subChunk1Size !== 16) {
        //     console.log(`File is not PCM: ${subChunk1Size}`);
        // }

        // Value 1 -> PCM ; other values mean some sort of compression
        const audioFormat = buffer.readUint16LE(offset);
        offset += 2;

        const numChannels = buffer.readUint16LE(offset);
        offset += 2;

        const sampleRate = buffer.readUint32LE(offset);
        offset += 4;

        const byteRate = buffer.readUint32LE(offset);
        offset += 4;

        const blockAlign = buffer.readUint16LE(offset);
        offset += 2;

        const bitsPerSample = buffer.readUint16LE(offset);
        offset += 2;

        // Sanity checks
        const expectedByteRate = sampleRate * numChannels * bitsPerSample / 8;
        if (byteRate !== expectedByteRate) {
            throw new Error(`Invalid byte rate: ${byteRate} expected ${expectedByteRate}`);
        }

        const expectedBlockAlign = numChannels * bitsPerSample / 8;
        if (blockAlign !== expectedBlockAlign) {
            throw new Error(`Invalid block align: ${blockAlign} expected ${expectedBlockAlign}`);
        }

        // data chunk
        const subChunk2Id = buffer.readUint32BE(offset);
        offset += 4;
        console.log("chunk2id offset", offset);
        if (subChunk2Id !== 0x64617461) {
            throw new Error(`SubChunk2ID is not "data": ${subChunk2Id.toString(16)}`);
        }

        // This equals numSamples * numChannels * bitsPerSample / 8
        const subChunk2Size = buffer.readUint32LE(offset);
        offset += 4;

        // decode data chunk according to format (We want a signed 24-bit encoding)
        const numSamples = subChunk2Size / numChannels / (bitsPerSample / 8);
        
        // Should we throw an error if file in not mono channel????
        // Create a 2d array dim 0 are the channels and dim 1 are the samples
        var channelData: number[][] = Array.from({length: numChannels}, () => []);

        for (let sampleIndex = 0; sampleIndex < numSamples; sampleIndex++) {
            for(let i = 0; i < numChannels; i++) {
                const sampleValue: number = buffer.readIntLE(i, bitsPerSample / 8);
                channelData[i].push(sampleValue);
            }
        }

        return {
            audioFormat: audioFormat,
            numChannels: numChannels,
            sampleRate: sampleRate,
            byteRate: byteRate,
            blockAlign: blockAlign,
            bitsPerSample: bitsPerSample,
            channelData: channelData,
        };
    }
}