#include "AEConfig.h"

#ifndef AE_OS_WIN
#include <AE_General.r>
#endif
	
resource 'PiPL' (16000) {
	{	/* array properties: 12 elements */
		/* [1] */
		Kind {
			AEEffect
		},
		/* [2] */
		Name {
			"R_O_I"
		},
		/* [3] */
		Category {
			"Sample Plug-ins"
		},
#ifdef MSWindows
		CodeWin32X86 {"EntryPointFunc"},
#else
		CodeMachOPowerPC {"EntryPointFunc"},
#endif
		/* [6] */
		AE_PiPL_Version {
			2,
			0
		},
		/* [7] */
		AE_Effect_Spec_Version {
			12,
			5
		},
		/* [8] */
		AE_Effect_Version {
			524289	/* 1.0 */
		},
		/* [9] */
		AE_Effect_Info_Flags {
			0
		},
		/* [10] */
		AE_Effect_Global_OutFlags {
		33554944

		},
		AE_Effect_Global_OutFlags_2 {
		5129
		},
		/* [11] */
		AE_Effect_Match_Name {
			"ADBE R_O_I"
		},
		/* [12] */
		AE_Reserved_Info {
			8
		}
	}
};
