import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync } from "expo-file-system";

import { Buffer } from "buffer";
import { IWavInfo, WavDecoder } from './wavDecoder';


export class WavImporter {
    binaryFiles: Buffer[];
    wavs: IWavInfo[];
    decoder: WavDecoder;

    constructor() {
        this.binaryFiles = [];
        this.wavs= [];
        this.decoder = new WavDecoder;
        
    }

    async LoadFiles(): Promise<Boolean> {
        // Reset storage
        this.binaryFiles = [];

        const documents = await DocumentPicker.getDocumentAsync({
            multiple: true,
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
            console.log("base64: ", s);
            // Convert to uint8array
            const buffer = Buffer.from(s, 'base64');
            console.log("Buffer", buffer);

            this.binaryFiles.push(buffer);
        }

        return true;
    }

    decodeFiles(): IWavInfo[] {
        // Reset storage
        this.wavs = [];

        this.binaryFiles.forEach(buffer => {
            try {
                const presetInfo = this.decoder.decodeWavFile(buffer);
                this.wavs.push(presetInfo);
            } catch (e) {
                console.log(e);
                throw e;
            }
        });

        return this.wavs;
    }
}