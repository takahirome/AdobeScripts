#include "AEConfig.h"
#include "AE_EffectVers.h"

#ifndef AE_OS_WIN
	#include "AE_General.r"
#endif
resource 'PiPL' (16000) {
	{	/* array properties: 13 elements */
		/* [1] */
		Kind {
			AEEffect
		},
		/* [2] */
		Name {
			"Custom Comp UI"
		},
		/* [3] */
		Category {
			"Sample Plug-ins"
		},
#ifdef AE_OS_WIN
	#ifdef AE_PROC_INTELx64
		CodeWin64X86 {"EntryPointFunc"},
	#else
		CodeWin32X86 {"EntryPointFunc"},
	#endif
#else
	#ifdef AE_OS_MAC
		CodeMachOPowerPC {"EntryPointFunc"},
		CodeMacIntel32 {"EntryPointFunc"},
		CodeMacIntel64 {"EntryPointFunc"},
	#endif
#endif
		/* [6] */
		AE_PiPL_Version {
			2,
			0
		},
		/* [7] */
		AE_Effect_Spec_Version {
			PF_PLUG_IN_VERSION,
			PF_PLUG_IN_SUBVERS
		},
		/* [8] */
		AE_Effect_Version {
			1048576
			
		},
		/* [9] */
		AE_Effect_Info_Flags {
			0
		},
		/* [10] */
		AE_Effect_Global_OutFlags {
			33856
		},
		/* [11] */
		AE_Reserved_Info {
			8
		},
		/* [12] */
		AE_Effect_Match_Name {
			"ADBE Custom Comp UI"
		},
	}
};
