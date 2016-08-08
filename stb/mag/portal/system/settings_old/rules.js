/**
 * Customization rules for manual tune
 * @author DarkPark
 * @namespace
 */
RULES = {
	// Network
	'Network'                                     : true,
	'Network/Wired(Ethernet)'                     : true,
	'Network/Wired(Ethernet)/Auto(DHCP)'          : true,
	'Network/Wired(Ethernet)/Auto(DHCP),manualDNS': true,
	'Network/Wired(Ethernet)/Manual'              : true,
	'Network/Wired(Ethernet)/NoIP'                : true,
	'Network/PPPoE'                               : true,
	'Network/PPPoE/Auto(DHCP)'                    : true,
	'Network/PPPoE/Auto(DHCP),manualDNS'          : true,
	'Network/PPPoE/DisablePPPoE'                  : true,
	'Network/Wireless(Wi-Fi)'                     : true,
	'Network/Wireless(Wi-Fi)/Auto(DHCP)'          : true,
	'Network/Wireless(Wi-Fi)/Auto(DHCP),manualDNS': true,
	'Network/Wireless(Wi-Fi)/Manual'              : true,

	// Servers
	'Servers'                                     : true,
	'Servers/General'                             : true,
	'Servers/Portals'                             : true,
	'Servers/Portals/More'                        : true,
	'Servers/More'                                : true,

	// Video
	'Video'                                       : true,
	'Video/More'                                  : true,

	// Audio
	'Audio'                                       : true,
	'Audio/More'                                  : true,

	// Advanced Settings
	'AdvancedSettings'                            : true,
	'AdvancedSettings/more'                       : true,

	// Keyboard Layout
	'KeyboardLayout'                              : true,

	// Network Info
	'NetworkInfo'                                 : true,
	'NetworkInfo/Wired(Ethernet)'                 : true,
	'NetworkInfo/PPPoE'                           : true,
	'NetworkInfo/Wireless(Wi-Fi)'                 : true,

	// Device Info
	'DeviceInfo'                                  : true,

	// Reboot Portal
	'RebootPortal'                                : true,

	// Reboot Device
	'RebootDevice'                                : true,

	// Reset Settings
	'ResetSettings'                               : true,

	// Clear User Data
	'ClearUserData'                               : true,

	// Software Update
	'SoftwareUpdate'                              : true
};
