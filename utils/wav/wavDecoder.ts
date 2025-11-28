import { IWavInfo } from "./IwavInfo";


export class WavDecoder {

    decodeWavFile(buffer: Buffer): IWavInfo {
        let offset = 0;
        console.log("Number of bytes in file", buffer.byteLength);

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

        // Can be 16, 18 or 40
        const subChunk1Size = buffer.readUint32LE(offset);
        offset += 4;
        if(subChunk1Size !== 16 && subChunk1Size !== 18 && subChunk1Size !== 40) {
            throw new Error(`Invalid fmt chunk: ${subChunk1Size}`);
        }

        // Value 1 -> PCM ; 3 -> IEEE float ; 6 -> A-Law ; 7 -> MU-Law ; 8 -> Extensible
        const audioFormat = buffer.readUint16LE(offset);
        offset += 2;
        if (audioFormat !== 1) {
            throw new Error(`Unsupported audio format: ${audioFormat}`);
        }

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

        // Handle different fmt chunk sizes
        if (subChunk1Size === 18) {
            const extensionSize = buffer.readUint16LE(offset);
            offset += 2;
            console.log(`Extension size: ${extensionSize}`);
        } else if (subChunk1Size === 40) {
            throw new Error("Unsupported fmt chunk size.");
        }


        // Sanity checks
        const expectedByteRate = sampleRate * numChannels * bitsPerSample / 8;
        if (byteRate !== expectedByteRate) {
            throw new Error(`Invalid byte rate: ${byteRate} expected ${expectedByteRate}`);
        }

        const expectedBlockAlign = numChannels * bitsPerSample / 8;
        if (blockAlign !== expectedBlockAlign) {
            throw new Error(`Invalid block align: ${blockAlign} expected ${expectedBlockAlign}`);
        }

        console.log(`ChunkID ${chunkId} ; ChunkSize ${chunkSize}; Format ${format}`);
        console.log(`subChunk1ID ${subChunk1Id} ; subChunk1Size ${subChunk1Size}`);
        console.log(`audioFormat ${audioFormat} ; numChannels ${numChannels} ; sampleRate ${sampleRate}`);
        console.log(`byteRate ${byteRate} ; blockAlign ${blockAlign} ; bitsPerSample ${bitsPerSample}`);

        // data chunk
        console.log("subChunk2Id offset", offset);
        console.log(`subChunk2Id ${buffer.readUInt8(offset)} ${buffer.readUInt8(offset + 1)} ${buffer.readUInt8(offset + 2)} ${buffer.readUInt8(offset + 3)}`);
        const subChunk2Id = buffer.readUint32BE(offset);
        offset += 4;
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
                const sampleValue: number = buffer.readIntLE(offset, bitsPerSample / 8);
                offset += bitsPerSample / 8;
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