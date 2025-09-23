
import { IPresetInfo } from '@/models/preset/IPresetInfo';
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync } from "expo-file-system";

import { Buffer } from "buffer";
import { action, makeObservable, observable } from 'mobx';
import { PresetDecoder } from './presetDecoder';


export class PresetImporter {
    binaryFiles: Buffer[];
    presets: IPresetInfo[];
    selectedPresets: number[];
    decoder: PresetDecoder;

    constructor() {
        this.binaryFiles = [];
        this.presets = [];
        this.selectedPresets = [];
        this.decoder = new PresetDecoder;
        
        makeObservable(this, {
            selectedPresets: observable,

            SetSelectedPresets: action,
            SelectedPresetsHas: action,
            AddToSelectPresets: action,
            RemoveFromSelectPresets: action,
        });
    }

    SetSelectedPresets(positions: number[]) {
        this.selectedPresets = positions;
    }

    SelectedPresetsHas(position: number): boolean {
        return this.selectedPresets.includes(position);
    }

    AddToSelectPresets(position: number) {
        this.selectedPresets = [...this.selectedPresets, position].sort((a, b) => a - b)
    }

    RemoveFromSelectPresets(position: number) {
        this.selectedPresets= this.selectedPresets.filter(n => n != position).sort((a, b) => a - b)
    }

    get AllPresetsSelected(): boolean {
        return this.selectedPresets.length == this.presets.length;
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
            const presetInfo = this.decoder.decodePRSTFile(buffer);
            this.presets.push(presetInfo);
        });

        return this.presets;
    }

}