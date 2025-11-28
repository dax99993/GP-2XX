
import { IPresetInfo } from '@/models/preset/IPresetInfo';
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync } from "expo-file-system";

import { Buffer } from "buffer";
import { PresetDecoder } from './presetDecoder';


export class PresetImporter {
    binaryFiles: Buffer[];
    presets: IPresetInfo[];
    decoder: PresetDecoder;

    constructor() {
        this.binaryFiles = [];
        this.presets = [];
        this.decoder = new PresetDecoder;
        
    }

    async LoadFiles(): Promise<Boolean> {
        // Reset storage
        this.binaryFiles = [];
        // this.selectedPresets = [];

        const documents = await DocumentPicker.getDocumentAsync({
            multiple: true,
            type: "application/octet-stream"
        });

        if (documents.canceled) {
            return false;
        }

        //console.log(documents.assets);
        for (let i = 0; i < documents.assets.length; i = i + 1) {
            const asset = documents.assets[i];
            console.log("Asset", i, asset);
            // Read file
            const s = await readAsStringAsync(asset.uri, { encoding: 'base64' });
            console.log("base64 =", s);
            // Convert to uint8array
            const buffer = Buffer.from(s, 'base64');
            console.log("Buffer", buffer);

            this.binaryFiles.push(buffer);
        }

        return true;
    }

    decodeFiles(): IPresetInfo[] {
        // Reset storage
        this.presets = [];

        this.binaryFiles.forEach(buffer => {
            try {
                const presetInfo = this.decoder.decodePRSTFile(buffer);
                this.presets.push(presetInfo);
            } catch (error: unknown) {
                throw error;
            }
        });

        return this.presets;
    }

}