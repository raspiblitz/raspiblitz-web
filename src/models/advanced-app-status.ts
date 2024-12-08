export interface AdvancedAppStatusElectron {
	version: string;
	localIP: string;
	publicIP: string;
	portTCP: string;
	portSSL: string;
	TORaddress: string;
	initialSyncDone: boolean;
}
