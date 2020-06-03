interface PackageType {
    name: string;
    version?: string;
    isDev?: boolean;
}
declare const LogColor = "\u001B[32m";
declare const spawn: any;
declare const fs: any;
declare const path: any;
declare const argv: any;
declare function app(): Promise<void>;
declare function installPackages(packages: PackageType[], directory: string): Promise<void>;
declare function installPackagesAdvanced(packages: PackageType[], directory: string, dev: boolean): Promise<any>;
declare function createReactNativeApp(appName: string): Promise<any>;
declare function createReactScriptsApp(appName: string): Promise<any>;
declare function logSpaced(args: any): void;
declare function excludeObjectKeys(object: object, ignoredKeys: string[]): object;
declare function replaceValuesOfObject(object: object, search: string, replace: string): object;
declare function prefixObject(object: object, prefix: string): object;
