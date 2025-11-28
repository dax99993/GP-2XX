import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync } from "expo-file-system";

import { Buffer } from "buffer";
import { IWavInfo } from './IwavInfo';
import { WavDecoder } from './wavDecoder';
import { WavProcessor } from './wavProcessor';



export class WavImporter {
    binaryFiles: Buffer[];
    wavs: IWavInfo[];
    fileNames: String[];

    decoder: WavDecoder;
    processor: WavProcessor;

    constructor() {
        this.binaryFiles = [];
        this.fileNames= [];
        this.wavs = [];
        this.decoder = new WavDecoder;
        this.processor = new WavProcessor;
    }

    async LoadFiles(): Promise<Boolean> {
        // Reset storage
        this.binaryFiles = [];
        this.fileNames = [];

        // Just allow one IR at a time
        const documents = await DocumentPicker.getDocumentAsync({
            multiple: false,
            type: "audio/x-wav"
        });

        if (documents.canceled) {
            return false;
        }

        for (let i = 0; i < documents.assets.length; i = i + 1) {
            const asset = documents.assets[i];
            console.log("Asset", i, asset);
            // Read file
            const s = await readAsStringAsync(asset.uri, { encoding: 'base64' });
            //console.log("base64: ", s);
            // Convert to uint8array
            const buffer = Buffer.from(s, 'base64');
            //console.log("Buffer", buffer);

            this.binaryFiles.push(buffer);
            this.fileNames.push(asset.name);
        }

        return true;
    }

    decodeFiles(): IWavInfo[] {
        // Reset storage
        this.wavs = [];

        this.binaryFiles.forEach(buffer => {
            try {
                const wavInfo = this.decoder.decodeWavFile(buffer);
                this.wavs.push(wavInfo);
            } catch (e) {
                console.log(e);
                throw e;
            }
        });

        return this.wavs;
    }

    processWavs() {
        // Convert to Mono, 24-bit with 1024 samples
        this.wavs[0] = this.processor.convertWavFile(this.wavs[0]);
        console.log("New sample length = ", this.wavs[0].channelData[0].length);
    }
}