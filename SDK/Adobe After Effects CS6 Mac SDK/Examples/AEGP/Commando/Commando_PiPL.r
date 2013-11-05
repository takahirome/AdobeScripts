#include "AEConfig.h"

#ifndef AE_OS_WIN
	#include "AE_General.r"
#endif
resource 'PiPL' (16000) {
	{	/* array properties: 7 elements */
		/* [1] */
		Kind {
			AEGP
		},
		/* [2] */
		Name {
			"Commando"
		},
		/* [3] */
		Category {
			"General Plugin"
		},
		/* [4] */
		Version {
			196608
		},
#ifdef AE_OS_WIN
		CodeWin32X86 {"EntryPointFunc"},
#else
	#ifdef AE_OS_MAC
		CodeMachOPowerPC {"EntryPointFunc"},
		CodeMacIntel32 {"EntryPointFunc"},
		CodeMacIntel64 {"EntryPointFunc"},
	#endif
#endif
	}
};
