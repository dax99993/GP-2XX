
import { IPresetInfo } from '@/models/preset/IPresetInfo';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { Buffer } from 'buffer';
import { action, makeObservable, observable } from 'mobx';
import { PresetEncoder } from './presetEncoder';


export class PresetExporter{
    selectedPresets: number[];

    encoder: PresetEncoder;

    constructor() {
        this.selectedPresets = [];

        this.encoder = new PresetEncoder();

        makeObservable(this, {
            selectedPresets: observable,

            SetSelectedPresets: action,
            SelectedPresetsHas: action,
            AddToSelectedPresets: action,
            RemoveFromSelectedPresets: action,
            ResetSelectedPresets: action,
        });
    }

    SetSelectedPresets(positions: number[]) {
        this.selectedPresets = positions;
    }

    SelectedPresetsHas(position: number): boolean {
        return this.selectedPresets.includes(position);
    }

    AddToSelectedPresets(position: number) {
        this.selectedPresets = [...this.selectedPresets, position].sort((a, b) => a - b)
    }

    RemoveFromSelectedPresets(position: number) {
        this.selectedPresets= this.selectedPresets.filter(n => n != position).sort((a, b) => a - b)
    }

    ResetSelectedPresets() {
        this.selectedPresets = [];
    }

    async ExportPresetFiles(presets: IPresetInfo[]): Promise<Boolean> {
        // // Reset storage
        // this.binaryFiles = [];
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (!permission.granted) {
            return false
        }

        const baseUri = permission.directoryUri;

        presets.forEach(async (presetInfo: IPresetInfo) => {
            // For each file share
            const encodedBytes = this.encoder.encodePresetBinaryFile(presetInfo);
            console.log("Encoded bytes", encodedBytes);

            // Get URI from cacheDirectory
            const filename = presetInfo.bankCode + ' ' + presetInfo.name + '.prst';
            const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
                    baseUri,
                    filename,
                    "application/octet-stream"
                );
            console.log('File created successfully at:', fileUri);

            // Write buffer to temp uri
            const content = Buffer.from(encodedBytes).toString('base64')
            console.log("File content", content);

            await FileSystem.writeAsStringAsync(fileUri, content, { encoding: 'base64' });
            console.log('File written successfully at:', fileUri);
        })

        return true;
    }

    // async SharePresetFiles(presetInfo: IPresetInfo): Promise<Boolean> {
    async SharePresetFiles(presets: IPresetInfo[]): Promise<Boolean> {
        // // Reset storage
        // this.binaryFiles = [];

        const sharingAvailable = await Sharing.isAvailableAsync();
        if (!sharingAvailable || presets.length == 0) {
            console.log("Sharing is not available in this device");
            return false
        }

        // For the moment restrict to the share the first presets
        if (presets.length == 1) {
            const presetInfo = presets[0];

            const encodedBytes = this.encoder.encodePresetBinaryFile(presetInfo);

            //console.log("Encoded bytes", encodedBytes);

            // Get URI from cacheDirectory
            const filename = presetInfo.bankCode + ' ' + presetInfo.name + '.prst'
            const fileUri = FileSystem.cacheDirectory + filename;
            console.log('File uri:', fileUri);

            // Write buffer to uri
            const content = Buffer.from(encodedBytes).toString('base64')
            console.log("File content", content);

            await FileSystem.writeAsStringAsync(fileUri, content, { encoding: 'base64' });
            console.log('File created successfully at:', fileUri);

            // Share
            await Sharing.shareAsync(fileUri, { dialogTitle: "Share GP-200 preset", mimeType: "application/octet-stream" });
            console.log("Shared", filename);
        } else {
            // If multiple presets then create a zip file
            // presets.forEach(async (presetInfo: IPresetInfo) => {
            //     // For each file share
            //     const encodedBytes = this.encodePreset(presetInfo);
            //     //console.log("Encoded bytes", encodedBytes);

            //     // Get URI from cacheDirectory
            //     const filename = presetInfo.bankCode + ' ' + presetInfo.name + '.prst'
            //     const fileUri = FileSystem.cacheDirectory + filename;
            //     console.log('File uri:', fileUri);

            //     // Write buffer to uri
            //     const content = Buffer.from(encodedBytes).toString('base64')
            //     console.log("File content", content);

            //     await FileSystem.writeAsStringAsync(fileUri, content, { encoding: 'base64' });
            //     console.log('File created successfully at:', fileUri);

            //     // Create zip file with all presets
            //     const zipFileName = "Presets.zip"

            //     // Share zip file
            //     await Sharing.shareAsync(fileUri, { dialogTitle: "Share GP-200 preset", mimeType: "application/x-zip" });
            //     console.log("Shared", filename);
            // })
        }


        return true;
    }

}